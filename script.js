/* ============================================================
   HealQ — Complete Demo JavaScript
   State → Hospital → Department → Patient → Token
============================================================ */

"use strict";


/* ============================================================
   STORAGE
============================================================ */

const STORAGE_KEY = "healq_demo_state_v5";


/* ============================================================
   INDIA — STATES + UNION TERRITORIES
============================================================ */

const INDIA_HOSPITALS = {

    "Andhra Pradesh": [
        "AIIMS Mangalagiri",
        "Government General Hospital, Vijayawada",
        "Sri Venkateswara Institute of Medical Sciences, Tirupati"
    ],

    "Arunachal Pradesh": [
        "Tomar Institute of Health and Medical Sciences, Naharlagun",
        "TRIHMS Hospital, Naharlagun"
    ],

    "Assam": [
        "AIIMS Guwahati",
        "Gauhati Medical College and Hospital",
        "Silchar Medical College and Hospital"
    ],

    "Bihar": [
        "AIIMS Patna",
        "Patna Medical College and Hospital",
        "Indira Gandhi Institute of Medical Sciences, Patna"
    ],

    "Chhattisgarh": [
        "AIIMS Raipur",
        "Dr. Bhim Rao Ambedkar Memorial Hospital, Raipur",
        "District Hospital, Bilaspur"
    ],

    "Goa": [
        "Goa Medical College and Hospital",
        "District Hospital, Margao"
    ],

    "Gujarat": [
        "AIIMS Rajkot",
        "Civil Hospital, Ahmedabad",
        "Gujarat Cancer & Research Institute, Ahmedabad"
    ],

    "Haryana": [
        "AIIMS Rewari",
        "Post Graduate Institute of Medical Sciences, Rohtak",
        "Civil Hospital, Gurugram"
    ],

    "Himachal Pradesh": [
        "AIIMS Bilaspur",
        "Indira Gandhi Medical College, Shimla",
        "Dr. Rajendra Prasad Government Medical College, Kangra"
    ],

    "Jharkhand": [
        "AIIMS Deoghar",
        "Rajendra Institute of Medical Sciences, Ranchi",
        "MGM Medical College and Hospital, Jamshedpur"
    ],

    "Karnataka": [
        "AIIMS Raichur",
        "Bangalore Medical College and Research Institute",
        "Victoria Hospital, Bengaluru"
    ],

    "Kerala": [
        "Government Medical College, Thiruvananthapuram",
        "Government Medical College, Kozhikode",
        "Government Medical College, Kottayam"
    ],

    "Madhya Pradesh": [
        "AIIMS Bhopal",
        "Hamidia Hospital, Bhopal",
        "MGM Medical College and Hospital, Indore"
    ],

    "Maharashtra": [
        "AIIMS Nagpur",
        "Seth GS Medical College and KEM Hospital, Mumbai",
        "Government Medical College, Nagpur"
    ],

    "Manipur": [
        "Regional Institute of Medical Sciences, Imphal",
        "Jawaharlal Nehru Institute of Medical Sciences, Imphal"
    ],

    "Meghalaya": [
        "NEIGRIHMS, Shillong",
        "Civil Hospital, Shillong"
    ],

    "Mizoram": [
        "Zoram Medical College",
        "Civil Hospital, Aizawl"
    ],

    "Nagaland": [
        "Nagaland Institute of Medical Sciences and Research",
        "Naga Hospital Authority, Kohima"
    ],

    "Odisha": [
        "AIIMS Bhubaneswar",
        "SCB Medical College and Hospital, Cuttack",
        "MKCG Medical College and Hospital, Berhampur"
    ],

    "Punjab": [
        "AIIMS Bathinda",
        "Government Medical College, Amritsar",
        "Government Medical College, Patiala"
    ],

    "Rajasthan": [
        "AIIMS Jodhpur",
        "SMS Hospital, Jaipur",
        "RNT Medical College, Udaipur"
    ],

    "Sikkim": [
        "Sikkim Manipal Institute of Medical Sciences",
        "STNM Hospital, Gangtok"
    ],

    "Tamil Nadu": [
        "AIIMS Madurai",
        "Rajiv Gandhi Government General Hospital, Chennai",
        "Stanley Medical College and Hospital, Chennai"
    ],

    "Telangana": [
        "AIIMS Bibinagar",
        "Osmania General Hospital, Hyderabad",
        "Gandhi Hospital, Hyderabad"
    ],

    "Tripura": [
        "Agartala Government Medical College",
        "GBP Hospital, Agartala"
    ],

    "Uttar Pradesh": [
        "AIIMS Gorakhpur",
        "King George's Medical University, Lucknow",
        "SGPGIMS, Lucknow"
    ],

    "Uttarakhand": [
        "AIIMS Rishikesh",
        "Government Doon Medical College and Hospital",
        "Himalayan Hospital, Jolly Grant"
    ],

    "West Bengal": [
        "AIIMS Kalyani",
        "SSKM Hospital, Kolkata",
        "Calcutta National Medical College and Hospital",
        "R. G. Kar Medical College and Hospital"
    ],


    /* ========================================================
       UNION TERRITORIES
    ======================================================== */

    "Andaman and Nicobar Islands": [
        "GB Pant Hospital, Port Blair"
    ],

    "Chandigarh": [
        "PGIMER Chandigarh",
        "Government Multi-Specialty Hospital, Chandigarh"
    ],

    "Dadra and Nagar Haveli and Daman and Diu": [
        "Government Hospital, Silvassa",
        "Government Hospital, Daman"
    ],

    "Delhi": [
        "AIIMS New Delhi",
        "Safdarjung Hospital",
        "Ram Manohar Lohia Hospital",
        "Lok Nayak Hospital"
    ],

    "Jammu and Kashmir": [
        "AIIMS Jammu",
        "Government Medical College, Jammu",
        "Government Medical College, Srinagar"
    ],

    "Ladakh": [
        "Sonam Norboo Memorial Hospital, Leh",
        "District Hospital, Kargil"
    ],

    "Lakshadweep": [
        "Indira Gandhi Hospital, Kavaratti"
    ],

    "Puducherry": [
        "JIPMER, Puducherry",
        "Indira Gandhi Medical College and Research Institute"
    ]

};


