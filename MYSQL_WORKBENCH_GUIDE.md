# MySQL Workbench Setup & Connection Guide

This guide explains how to connect this **Faculty Workload and Timetable Management System** to **MySQL Server 8.0** and **MySQL Workbench**.

---

## 📋 Connection Parameters

Use these standard connection parameters in **MySQL Workbench**:

| Parameter | Recommended Value | Notes |
| :--- | :--- | :--- |
| **Connection Name** | `Apex_University_DBMS` | Any descriptive name |
| **Connection Method** | `Standard (TCP/IP)` | Default TCP/IP protocol |
| **Hostname** | `127.0.0.1` or `localhost` | Local MySQL Server |
| **Port** | `3306` | Default MySQL port |
| **Username** | `root` | Administrative user |
| **Password** | *Your MySQL root password* | Click *Store in Vault...* to save |
| **Default Schema** | `university_workload_db` | Created by `schema_mysql.sql` |

---

## ⚡ Method 1: Execute SQL Script in MySQL Workbench (Recommended)

1. Launch **MySQL Workbench** from your Windows Start Menu.
2. In the home screen, click your **Local instance MySQL80** tile (or click the `+` icon to add a new connection with the parameters above).
3. Once the SQL Query editor opens:
   - Go to the top menu: **File &gt; Open SQL Script...** (or press `Ctrl + Shift + O`).
   - Navigate to this folder and choose **`schema_mysql.sql`**:
     ```
     c:\Users\Hussain\Desktop\DBMS\schema_mysql.sql
     ```
4. Click the yellow **Execute (Lightning Bolt ⚡)** button in the query toolbar.
5. In the left **Navigator** pane under the **Schemas** tab, right-click and choose **Refresh All**:
   - You will now see **`university_workload_db`** containing:
     - **Tables (7)**: `departments`, `faculty`, `subjects`, `rooms`, `sections`, `timetable_slots`, `faculty_subjects`, `notifications`, `system_settings`.
     - **Views (3)**:
       - `v_faculty_workload_analysis` (calculates teaching hours vs limit)
       - `v_timetable_master_schedule` (readable weekly grid with joins)
       - `v_room_occupancy_analysis` (weekly room utilization rates)
     - **Stored Procedures (1)**:
       - `sp_detect_schedule_conflict` (clash detection engine)

---

## 🖼️ How to Generate the Visual ER Diagram in MySQL Workbench

To display the relational model for DBMS project presentations:

1. In MySQL Workbench, click **Database** in the top menu bar.
2. Select **Reverse Engineer...** (or press `Ctrl + R`).
3. Click **Next** on the connection selection screen.
4. Enter your MySQL root password if prompted, then click **Next**.
5. Select the database checkbox for **`university_workload_db`**, then click **Next**.
6. Click **Execute** &gt; **Next** &gt; **Finish**.
7. MySQL Workbench will automatically generate an interactive **EER Diagram (Enhanced Entity-Relationship Diagram)** displaying all 7 normalized relational tables, primary keys (`PK`), foreign keys (`FK`), and 1-to-many relationship lines!

---

## 🌐 Method 2: One-Click Initialization from the Web Portal

If the backend server (`backend_server.py`) is running:

1. Open the portal in your browser at **`http://localhost:8085`**.
2. Click **DBMS ER & Schema** in the left sidebar navigation.
3. In the blue **MySQL Workbench Connection & Configuration** card at the top, click:
   ```
   ⚡ Connect & Initialize DB
   ```
4. Enter your MySQL root password and click **Initialize Database**.
5. The backend will connect to your local MySQL 8.0 server on port 3306, execute `schema_mysql.sql`, create the schema, and load all sample records automatically!

---

## 🔍 Useful SQL Verification Queries to Run in Workbench

Try running these queries inside MySQL Workbench to inspect the relational data:

### 1. View Faculty Workload & Utilization
```sql
USE university_workload_db;

SELECT 
    faculty_id,
    faculty_name,
    department_code,
    designation,
    scheduled_hours,
    max_hours,
    workload_status,
    CONCAT(utilization_percentage, '%') AS utilization
FROM v_faculty_workload_analysis
ORDER BY scheduled_hours DESC;
```

### 2. View Monday's Timetable Schedule with Entity Joins
```sql
USE university_workload_db;

SELECT 
    time_slot,
    subject_short_name,
    faculty_name,
    room_no,
    section_name,
    session_format
FROM v_timetable_master_schedule
WHERE day_of_week = 'Monday'
ORDER BY time_slot;
```

### 3. Test the Stored Procedure for Conflict Detection
```sql
USE university_workload_db;

-- Test if Room A-101 has any clash on Monday at 09:00 - 10:00
CALL sp_detect_schedule_conflict('Monday', '09:00 - 10:00', 'FAC-101', 'A-101', 'SEC-CSE-5A', NULL);
```

### 4. Inspect Room Utilization Rate
```sql
USE university_workload_db;

SELECT 
    room_no,
    building,
    capacity,
    type,
    weekly_scheduled_sessions,
    CONCAT(weekly_utilization_rate, '%') AS utilization_rate
FROM v_room_occupancy_analysis
ORDER BY weekly_scheduled_sessions DESC;
```
