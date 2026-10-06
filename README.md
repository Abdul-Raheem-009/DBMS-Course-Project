# Faculty Workload and Timetable Management System

An institutional-grade, modern, responsive academic web portal engineered for university administrators, department coordinators, and faculty members to orchestrate faculty teaching workloads, curricular offerings, facility occupancies, and clash-free weekly timetables in one centralized portal.

---

## 🌟 Key Highlights & Architectural Features

### 1. 📊 Executive Academic Dashboard
- **KPI Metrics**: Real-time counters for Total Faculty, Total Active Subjects, Weekly Scheduled Classes, Total Lecture Halls & Labs, Average Faculty Workload, Overloaded Faculty count (>16 hrs), and Underloaded Faculty count (<11 hrs).
- **Interactive Visualizations (Chart.js)**:
  - **Faculty Workload Distribution**: Comparative multi-bar & ceiling graph contrasting actual contact hours against maximum permissible limits.
  - **Department-wise Workload Share**: Doughnut distribution diagram across CSE, AI & ML, ECE, and Mathematics.
  - **Weekly Class Load Distribution**: Trend analysis of class densities across academic working days (Monday to Saturday).
- **Today's Live Schedule**: Filtered schedule feed displaying session time, subject, faculty avatar, room number, cohort section, and session format (Lecture / Lab).

### 2. 👨‍🏫 Faculty Management & Directory
- Comprehensive data directory tracking Faculty ID, Name, Department, Designation, Subjects Assigned tags, Workload Progress Bar (with dynamic green/amber/red color coding), Maximum Workload, and Status.
- **Actions**:
  - **View Profile**: Detailed modal with contact details, research specialization, and full weekly teaching timetable.
  - **Add Faculty**: Modal form with strict validation and automatic avatar generation.
  - **Edit Faculty**: In-place profile modification.
  - **Assign Subjects**: Interactive toggle interface to allocate or detach subjects.
  - **Delete Faculty**: Cascade protection removing associated timetable allocations.
- **Search & Filters**: Instant full-text search by name, department filter, and workload status filters (Optimal, Overloaded, Underloaded).

### 3. 📚 Curriculum & Subject Management
- Tabular registry detailing Course Code, Subject Title, Department, Semester, Credit allocation, and **L-T-P (Lecture - Tutorial - Practical) Contact Hours Breakdown**.
- Direct linkage to assigned faculty members and total weekly teaching commitment.
- Full CRUD workflows (Add, Edit, Delete subject).

### 4. ⚖️ Workload Management & Allocation
- Dedicated workload balancing dashboard comparing actual teaching hours against maximum allowed limits.
- **Visual Status Badges**:
  - **Optimal (Green)**: Balanced load (11 to 16 hours/week).
  - **Overloaded (Red)**: Exceeds threshold (>16 hours/week).
  - **Underloaded (Amber)**: Available teaching capacity (<11 hours/week).
- **AI Workload Balancing Recommendations**: Automated suggestion engine that detects overloaded faculty and recommends peers within the same department with spare capacity for course reassignment.

### 5. 🗓️ Interactive Timetable Matrix & Conflict Detection Engine
- **Weekly Matrix Grid**:
  - Days: Monday through Saturday.
  - Time Slots: 9:00 AM – 5:00 PM (1-hour slots with 1:00 PM – 2:00 PM Lunch Break clearly designated).
- **Multi-View Modes**:
  - **By Section**: View schedule for CSE 5A, CSE 5B, AIML 5A, ECE 5A, etc.
  - **By Faculty**: View personalized timetable for any faculty instructor.
  - **By Room**: View room occupancy schedule for lecture halls and computer labs.
- **⚡ Real-Time Relational Conflict Detection**:
  - **Faculty Clash**: Prevents scheduling an instructor who is already teaching another class during that slot.
  - **Room Double-Booking**: Prevents booking a room/lab that is already occupied.
  - **Section Overlap**: Prevents assigning overlapping classes to the same student cohort.
  - Conflict warning banner details the exact collision in the modal.

### 6. 🏛️ Classroom & Laboratory Management
- Real-time room cards and inventory covering Lecture Halls, Computer Labs, AI & Data Labs, and Seminar Halls.
- Tracks physical seating capacity, building/floor location, projector/smart board technology, live occupancy state (Available vs Occupied), and weekly utilization rates.