/* ============================================================
   DEPARTMENTS
============================================================ */

const DEPARTMENTS = [

    {
        code: "GM",
        name: "General Medicine",
        avgConsult: 10,
        doctorsOnDuty: 3,
        doctorsTotal: 4
    },

    {
        code: "OR",
        name: "Orthopedics",
        avgConsult: 15,
        doctorsOnDuty: 2,
        doctorsTotal: 3
    },

    {
        code: "PD",
        name: "Pediatrics",
        avgConsult: 12,
        doctorsOnDuty: 3,
        doctorsTotal: 4
    },

    {
        code: "CD",
        name: "Cardiology",
        avgConsult: 18,
        doctorsOnDuty: 3,
        doctorsTotal: 3
    }

];


/* ============================================================
   SEED STATE
============================================================ */

function seedState() {

    const departments =
        DEPARTMENTS.map(
            dept => ({ ...dept })
        );

    const queue = [];

    const tokenSeq = {
        GM: 104,
        OR: 107,
        PD: 105,
        CD: 111
    };

    const startingCounts = {
        GM: 6,
        OR: 3,
        PD: 5,
        CD: 2
    };

    const names = [
        "A. Sharma",
        "R. Iyer",
        "P. Nair",
        "S. Khan",
        "M. Reddy",
        "V. Rao",
        "D. Kapoor",
        "N. Singh"
    ];

    let nameIndex = 0;

    departments.forEach(dept => {

        for (
            let i = 0;
            i < startingCounts[dept.code];
            i++
        ) {

            const number =
                tokenSeq[dept.code];

            queue.push({

                id:
                    `${dept.code}-${number}`,

                tokenNumber:
                    `${dept.code}-${number}`,

                dept:
                    dept.code,

                name:
                    names[
                        nameIndex %
                        names.length
                    ],

                hospital:
                    "AIIMS New Delhi",

                state:
                    "Delhi",

                abha:
                    "DEMO-ABHA",

                email:
                    "demo@healq.in",

                phone:
                    "9000000000",

                bookedAt:
                    Date.now() -
                    (
                        startingCounts[dept.code] -
                        i
                    ) *
                    60000

            });

            tokenSeq[dept.code]++;

            nameIndex++;

        }

    });


    return {

        departments,

        queue,

        tokenSeq,

        bedsAvailable: 23,

        bedsTotal: 30,

        avgDelayMinutes: 6

    };

}


