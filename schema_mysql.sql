-- ============================================================================
-- FACULTY WORKLOAD AND TIMETABLE MANAGEMENT SYSTEM
-- MySQL Workbench Database Initialization Script
-- Compatible with MySQL 8.0+ / MySQL Workbench 8.0+
-- Database Name: university_workload_db
-- ============================================================================

-- 1. Create Database with UTF-8 Multilingual Support
DROP DATABASE IF EXISTS university_workload_db;
CREATE DATABASE university_workload_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE university_workload_db;

-- Disable Foreign Key checks temporarily for clean initialization
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- 2. TABLE DEFINITIONS (Normalized to 3NF)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table: departments
-- Represents academic divisions offering degree courses and employing faculty
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
    id VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    hod VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    building VARCHAR(100) NOT NULL,
    faculty_count INT DEFAULT 0,
    student_count INT DEFAULT 0,
    color_code VARCHAR(10) DEFAULT '#2563eb',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_departments PRIMARY KEY (id),
    CONSTRAINT uq_department_code UNIQUE (code),
    CONSTRAINT uq_department_email UNIQUE (email)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table: faculty
-- Academic staff members, designations, and workload thresholds
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS faculty;
CREATE TABLE faculty (
    id VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(25) NULL,
    department_id VARCHAR(20) NOT NULL,
    designation VARCHAR(60) NOT NULL,
    specialization VARCHAR(255) NULL,
    experience_years INT DEFAULT 0,
    max_hours INT DEFAULT 16,
    status ENUM('Active', 'On Leave', 'Retired', 'Sabbatical') DEFAULT 'Active',
    avatar_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_faculty PRIMARY KEY (id),
    CONSTRAINT uq_faculty_email UNIQUE (email),
    CONSTRAINT fk_faculty_department 
        FOREIGN KEY (department_id) REFERENCES departments (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table: subjects
-- Curriculum courses, contact hours distribution (L-T-P), and credits
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS subjects;
CREATE TABLE subjects (
    code VARCHAR(20) NOT NULL,
    name VARCHAR(150) NOT NULL,
    short_name VARCHAR(20) NOT NULL,
    department_id VARCHAR(20) NOT NULL,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    credits INT NOT NULL CHECK (credits BETWEEN 1 AND 6),
    lecture_hours INT DEFAULT 3,
    tutorial_hours INT DEFAULT 0,
    practical_hours INT DEFAULT 0,
    type ENUM('Theory', 'Practical Lab', 'Integrated') DEFAULT 'Theory',
    color_code VARCHAR(10) DEFAULT '#3b82f6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_subjects PRIMARY KEY (code),
    CONSTRAINT fk_subject_department 
        FOREIGN KEY (department_id) REFERENCES departments (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table: faculty_subjects (M:N Junction Table)
-- Resolves Many-to-Many mapping between Faculty and Assigned Subjects
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS faculty_subjects;
CREATE TABLE faculty_subjects (
    faculty_id VARCHAR(20) NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    assigned_date DATE DEFAULT (CURRENT_DATE),
    CONSTRAINT pk_faculty_subjects PRIMARY KEY (faculty_id, subject_code),
    CONSTRAINT fk_fs_faculty 
        FOREIGN KEY (faculty_id) REFERENCES faculty (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_fs_subject 
        FOREIGN KEY (subject_code) REFERENCES subjects (code) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table: rooms
-- Physical classrooms, lecture theaters, and specialized computer labs
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS rooms;
CREATE TABLE rooms (
    room_no VARCHAR(20) NOT NULL,
    building VARCHAR(100) NOT NULL,
    floor INT DEFAULT 1,
    capacity INT NOT NULL CHECK (capacity > 0),
    type ENUM('Lecture Hall', 'Computer Lab', 'AI & Data Lab', 'Seminar Hall') DEFAULT 'Lecture Hall',
    has_projector BOOLEAN DEFAULT TRUE,
    has_smart_board BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_rooms PRIMARY KEY (room_no)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table: sections
-- Student cohort sections attending scheduled classes
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS sections;
CREATE TABLE sections (
    id VARCHAR(20) NOT NULL,
    name VARCHAR(80) NOT NULL,
    department_id VARCHAR(20) NOT NULL,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    student_count INT DEFAULT 60,
    CONSTRAINT pk_sections PRIMARY KEY (id),
    CONSTRAINT fk_section_department 
        FOREIGN KEY (department_id) REFERENCES departments (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table: timetable_slots (Composite Schedule Junction Table)
-- Scheduled class periods linking Day, Time, Subject, Instructor, Room, Cohort
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS timetable_slots;
CREATE TABLE timetable_slots (
    id VARCHAR(20) NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    faculty_id VARCHAR(20) NOT NULL,
    room_no VARCHAR(20) NOT NULL,
    section_id VARCHAR(20) NOT NULL,
    type ENUM('Lecture', 'Practical Lab', 'Tutorial') DEFAULT 'Lecture',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_timetable_slots PRIMARY KEY (id),
    CONSTRAINT fk_tt_subject 
        FOREIGN KEY (subject_code) REFERENCES subjects (code) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tt_faculty 
        FOREIGN KEY (faculty_id) REFERENCES faculty (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tt_room 
        FOREIGN KEY (room_no) REFERENCES rooms (room_no) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tt_section 
        FOREIGN KEY (section_id) REFERENCES sections (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    -- Unique Relational Integrity Constraints to Prevent Physical Clashes
    CONSTRAINT uq_room_schedule 
        UNIQUE (room_no, day_of_week, time_slot),
    CONSTRAINT uq_faculty_schedule 
        UNIQUE (faculty_id, day_of_week, time_slot),
    CONSTRAINT uq_section_schedule 
        UNIQUE (section_id, day_of_week, time_slot)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table: notifications
-- System alerts and workload notices
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
    id VARCHAR(20) NOT NULL,
    title VARCHAR(120) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'warning', 'alert', 'success') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_notifications PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table: system_settings
-- Institutional configurations & workload parameters
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS system_settings;
CREATE TABLE system_settings (
    setting_key VARCHAR(50) NOT NULL,
    setting_value VARCHAR(255) NOT NULL,
    description VARCHAR(255) NULL,
    CONSTRAINT pk_system_settings PRIMARY KEY (setting_key)
) ENGINE=InnoDB;

-- Re-enable Foreign Key constraints
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 3. INSERT AUTHENTIC SAMPLE DATA
-- ============================================================================

-- Departments
INSERT INTO departments (id, name, code, hod, email, building, faculty_count, student_count, color_code) VALUES
('DEP-CSE', 'Computer Science & Engineering', 'CSE', 'Dr. Rajesh Verma', 'hod.cse@apex.edu', 'Block A (Alan Turing Block)', 18, 420, '#2563eb'),
('DEP-AIML', 'Artificial Intelligence & Machine Learning', 'AI & ML', 'Prof. Rahul Sharma', 'hod.aiml@apex.edu', 'Block A (Alan Turing Block)', 12, 280, '#7c3aed'),
('DEP-ECE', 'Electronics & Communication Engineering', 'ECE', 'Dr. Meenakshi Sundaram', 'hod.ece@apex.edu', 'Block B (J.C. Bose Block)', 15, 360, '#0891b2'),
('DEP-MATH', 'Department of Mathematics', 'MATH', 'Dr. Priya Nair', 'hod.math@apex.edu', 'Block C (Ramanujan Block)', 8, 1100, '#059669');

-- Faculty Members
INSERT INTO faculty (id, name, email, phone, department_id, designation, specialization, experience_years, max_hours, status, avatar_url) VALUES
('FAC-101', 'Dr. Ananya Rao', 'ananya.rao@apex.edu', '+91 98451 22345', 'DEP-CSE', 'Associate Professor', 'Distributed Databases, Big Data & Cloud Architecture', 12, 16, 'Active', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
('FAC-102', 'Prof. Rahul Sharma', 'rahul.sharma@apex.edu', '+91 97412 88412', 'DEP-AIML', 'Assistant Professor & HOD', 'Deep Learning, Computer Vision, Neural Networks', 9, 16, 'Active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
('FAC-103', 'Dr. Priya Nair', 'priya.nair@apex.edu', '+91 94480 33419', 'DEP-MATH', 'Professor & HOD', 'Discrete Mathematics, Graph Theory & Cryptography', 20, 14, 'Active', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'),
('FAC-104', 'Prof. Arjun Kumar', 'arjun.kumar@apex.edu', '+91 98860 11928', 'DEP-ECE', 'Assistant Professor', 'Embedded Systems, IoT & VLSI Design', 7, 18, 'Active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
('FAC-105', 'Dr. Rajesh Verma', 'rajesh.verma@apex.edu', '+91 99160 44512', 'DEP-CSE', 'Professor & HOD', 'Computer Networks, Network Security & Blockchain', 22, 14, 'Active', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'),
('FAC-106', 'Prof. Sneha Patel', 'sneha.patel@apex.edu', '+91 98450 77123', 'DEP-AIML', 'Assistant Professor', 'Natural Language Processing & Reinforcement Learning', 5, 18, 'Active', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'),
('FAC-107', 'Dr. Vikram Malhotra', 'vikram.m@apex.edu', '+91 98112 55901', 'DEP-CSE', 'Associate Professor', 'Operating Systems & System Software', 14, 16, 'On Leave', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80');

-- Subjects Curriculum
INSERT INTO subjects (code, name, short_name, department_id, semester, credits, lecture_hours, tutorial_hours, practical_hours, type, color_code) VALUES
('SUB-CS301', 'Database Management Systems', 'DBMS', 'DEP-CSE', 5, 4, 3, 0, 2, 'Integrated', '#3b82f6'),
('SUB-CS302', 'Computer Networks', 'CN', 'DEP-CSE', 5, 3, 3, 0, 0, 'Theory', '#0ea5e9'),
('SUB-CS303', 'Data Structures & Algorithms', 'DSA', 'DEP-CSE', 3, 4, 3, 1, 2, 'Integrated', '#6366f1'),
('SUB-CS305', 'Cloud Computing & DevOps', 'Cloud', 'DEP-CSE', 7, 3, 3, 0, 0, 'Theory', '#06b6d4'),
('SUB-AI401', 'Machine Learning Fundamentals', 'ML', 'DEP-AIML', 5, 4, 3, 0, 2, 'Integrated', '#8b5cf6'),
('SUB-AI402', 'Deep Learning & Neural Networks', 'DL & NN', 'DEP-AIML', 7, 4, 3, 0, 2, 'Integrated', '#a855f7'),
('SUB-AI403', 'Natural Language Processing', 'NLP', 'DEP-AIML', 7, 3, 3, 0, 0, 'Theory', '#d946ef'),
('SUB-EC301', 'Digital Signal Processing', 'DSP', 'DEP-ECE', 5, 4, 3, 1, 0, 'Theory', '#14b8a6'),
('SUB-EC302', 'VLSI Design & Embedded Systems', 'VLSI', 'DEP-ECE', 6, 4, 3, 0, 2, 'Integrated', '#10b981'),
('SUB-MA201', 'Discrete Mathematics & Graph Theory', 'DMGT', 'DEP-MATH', 3, 4, 3, 1, 0, 'Theory', '#f59e0b');

-- Faculty-Subject Mapping
INSERT INTO faculty_subjects (faculty_id, subject_code) VALUES
('FAC-101', 'SUB-CS301'),
('FAC-101', 'SUB-CS305'),
('FAC-102', 'SUB-AI401'),
('FAC-102', 'SUB-AI402'),
('FAC-103', 'SUB-MA201'),
('FAC-104', 'SUB-EC301'),
('FAC-104', 'SUB-EC302'),
('FAC-105', 'SUB-CS302'),
('FAC-106', 'SUB-AI403'),
('FAC-106', 'SUB-CS303');

-- Rooms and Laboratories
INSERT INTO rooms (room_no, building, floor, capacity, type, has_projector, has_smart_board) VALUES
('A-101', 'Block A (Alan Turing Block)', 1, 65, 'Lecture Hall', TRUE, TRUE),
('A-202', 'Block A (Alan Turing Block)', 2, 65, 'Lecture Hall', TRUE, FALSE),
('B-305', 'Block B (J.C. Bose Block)', 3, 120, 'Seminar Hall', TRUE, TRUE),
('Lab-1', 'Block A (Alan Turing Block)', 1, 45, 'Computer Lab', TRUE, TRUE),
('Lab-2', 'Block A (Alan Turing Block)', 2, 40, 'AI & Data Lab', TRUE, TRUE),
('C-104', 'Block C (Ramanujan Block)', 1, 70, 'Lecture Hall', TRUE, FALSE);

-- Sections
INSERT INTO sections (id, name, department_id, semester, student_count) VALUES
('SEC-CSE-3A', 'CSE - 3rd Sem (Sec A)', 'DEP-CSE', 3, 62),
('SEC-CSE-5A', 'CSE - 5th Sem (Sec A)', 'DEP-CSE', 5, 58),
('SEC-CSE-5B', 'CSE - 5th Sem (Sec B)', 'DEP-CSE', 5, 60),
('SEC-AIML-5A', 'AI & ML - 5th Sem', 'DEP-AIML', 5, 54),
('SEC-ECE-5A', 'ECE - 5th Sem', 'DEP-ECE', 5, 56);

-- Timetable Schedule Entries
INSERT INTO timetable_slots (id, day_of_week, time_slot, subject_code, faculty_id, room_no, section_id, type) VALUES
('TT-001', 'Monday', '09:00 - 10:00', 'SUB-CS301', 'FAC-101', 'A-101', 'SEC-CSE-5A', 'Lecture'),
('TT-002', 'Monday', '10:00 - 11:00', 'SUB-CS302', 'FAC-105', 'A-101', 'SEC-CSE-5A', 'Lecture'),
('TT-003', 'Monday', '11:00 - 12:00', 'SUB-MA201', 'FAC-103', 'A-101', 'SEC-CSE-5A', 'Lecture'),
('TT-004', 'Monday', '09:00 - 10:00', 'SUB-AI401', 'FAC-102', 'A-202', 'SEC-AIML-5A', 'Lecture'),
('TT-005', 'Monday', '02:00 - 04:00', 'SUB-CS301', 'FAC-101', 'Lab-1', 'SEC-CSE-5A', 'Practical Lab'),

('TT-006', 'Tuesday', '09:00 - 10:00', 'SUB-CS302', 'FAC-105', 'A-101', 'SEC-CSE-5A', 'Lecture'),
('TT-007', 'Tuesday', '10:00 - 11:00', 'SUB-CS301', 'FAC-101', 'A-101', 'SEC-CSE-5A', 'Lecture'),
('TT-008', 'Tuesday', '11:00 - 12:00', 'SUB-AI402', 'FAC-102', 'A-202', 'SEC-AIML-5A', 'Lecture'),
('TT-009', 'Tuesday', '02:00 - 04:00', 'SUB-AI401', 'FAC-102', 'Lab-2', 'SEC-AIML-5A', 'Practical Lab'),
('TT-010', 'Tuesday', '03:00 - 04:00', 'SUB-CS305', 'FAC-101', 'B-305', 'SEC-CSE-5B', 'Lecture'),

('TT-011', 'Wednesday', '09:00 - 10:00', 'SUB-MA201', 'FAC-103', 'A-101', 'SEC-CSE-5A', 'Lecture'),
('TT-012', 'Wednesday', '10:00 - 11:00', 'SUB-CS301', 'FAC-101', 'A-101', 'SEC-CSE-5A', 'Lecture'),
('TT-013', 'Wednesday', '11:00 - 12:00', 'SUB-CS302', 'FAC-105', 'A-101', 'SEC-CSE-5A', 'Lecture'),
('TT-014', 'Wednesday', '02:00 - 03:00', 'SUB-EC301', 'FAC-104', 'A-202', 'SEC-ECE-5A', 'Lecture'),

('TT-015', 'Thursday', '09:00 - 10:00', 'SUB-AI401', 'FAC-102', 'A-202', 'SEC-AIML-5A', 'Lecture'),
('TT-016', 'Thursday', '10:00 - 11:00', 'SUB-CS305', 'FAC-101', 'A-101', 'SEC-CSE-5A', 'Lecture'),
('TT-017', 'Thursday', '11:00 - 12:00', 'SUB-EC302', 'FAC-104', 'B-305', 'SEC-ECE-5A', 'Lecture'),
('TT-018', 'Thursday', '02:00 - 04:00', 'SUB-EC302', 'FAC-104', 'Lab-1', 'SEC-ECE-5A', 'Practical Lab'),

('TT-019', 'Friday', '09:00 - 10:00', 'SUB-CS301', 'FAC-101', 'A-101', 'SEC-CSE-5B', 'Lecture'),
('TT-020', 'Friday', '10:00 - 11:00', 'SUB-MA201', 'FAC-103', 'A-101', 'SEC-CSE-5A', 'Lecture'),
('TT-021', 'Friday', '11:00 - 12:00', 'SUB-AI403', 'FAC-106', 'A-202', 'SEC-AIML-5A', 'Lecture'),
('TT-022', 'Friday', '02:00 - 03:00', 'SUB-CS303', 'FAC-106', 'A-101', 'SEC-CSE-3A', 'Lecture'),

('TT-023', 'Saturday', '09:00 - 11:00', 'SUB-CS301', 'FAC-101', 'Lab-1', 'SEC-CSE-5B', 'Practical Lab'),
('TT-024', 'Saturday', '11:00 - 12:00', 'SUB-CS305', 'FAC-101', 'A-101', 'SEC-CSE-5A', 'Tutorial');

-- Notifications
INSERT INTO notifications (id, title, message, type, is_read) VALUES
('NOTIF-01', 'Timetable Published', 'Fall Semester 2026 timetable has been officially finalized for CSE & AIML.', 'info', FALSE),
('NOTIF-02', 'Workload Threshold Warning', 'Dr. Ananya Rao has reached 17.0 hrs/week (Maximum allowed: 16.0 hrs).', 'warning', FALSE),
('NOTIF-03', 'Room Maintenance Notice', 'Lab-2 air conditioning scheduled for routine maintenance this Saturday 2 PM - 5 PM.', 'alert', TRUE),
('NOTIF-04', 'New Subject Allocation', 'Prof. Sneha Patel assigned to Natural Language Processing (SUB-AI403).', 'success', TRUE);

-- System Settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('university_name', 'Apex Institute of Engineering & Technology', 'Official institutional branding'),
('academic_year', '2026-2027', 'Active academic session'),
('current_semester', 'Fall 2026 (Odd Semester)', 'Active academic semester'),
('max_teaching_hours', '16', 'University standard maximum contact ceiling per faculty'),
('low_workload_threshold', '11', 'Threshold below which faculty is flagged as underloaded');

-- ============================================================================
-- 4. RELATIONAL VIEWS (For Reports & Analytic Dashboards)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- View: v_faculty_workload_analysis
-- Aggregates scheduled contact hours per faculty and computes workload status
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_faculty_workload_analysis AS
SELECT 
    f.id AS faculty_id,
    f.name AS faculty_name,
    f.email,
    d.code AS department_code,
    d.name AS department_name,
    f.designation,
    f.max_hours,
    COALESCE(SUM(
        CASE 
            WHEN t.time_slot IN ('02:00 - 04:00', '09:00 - 11:00') THEN 2 
            ELSE 1 
        END
    ), 0) AS scheduled_hours,
    CASE 
        WHEN COALESCE(SUM(CASE WHEN t.time_slot IN ('02:00 - 04:00', '09:00 - 11:00') THEN 2 ELSE 1 END), 0) > f.max_hours THEN 'OVERLOADED'
        WHEN COALESCE(SUM(CASE WHEN t.time_slot IN ('02:00 - 04:00', '09:00 - 11:00') THEN 2 ELSE 1 END), 0) < 11 THEN 'UNDERLOADED'
        ELSE 'OPTIMAL'
    END AS workload_status,
    ROUND((COALESCE(SUM(CASE WHEN t.time_slot IN ('02:00 - 04:00', '09:00 - 11:00') THEN 2 ELSE 1 END), 0) / f.max_hours) * 100, 1) AS utilization_percentage
FROM faculty f
JOIN departments d ON f.department_id = d.id
LEFT JOIN timetable_slots t ON f.id = t.faculty_id
GROUP BY f.id, f.name, f.email, d.code, d.name, f.designation, f.max_hours;

-- ----------------------------------------------------------------------------
-- View: v_timetable_master_schedule
-- Human-readable weekly schedule joining all related entities
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_timetable_master_schedule AS
SELECT 
    t.id AS slot_id,
    t.day_of_week,
    t.time_slot,
    s.code AS subject_code,
    s.short_name AS subject_short_name,
    s.name AS subject_full_name,
    f.id AS faculty_id,
    f.name AS faculty_name,
    t.room_no,
    r.type AS room_type,
    r.capacity AS room_capacity,
    sec.id AS section_id,
    sec.name AS section_name,
    t.type AS session_format
FROM timetable_slots t
JOIN subjects s ON t.subject_code = s.code
JOIN faculty f ON t.faculty_id = f.id
JOIN rooms r ON t.room_no = r.room_no
JOIN sections sec ON t.section_id = sec.id
ORDER BY FIELD(t.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'), t.time_slot;

-- ----------------------------------------------------------------------------
-- View: v_room_occupancy_analysis
-- Real-time room weekly booking density and utilization rate
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_room_occupancy_analysis AS
SELECT 
    r.room_no,
    r.building,
    r.floor,
    r.capacity,
    r.type,
    r.has_smart_board,
    COUNT(t.id) AS weekly_scheduled_sessions,
    ROUND((COUNT(t.id) / (6 * 7)) * 100, 1) AS weekly_utilization_rate -- 6 days * 7 active slots
FROM rooms r
LEFT JOIN timetable_slots t ON r.room_no = t.room_no
GROUP BY r.room_no, r.building, r.floor, r.capacity, r.type, r.has_smart_board;

-- ============================================================================
-- 5. STORED PROCEDURES FOR CONFLICT DETECTION & INTEGRITY
-- ============================================================================

DELIMITER //

DROP PROCEDURE IF EXISTS sp_detect_schedule_conflict //
CREATE PROCEDURE sp_detect_schedule_conflict(
    IN p_day VARCHAR(15),
    IN p_time_slot VARCHAR(30),
    IN p_faculty_id VARCHAR(20),
    IN p_room_no VARCHAR(20),
    IN p_section_id VARCHAR(20),
    IN p_exclude_id VARCHAR(20)
)
BEGIN
    SELECT 
        t.id,
        t.day_of_week,
        t.time_slot,
        t.subject_code,
        t.faculty_id,
        f.name AS faculty_name,
        t.room_no,
        t.section_id,
        CASE
            WHEN t.faculty_id = p_faculty_id THEN 'FACULTY_CLASH'
            WHEN t.room_no = p_room_no THEN 'ROOM_CLASH'
            WHEN t.section_id = p_section_id THEN 'SECTION_CLASH'
        END AS conflict_type
    FROM timetable_slots t
    JOIN faculty f ON t.faculty_id = f.id
    WHERE t.day_of_week = p_day
      AND (
          t.time_slot = p_time_slot
          OR (p_time_slot = '02:00 - 04:00' AND t.time_slot IN ('02:00 - 03:00', '03:00 - 04:00'))
          OR (t.time_slot = '02:00 - 04:00' AND p_time_slot IN ('02:00 - 03:00', '03:00 - 04:00'))
          OR (p_time_slot = '09:00 - 11:00' AND t.time_slot IN ('09:00 - 10:00', '10:00 - 11:00'))
          OR (t.time_slot = '09:00 - 11:00' AND p_time_slot IN ('09:00 - 10:00', '10:00 - 11:00'))
      )
      AND (p_exclude_id IS NULL OR t.id != p_exclude_id)
      AND (t.faculty_id = p_faculty_id OR t.room_no = p_room_no OR t.section_id = p_section_id);
END //

DELIMITER ;

-- ============================================================================
-- VERIFICATION QUERIES (Test the schema immediately in MySQL Workbench)
-- ============================================================================

SELECT 'Faculty Workload Status' AS Report_Title;
SELECT * FROM v_faculty_workload_analysis;

SELECT 'Master Timetable Monday Preview' AS Report_Title;
SELECT * FROM v_timetable_master_schedule WHERE day_of_week = 'Monday';

SELECT 'Room Utilization Summary' AS Report_Title;
SELECT * FROM v_room_occupancy_analysis;