### 7. 🏢 Academic Departments
- Institutional department profiles for CSE, AI & ML, ECE, and Mathematics.
- Details Department Chair (HOD), enrolled student body, faculty roster, and aggregate departmental workload averages.

### 8. 📑 Auditable Reports & Document Exports
- Dedicated generator for:
  - Faculty Workload Compliance Report
  - Departmental Academic Load Summary
  - Master Timetable Digest
  - Room Utilization Index
- **Export Capabilities**:
  - One-click **Export to CSV / Excel** for spreadsheet analysis.
  - **Print / PDF Document**: Clean print stylesheet (`@media print`) hiding navigation bars and optimizing tables for letter/A4 paper and PDF export.

### 9. 🗄️ DBMS Relational Architecture & SQL Query Explorer (Course Project Showcase)
- **3NF Relational Model**: Detailed breakdown of 7 relational entities (`DEPARTMENT`, `FACULTY`, `SUBJECT`, `ROOM`, `CLASS_SECTION`, `TIMETABLE_ENTRY`) highlighting Primary Keys (PK) and Foreign Keys (FK).
- **ANSI SQL DDL Script**: Copyable SQL script to generate all relational tables and integrity constraints in MySQL, PostgreSQL, or Oracle.
- **Interactive SQL Query Simulator**: Live execution simulator running relational queries directly against the database:
  - Query 1: Faculty Workload Aggregation (`GROUP BY` + `HAVING`).
  - Query 2: Room Collision Detection (`SELF JOIN`).
  - Query 3: Department Resource JOIN.

### 10. 🎭 Role-Based Access Control (RBAC)
Switch roles seamlessly using the top-right header selector:
- **Central Admin (Dean)**: Unrestricted access to all 10 modules + DBMS Schema Workbench.
- **Department Coordinator (CSE)**: Department-focused management for faculty, workloads, timetables, and reports.
- **Faculty Member (Dr. Ananya Rao)**: Tailored personal portal displaying "My Dashboard", "My Timetable", "My Workload", and "My Subjects".

### 11. 🌓 Sleek Theme & Persistence
- Built-in Dark Mode & Light Mode toggle with smooth transitions.
- Automatic browser `localStorage` persistence — all additions, edits, and deletions persist across page reloads.
- One-click **Reset Sample Data** in Settings to restore the clean initial university database.

---

## 🚀 How to Run Locally

You can run this application using any web server, or directly in your browser.

### Option 1: Python HTTP Server (Already Running on Port 8085)
```bash
# In the project directory:
python -m http.server 8085
```
Then open your browser and navigate to:
```
http://localhost:8085
```

### Option 2: Direct File Open
Simply double-click or open [index.html](file:///c:/Users/Hussain/Desktop/DBMS/index.html) in Chrome, Edge, or Firefox.

---

## 📂 Project Structure

```
DBMS/
│
├── index.html                  # Main application shell with header, sidebar & modals
├── README.md                   # Comprehensive documentation
│
├── css/
│   ├── main.css                # Academic enterprise design tokens, cards, tables, dark mode
│   ├── timetable.css           # Weekly grid styles, slot cards, conflict badges
│   └── components.css          # Modals, toast notifications, workload gauges, print view
│
└── js/
    ├── data.js                 # Relational seed data, query helpers & localStorage sync
    ├── store.js                # State store, role controller, event bus
    ├── app.js                  # Main controller, router, modal manager & conflict checker
    │
    └── views/
        ├── dashboard.js        # KPI stat cards, Chart.js graphs & Today's Schedule
        ├── faculty.js          # Faculty directory, search/filter, profile modal, CRUD
        ├── subjects.js         # Curriculum registry, L-T-P contact hours
        ├── workload.js         # Workload analytics, status indicators & auto rebalance
        ├── timetable.js        # Weekly matrix, filters by Section/Faculty/Room, clashes
        ├── rooms.js            # Room inventory, live status, capacity & utilization
        ├── departments.js      # Department cards, HOD information & faculty roster
        ├── reports.js          # Audits, CSV export, Print/PDF report generation
        ├── notifications.js    # Notification inbox & priority alerts
        ├── schema.js           # DBMS Relational Schema, ER tables & SQL query simulator
        └── settings.js         # University parameters, workload rules & data reset
```