/* ============================================================
   STORAGE
============================================================ */

function saveState() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state)
        );

    } catch (error) {

        console.warn(
            "localStorage unavailable:",
            error
        );

    }

}


function loadState() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (saved) {

            const parsed =
                JSON.parse(saved);

            if (
                parsed &&
                Array.isArray(parsed.queue) &&
                Array.isArray(parsed.departments)
            ) {

                return parsed;

            }

        }

    } catch (error) {

        console.warn(
            "Could not load state:",
            error
        );

    }

    return seedState();

}


let state = loadState();


/* ============================================================
   QUEUE
============================================================ */

function waitingCountFor(deptCode) {

    return state.queue.filter(
        token =>
            token.dept === deptCode
    ).length;

}


function estimatedWaitFor(deptCode) {

    const dept =
        state.departments.find(
            item =>
                item.code === deptCode
        );

    if (!dept) return 0;

    const count =
        waitingCountFor(deptCode);

    const doctors =
        Math.max(
            1,
            dept.doctorsOnDuty
        );

    return Math.max(
        5,
        Math.round(
            (
                count *
                dept.avgConsult
            ) /
            Math.min(
                doctors,
                2
            )
        )
    );

}


/* ============================================================
   LIVE BOARD
============================================================ */

function renderBoard() {

    const board =
        document.getElementById(
            "board-rows"
        );

    if (!board) return;


    board.innerHTML =
        state.departments
            .map(dept => {

                const count =
                    waitingCountFor(
                        dept.code
                    );

                const wait =
                    estimatedWaitFor(
                        dept.code
                    );

                const deptQueue =
                    state.queue.filter(
                        token =>
                            token.dept ===
                            dept.code
                    );

                const latest =
                    deptQueue[
                        deptQueue.length - 1
                    ];

                const displayToken =
                    latest
                        ? latest.tokenNumber
                        : `${dept.code}-100`;


                return `

                    <div class="board-row">

                        <div class="board-dept">

                            ${dept.name}

                            <span>
                                DEPT · ${dept.code}
                                · ${count} waiting
                            </span>

                        </div>

                        <div class="token-flip">
                            ${displayToken}
                        </div>

                        <div class="wait-pill">
                            ~${wait} min
                        </div>

                    </div>

                `;

            })
            .join("");

}


/* ============================================================
   STATE DROPDOWN
============================================================ */

function populateStates() {

    const select =
        document.getElementById(
            "book-state"
        );

    if (!select) return;


    select.innerHTML =
        `<option value="">
            Select State / UT
        </option>`;


    Object.keys(
        INDIA_HOSPITALS
    )
    .sort()
    .forEach(stateName => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            stateName;

        option.textContent =
            stateName;

        select.appendChild(
            option
        );

    });

}


/* ============================================================
   HOSPITAL DROPDOWN
============================================================ */

function populateHospitals(
    stateName
) {

    const select =
        document.getElementById(
            "book-hospital"
        );

    if (!select) return;


    select.innerHTML =
        `<option value="">
            Select Hospital
        </option>`;

    select.disabled =
        true;


    if (!stateName) {

        return;

    }


    const hospitals =
        INDIA_HOSPITALS[
            stateName
        ];


    if (
        !Array.isArray(hospitals)
    ) {

        return;

    }


    hospitals.forEach(
        hospitalName => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                hospitalName;

            option.textContent =
                hospitalName;

            select.appendChild(
                option
            );

        }
    );


    select.disabled =
        false;

}


