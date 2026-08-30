// ============================================================
// HealQ Backend - Node.js + Express + JSON file storage
// No .env and no MongoDB required.
// ============================================================

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const hospitalsByState = require("./data/hospitals");

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, "data", "database.json");

app.use(cors());
app.use(express.json());

const DEPARTMENTS = {
  GM: "General Medicine",
  OR: "Orthopedics",
  PD: "Pediatrics",
  CD: "Cardiology"
};

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch (error) {
    const fresh = { patients: [], tokens: [] };
    writeDB(fresh);
    return fresh;
  }
}

function writeDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function allHospitals() {
  return Object.entries(hospitalsByState).flatMap(([state, names]) =>
    names.map((name, index) => ({
      id: `${state.slice(0, 3).toUpperCase()}-${index + 1}-${name
        .replace(/[^A-Za-z0-9]/g, "")
        .slice(0, 8)
        .toUpperCase()}`,
      state,
      name
    }))
  );
}

function findHospital(name) {
  const wanted = String(name || "").trim().toLowerCase();
  return allHospitals().find(h => h.name.toLowerCase() === wanted);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function nextTokenNumber(db, hospitalId, dept) {
  const nums = db.tokens
    .filter(t => t.date === today() && t.hospitalId === hospitalId && t.department === dept)
    .map(t => Number(t.tokenNumber))
    .filter(Number.isFinite);
  return nums.length ? Math.max(...nums) + 1 : 101;
}

function seedQueueIfEmpty(db, hospital) {
  const date = today();
  const hasAny = db.tokens.some(t => t.date === date && t.hospitalId === hospital.id);
  if (hasAny) return;

  const starts = { GM: 104, OR: 107, PD: 105, CD: 111 };
  const counts = { GM: 6, OR: 3, PD: 5, CD: 2 };
  const demoNames = ["A. Sharma", "R. Iyer", "P. Nair", "S. Khan", "M. Reddy", "V. Rao", "D. Kapoor", "N. Singh"];
  let nameIndex = 0;

  for (const dept of Object.keys(DEPARTMENTS)) {
    for (let i = 0; i < counts[dept]; i++) {
      const n = starts[dept] + i;
      db.tokens.push({
        id: `DEMO-${hospital.id}-${dept}-${n}`,
        tokenNumber: `${dept}-${n}`,
        patientId: null,
        patientName: demoNames[nameIndex % demoNames.length],
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        state: hospital.state,
        department: dept,
        departmentName: DEPARTMENTS[dept],
        abha: "DEMO-ABHA",
        email: "demo@healq.in",
        phone: "9000000000",
        status: "WAITING",
        date,
        createdAt: new Date(Date.now() - (counts[dept] - i) * 60000).toISOString()
      });
      nameIndex++;
    }
  }
  writeDB(db);
}

app.get("/", (req, res) => {
  res.json({ success: true, message: "HealQ Backend API is running", version: "1.0.0" });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, server: "online", database: "JSON file connected" });
});

app.get("/api/hospitals", (req, res) => {
  res.json({ success: true, hospitals: allHospitals() });
});

app.get("/api/hospitals/state/:state", (req, res) => {
  const state = req.params.state.toLowerCase();
  const result = allHospitals().filter(h => h.state.toLowerCase() === state);
  res.json({ success: true, hospitals: result });
});

app.get("/api/hospitals/by-name/:name", (req, res) => {
  const hospital = findHospital(decodeURIComponent(req.params.name));
  if (!hospital) return res.status(404).json({ success: false, message: "Hospital not found" });
  res.json({ success: true, hospital });
});

app.get("/api/hospitals/:id/departments", (req, res) => {
  const hospital = allHospitals().find(h => h.id === req.params.id);
  if (!hospital) return res.status(404).json({ success: false, message: "Hospital not found" });
  res.json({ success: true, hospital: hospital.name, departments: Object.entries(DEPARTMENTS).map(([code, name]) => ({ code, name })) });
});

app.post("/api/patients", (req, res) => {
  const { name, age, gender, phone, abhaId, email } = req.body;
  if (!name || !phone) return res.status(400).json({ success: false, message: "Name and phone are required" });

  const db = readDB();
  const patient = {
    id: `P${Date.now()}${Math.floor(Math.random() * 1000)}`,
    name: String(name).trim(),
    age: Number(age) || 0,
    gender: gender || "Not specified",
    phone: String(phone),
    abhaId: abhaId || "",
    email: email || "",
    createdAt: new Date().toISOString()
  };
  db.patients.push(patient);
  writeDB(db);
  res.status(201).json({ success: true, message: "Patient registered successfully", patient });
});

app.get("/api/patients/:id", (req, res) => {
  const patient = readDB().patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
  res.json({ success: true, patient });
});