/* ============================================================
   DEPARTMENT DROPDOWN
============================================================ */

function populateDepartments() {

    const select =
        document.getElementById(
            "book-dept"
        );

    if (!select) return;


    select.innerHTML =
        `<option value="">
            Select Department
        </option>`;


    state.departments.forEach(
        dept => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                dept.code;

            option.textContent =
                dept.name;

            select.appendChild(
                option
            );

        }
    );


    select.disabled =
        false;

}


/* ============================================================
   BOOK TOKEN
============================================================ */

function bookToken(
    stateName,
    hospitalName,
    deptCode,
    patientName,
    abha,
    email,
    phone
) {

    const nextNumber =
        state.tokenSeq[
            deptCode
        ] || 100;


    const token = {

        id:
            `${deptCode}-${nextNumber}-${Date.now()}`,

        tokenNumber:
            `${deptCode}-${nextNumber}`,

        dept:
            deptCode,

        name:
            patientName,

        state:
            stateName,

        hospital:
            hospitalName,

        abha:
            abha,

        email:
            email,

        phone:
            phone,

        bookedAt:
            Date.now()

    };


    state.queue.push(
        token
    );


    state.tokenSeq[
        deptCode
    ] =
        nextNumber + 1;


    saveState();

    renderBoard();

    renderDashboard();


    return token;

}


/* ============================================================
   BOOKING FORM
============================================================ */

function setupBookingForm() {

    const form =
        document.getElementById(
            "book-form"
        );

    if (!form) return;


    const stateSelect =
        document.getElementById(
            "book-state"
        );

    const hospitalSelect =
        document.getElementById(
            "book-hospital"
        );

    const deptSelect =
        document.getElementById(
            "book-dept"
        );

    const nameInput =
        document.getElementById(
            "book-name"
        );

    const abhaInput =
        document.getElementById(
            "book-abha"
        );

    const emailInput =
        document.getElementById(
            "book-email"
        );

    const phoneInput =
        document.getElementById(
            "book-phone"
        );

    const confirmation =
        document.getElementById(
            "book-confirm"
        );


    populateStates();


    /* STATE → HOSPITAL */

    stateSelect.addEventListener(
        "change",
        function () {

            populateHospitals(
                this.value
            );


            deptSelect.innerHTML =
                `<option value="">
                    Select Department
                </option>`;

            deptSelect.disabled =
                true;

        }
    );


    /* HOSPITAL → DEPARTMENT */

    hospitalSelect.addEventListener(
        "change",
        function () {

            if (this.value) {

                populateDepartments();

            }

        }
    );


    /* SUBMIT */

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const stateName =
                stateSelect.value;

            const hospitalName =
                hospitalSelect.value;

            const deptCode =
                deptSelect.value;

            const patientName =
                nameInput.value.trim();

            const abha =
                abhaInput.value.trim();

            const email =
                emailInput.value.trim();

            const phone =
                phoneInput.value.trim();


            /* VALIDATION */

            if (!stateName) {

                alert(
                    "Please select State / UT."
                );

                return;

            }


            if (!hospitalName) {

                alert(
                    "Please select a hospital."
                );

                return;

            }


            if (!deptCode) {

                alert(
                    "Please select a department."
                );

                return;

            }


            if (!patientName) {

                alert(
                    "Please enter patient name."
                );

                return;

            }


            if (!abha) {

                alert(
                    "Please enter ABHA ID or UHID."
                );

                return;

            }


            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(email)
            ) {

                alert(
                    "Please enter a valid email address."
                );

                return;

            }


            if (
                !/^[0-9]{10}$/.test(phone)
            ) {

                alert(
                    "Please enter a valid 10-digit phone number."
                );

                return;

            }


            /* BOOK */

            const token =
                bookToken(
                    stateName,
                    hospitalName,
                    deptCode,
                    patientName,
                    abha,
                    email,
                    phone
                );


            const wait =
                estimatedWaitFor(
                    deptCode
                );


            const dept =
                state.departments.find(
                    item =>
                        item.code ===
                        deptCode
                );


            confirmation.hidden =
                false;


            confirmation.innerHTML = `

                <strong>
                    ✓ Token ${token.tokenNumber}
                    booked successfully!
                </strong>

                <br><br>

                <strong>Patient:</strong>
                ${escapeHtml(patientName)}

                <br>

                <strong>Hospital:</strong>
                ${escapeHtml(hospitalName)}

                <br>

                <strong>Department:</strong>
                ${escapeHtml(dept.name)}

                <br>

                <strong>Estimated wait:</strong>
                ~${wait} minutes

                <br><br>

                <strong>
                    Please keep your token number
                    for your OPD visit.
                </strong>

            `;


            /* CLEAR PATIENT DETAILS */

            nameInput.value = "";

            abhaInput.value = "";

            emailInput.value = "";

            phoneInput.value = "";

            deptSelect.value = "";

        }
    );

}


/* ============================================================
   DASHBOARD
============================================================ */

function renderDashboard() {

    const totalWaiting =
        state.queue.length;


    const doctorsOnDuty =
        state.departments.reduce(
            (
                total,
                dept
            ) =>
                total +
                dept.doctorsOnDuty,
            0
        );


    const totalDoctors =
        state.departments.reduce(
            (
                total,
                dept
            ) =>
                total +
                dept.doctorsTotal,
            0
        );


    const queueEl =
        document.getElementById(
            "dash-queue"
        );

    const doctorsEl =
        document.getElementById(
            "dash-doctors"
        );

    const bedsEl =
        document.getElementById(
            "dash-beds"
        );

    const delayEl =
        document.getElementById(
            "dash-delay"
        );


    if (queueEl) {

        queueEl.textContent =
            totalWaiting;

    }


    if (doctorsEl) {

        doctorsEl.textContent =
            `${doctorsOnDuty} / ${totalDoctors}`;

    }


    if (bedsEl) {

        bedsEl.textContent =
            state.bedsAvailable;

    }


    if (delayEl) {

        delayEl.textContent =
            `+${state.avgDelayMinutes} min`;

    }


    renderDashboardDepartments();

}


/* ============================================================
   DASHBOARD DEPARTMENT TABLE
============================================================ */

function renderDashboardDepartments() {

    const container =
        document.getElementById(
            "dashboard-departments"
        );

    if (!container) return;


    container.innerHTML =
        state.departments
            .map(dept => {

                const count =
                    waitingCountFor(
                        dept.code
                    );

                const wait =
                    estimatedWaitFor(
                        dept.code
                    );


                const queue =
                    state.queue.filter(
                        token =>
                            token.dept ===
                            dept.code
                    );


                const latest =
                    queue[
                        queue.length - 1
                    ];


                const token =
                    latest
                        ? latest.tokenNumber
                        : `${dept.code}-100`;


                return `

                    <div
                        class="dashboard-dept-row"
                    >

                        <div>

                            <div class="dashboard-dept-name">
                                ${dept.name}
                            </div>

                            <span class="dashboard-dept-meta">
                                ${count} patients waiting
                                · ${dept.doctorsOnDuty}
                                doctors on duty
                            </span>

                        </div>

                        <div class="dashboard-token">
                            ${token}
                        </div>

                        <div class="dashboard-wait">
                            ~${wait} min
                        </div>

                    </div>

                `;

            })
            .join("");

}


/* ============================================================
   AI RULES
============================================================ */