app.post("/api/tokens", (req, res) => {
  const { patientId, hospitalId, hospitalName, state, department } = req.body;
  if (!patientId || !hospitalId || !department) {
    return res.status(400).json({ success: false, message: "Patient, hospital and department are required" });
  }
  if (!DEPARTMENTS[department]) {
    return res.status(400).json({ success: false, message: "Invalid department" });
  }

  const db = readDB();
  const patient = db.patients.find(p => p.id === patientId);
  if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });

  const hospital = allHospitals().find(h => h.id === hospitalId) || findHospital(hospitalName);
  if (!hospital) return res.status(404).json({ success: false, message: "Hospital not found" });

  const number = nextTokenNumber(db, hospital.id, department);
  const token = {
    id: `T${Date.now()}${Math.floor(Math.random() * 1000)}`,
    tokenNumber: `${department}-${number}`,
    patientId: patient.id,
    patientName: patient.name,
    hospitalId: hospital.id,
    hospitalName: hospital.name,
    state: state || hospital.state,
    department,
    departmentName: DEPARTMENTS[department],
    abha: patient.abhaId,
    email: patient.email,
    phone: patient.phone,
    status: "WAITING",
    date: today(),
    createdAt: new Date().toISOString()
  };
  db.tokens.push(token);
  writeDB(db);
  res.status(201).json({ success: true, message: "OPD token generated successfully", token });
});

app.get("/api/queue/by-hospital/:hospitalName/:department", (req, res) => {
  const hospital = findHospital(decodeURIComponent(req.params.hospitalName));
  if (!hospital) return res.status(404).json({ success: false, message: "Hospital not found" });
  const dept = req.params.department;
  if (!DEPARTMENTS[dept]) return res.status(400).json({ success: false, message: "Invalid department" });

  const db = readDB();
  seedQueueIfEmpty(db, hospital);
  const queue = readDB().tokens
    .filter(t => t.date === today() && t.hospitalId === hospital.id && t.department === dept && t.status !== "COMPLETED" && t.status !== "CANCELLED")
    .sort((a, b) => Number(String(a.tokenNumber).split("-")[1]) - Number(String(b.tokenNumber).split("-")[1]));

  const current = queue.find(t => t.status === "CALLED" || t.status === "IN_CONSULTATION");
  res.json({ success: true, currentToken: current ? current.tokenNumber : null, waitingCount: queue.filter(t => t.status === "WAITING").length, queue });
});

app.get("/api/tokens/:id", (req, res) => {
  const token = readDB().tokens.find(t => t.id === req.params.id);
  if (!token) return res.status(404).json({ success: false, message: "Token not found" });
  res.json({ success: true, token });
});

app.put("/api/tokens/:id/status", (req, res) => {
  const allowed = ["WAITING", "CALLED", "IN_CONSULTATION", "COMPLETED", "CANCELLED"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid token status" });
  const db = readDB();
  const token = db.tokens.find(t => t.id === req.params.id);
  if (!token) return res.status(404).json({ success: false, message: "Token not found" });
  token.status = req.body.status;
  token.updatedAt = new Date().toISOString();
  writeDB(db);
  res.json({ success: true, message: "Token status updated", token });
});

app.post("/api/queue/:hospitalId/:department/next", (req, res) => {
  const db = readDB();
  const waiting = db.tokens
    .filter(t => t.date === today() && t.hospitalId === req.params.hospitalId && t.department === req.params.department && t.status === "WAITING")
    .sort((a, b) => Number(String(a.tokenNumber).split("-")[1]) - Number(String(b.tokenNumber).split("-")[1]));
  if (!waiting.length) return res.json({ success: false, message: "No patients waiting" });
  waiting[0].status = "CALLED";
  waiting[0].calledAt = new Date().toISOString();
  writeDB(db);
  res.json({ success: true, message: "Next patient called", token: waiting[0] });
});

app.post("/api/tokens/:id/complete", (req, res) => {
  const db = readDB();
  const token = db.tokens.find(t => t.id === req.params.id);
  if (!token) return res.status(404).json({ success: false, message: "Token not found" });
  token.status = "COMPLETED";
  token.completedAt = new Date().toISOString();
  writeDB(db);
  res.json({ success: true, message: "Consultation completed", token });
});

app.post("/api/reset", (req, res) => {
  writeDB({ patients: [], tokens: [] });
  res.json({ success: true, message: "Backend demo data reset" });
});

app.get("/api/stats/:hospitalId/:department", (req, res) => {
  const tokens = readDB().tokens.filter(t => t.date === today() && t.hospitalId === req.params.hospitalId && t.department === req.params.department);
  res.json({
    success: true,
    stats: {
      total: tokens.length,
      waiting: tokens.filter(t => t.status === "WAITING").length,
      completed: tokens.filter(t => t.status === "COMPLETED").length,
      consultation: tokens.filter(t => t.status === "IN_CONSULTATION").length
    }
  });
});

app.use((req, res) => res.status(404).json({ success: false, message: "API endpoint not found" }));

app.listen(PORT, () => {
  console.log("======================================");
  console.log("       HealQ Backend Server");
  console.log("======================================");
  console.log(`Server: http://localhost:${PORT}`);
  console.log("Database: JSON file");
  console.log("Status: ONLINE");
  console.log("======================================");
});