const AI_RULES = [

    {
        keywords: [
            "chest pain",
            "breathless",
            "breathing problem",
            "difficulty breathing",
            "heart"
        ],

        reply:
            "Chest pain or breathing difficulty can be serious. Please seek emergency medical care immediately rather than waiting for an OPD token."
    },


    {
        keywords: [
            "fracture",
            "broken bone",
            "sprain",
            "joint pain",
            "bone pain",
            "twisted",
            "fell"
        ],

        reply:
            "Orthopedics may be an appropriate department for this type of problem. Consider booking an Orthopedics token."
    },


    {
        keywords: [
            "child",
            "kid",
            "baby",
            "infant",
            "son",
            "daughter"
        ],

        reply:
            "Pediatrics may be the appropriate department for a child. If there is difficulty breathing or severe symptoms, seek urgent medical care."
    },


    {
        keywords: [
            "fever",
            "cold",
            "cough",
            "body ache",
            "headache",
            "tired",
            "weak"
        ],

        reply:
            "General Medicine would be a suitable starting department for these symptoms. You can check the live queue and book a token through HealQ."
    }

];


/* ============================================================
   AI RESPONSE
============================================================ */

function getAiReply(message) {

    const lower =
        message.toLowerCase();


    const match =
        AI_RULES.find(
            rule =>
                rule.keywords.some(
                    keyword =>
                        lower.includes(
                            keyword
                        )
                )
        );


    if (!match) {

        return `
            General Medicine may be a suitable starting
            department for an initial evaluation.
            HealQ AI cannot diagnose medical conditions.
            If symptoms are severe or urgent, seek medical care.
        `;

    }


    return match.reply;

}


/* ============================================================
   CHAT BUBBLE
============================================================ */

function appendChatBubble(
    role,
    text
) {

    const log =
        document.getElementById(
            "chat-log"
        );

    if (!log) return;


    const bubble =
        document.createElement(
            "div"
        );


    bubble.className =
        `bubble ${role}`;


    if (role === "ai") {

        bubble.innerHTML =
            `<span class="tag">
                HealQ AI
            </span>
            ${escapeHtml(text)}`;

    } else {

        bubble.textContent =
            text;

    }


    log.appendChild(
        bubble
    );


    log.scrollTop =
        log.scrollHeight;

}


/* ============================================================
   CHAT
============================================================ */

function setupChat() {

    const form =
        document.getElementById(
            "chat-form"
        );

    const input =
        document.getElementById(
            "chat-input"
        );


    if (!form || !input) return;


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const text =
                input.value.trim();


            if (!text) return;


            appendChatBubble(
                "user",
                text
            );


            input.value = "";


            setTimeout(
                function () {

                    appendChatBubble(
                        "ai",
                        getAiReply(text)
                    );

                },
                450
            );

        }
    );

}


/* ============================================================
   PILOT FORM
============================================================ */

function setupPilotForm() {

    const form =
        document.getElementById(
            "pilot-form"
        );

    const success =
        document.getElementById(
            "pilot-success"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const button =
                form.querySelector(
                    'button[type="submit"]'
                );


            if (button) {

                button.textContent =
                    "Request Sent ✓";

                button.disabled =
                    true;

            }


            setTimeout(
                function () {

                    form.hidden =
                        true;

                    if (success) {

                        success.hidden =
                            false;

                    }

                },
                500
            );

        }
    );

}


/* ============================================================
   RESET
============================================================ */

function setupReset() {

    const button =
        document.getElementById(
            "reset-demo"
        );

    if (!button) return;


    button.addEventListener(
        "click",
        function () {

            const confirmed =
                window.confirm(
                    "Reset all HealQ demo data?"
                );


            if (!confirmed) return;


            state =
                seedState();


            saveState();


            renderBoard();

            renderDashboard();


            const confirmation =
                document.getElementById(
                    "book-confirm"
                );


            if (confirmation) {

                confirmation.hidden =
                    true;

            }


            const stateSelect =
                document.getElementById(
                    "book-state"
                );


            const hospitalSelect =
                document.getElementById(
                    "book-hospital"
                );


            const deptSelect =
                document.getElementById(
                    "book-dept"
                );


            if (stateSelect) {

                stateSelect.value =
                    "";

            }


            if (hospitalSelect) {

                hospitalSelect.innerHTML =
                    `<option value="">
                        Select Hospital
                    </option>`;

                hospitalSelect.disabled =
                    true;

            }


            if (deptSelect) {

                deptSelect.innerHTML =
                    `<option value="">
                        Select Department
                    </option>`;

                deptSelect.disabled =
                    true;

            }


            alert(
                "HealQ demo data has been reset."
            );

        }
    );

}


/* ============================================================
   HTML ESCAPE
============================================================ */

function escapeHtml(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ============================================================
   BOARD STATE / HOSPITAL DISPLAY
============================================================ */

function setupBoardSelectors() {

    const stateSelect = document.getElementById("board-state");
    const hospitalSelect = document.getElementById("board-hospital");
    const hospitalNameEl = document.getElementById("queue-hospital-name");

    if (!stateSelect || !hospitalSelect) return;

    stateSelect.innerHTML = "";

    Object.keys(INDIA_HOSPITALS)
        .sort()
        .forEach(stateName => {
            const option = document.createElement("option");
            option.value = stateName;
            option.textContent = stateName;
            stateSelect.appendChild(option);
        });

    stateSelect.value = "Delhi";

    function updateBoardHospitals() {
        const selectedState = stateSelect.value;
        hospitalSelect.innerHTML = "";

        const hospitals = INDIA_HOSPITALS[selectedState] || [];

        hospitals.forEach(hospital => {
            const option = document.createElement("option");
            option.value = hospital;
            option.textContent = hospital;
            hospitalSelect.appendChild(option);
        });

        updateBoardHospitalDisplay();
    }

    function updateBoardHospitalDisplay() {
        const selectedHospital = hospitalSelect.value;

        if (hospitalNameEl && selectedHospital) {
            hospitalNameEl.textContent = selectedHospital;
        }

        regenerateDemoQueueForHospital(selectedHospital);

        renderBoard();
        renderDashboard();
    }

    stateSelect.addEventListener("change", updateBoardHospitals);
    hospitalSelect.addEventListener("change", updateBoardHospitalDisplay);

    updateBoardHospitals();
}
function regenerateDemoQueueForHospital(hospitalName) {

    if (!hospitalName) return;

    let seed = 0;
    for (let i = 0; i < hospitalName.length; i++) {
        seed = (seed * 31 + hospitalName.charCodeAt(i)) % 97;
    }

    const queue = [];
    const tokenSeq = {};

    state.departments.forEach((dept, index) => {

        const waiting = 1 + ((seed + index * 7) % 6);
        const startNumber = 100 + ((seed + index * 3) % 15);

        tokenSeq[dept.code] = startNumber + waiting;

        for (let i = 0; i < waiting; i++) {
            queue.push({
                id: `${dept.code}-${startNumber + i}`,
                tokenNumber: `${dept.code}-${startNumber + i}`,
                dept: dept.code,
                name: "Demo Patient",
                hospital: hospitalName,
                state: "",
                abha: "DEMO-ABHA",
                email: "demo@healq.in",
                phone: "9000000000",
                bookedAt: Date.now() - (waiting - i) * 60000
            });
        }
    });

    state.queue = queue;
    state.tokenSeq = tokenSeq;

    saveState();
}

/* ============================================================
   INITIALIZATION
============================================================ */

function initHealQ() {

    renderBoard();

    renderDashboard();

    setupBookingForm();

    setupChat();

    setupPilotForm();

    setupReset();

    setupBoardSelectors();

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initHealQ
    );

} else {

    initHealQ();

}


/* ============================================================
   SMALL LIVE DELAY MOVEMENT
============================================================ */

setInterval(
    function () {

        if (!state) return;


        state.avgDelayMinutes =
            Math.max(
                2,
                state.avgDelayMinutes +
                (
                    Math.random() > 0.5
                        ? 1
                        : -1
                )
            );


        saveState();

        renderDashboard();

    },
    8000
);