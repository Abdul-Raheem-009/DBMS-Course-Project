/**
 * Faculty Workload and Timetable Management System
 * Relational Data Model & Seed Store
 */

const STORAGE_KEY = 'fwts_academic_db_v1';

// Seed Initial Database
const INITIAL_DATABASE = {
  departments: [
    {
      id: 'DEP-CSE',
      name: 'Computer Science & Engineering',
      code: 'CSE',
      hod: 'Dr. Rajesh Verma',
      email: 'hod.cse@apex.edu',
      building: 'Block A (Alan Turing Block)',
      facultyCount: 18,
      studentCount: 420,
      color: '#2563eb'
    },
    {
      id: 'DEP-AIML',
      name: 'Artificial Intelligence & Machine Learning',
      code: 'AI & ML',
      hod: 'Prof. Rahul Sharma',
      email: 'hod.aiml@apex.edu',
      building: 'Block A (Alan Turing Block)',
      facultyCount: 12,
      studentCount: 280,
      color: '#7c3aed'
    },
    {
      id: 'DEP-ECE',
      name: 'Electronics & Communication Engineering',
      code: 'ECE',
      hod: 'Dr. Meenakshi Sundaram',
      email: 'hod.ece@apex.edu',
      building: 'Block B (J.C. Bose Block)',
      facultyCount: 15,
      studentCount: 360,
      color: '#0891b2'
    },
    {
      id: 'DEP-MATH',
      name: 'Department of Mathematics',
      code: 'MATH',
      hod: 'Dr. Priya Nair',
      email: 'hod.math@apex.edu',
      building: 'Block C (Ramanujan Block)',
      facultyCount: 8,
      studentCount: 1100, // Service courses for all depts
      color: '#059669'
    }
  ],

  faculty: [
    {
      id: 'FAC-101',
      name: 'Dr. Ananya Rao',
      email: 'ananya.rao@apex.edu',
      phone: '+91 98451 22345',
      departmentId: 'DEP-CSE',
      designation: 'Associate Professor',
      specialization: 'Distributed Databases, Big Data & Cloud Architecture',
      experienceYears: 12,
      maxHours: 16,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      assignedSubjects: ['SUB-CS301', 'SUB-CS305']
    },
    {
      id: 'FAC-102',
      name: 'Prof. Rahul Sharma',
      email: 'rahul.sharma@apex.edu',
      phone: '+91 97412 88412',
      departmentId: 'DEP-AIML',
      designation: 'Assistant Professor & HOD',
      specialization: 'Deep Learning, Computer Vision, Neural Networks',
      experienceYears: 9,
      maxHours: 16,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      assignedSubjects: ['SUB-AI401', 'SUB-AI402']
    },
    {
      id: 'FAC-103',
      name: 'Dr. Priya Nair',
      email: 'priya.nair@apex.edu',
      phone: '+91 94480 33419',
      departmentId: 'DEP-MATH',
      designation: 'Professor & HOD',
      specialization: 'Discrete Mathematics, Graph Theory & Cryptography',
      experienceYears: 20,
      maxHours: 14,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      assignedSubjects: ['SUB-MA201']
    },
    {
      id: 'FAC-104',
      name: 'Prof. Arjun Kumar',
      email: 'arjun.kumar@apex.edu',
      phone: '+91 98860 11928',
      departmentId: 'DEP-ECE',
      designation: 'Assistant Professor',
      specialization: 'Embedded Systems, IoT & VLSI Design',
      experienceYears: 7,
      maxHours: 18,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      assignedSubjects: ['SUB-EC301', 'SUB-EC302']
    },
    {
      id: 'FAC-105',
      name: 'Dr. Rajesh Verma',
      email: 'rajesh.verma@apex.edu',
      phone: '+91 99160 44512',
      departmentId: 'DEP-CSE',
      designation: 'Professor & HOD',
      specialization: 'Computer Networks, Network Security & Blockchain',
      experienceYears: 22,
      maxHours: 14,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      assignedSubjects: ['SUB-CS302']
    },
    {
      id: 'FAC-106',
      name: 'Prof. Sneha Patel',
      email: 'sneha.patel@apex.edu',
      phone: '+91 98450 77123',
      departmentId: 'DEP-AIML',
      designation: 'Assistant Professor',
      specialization: 'Natural Language Processing & Reinforcement Learning',
      experienceYears: 5,
      maxHours: 18,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      assignedSubjects: ['SUB-AI403', 'SUB-CS303']
    },
    {
      id: 'FAC-107',
      name: 'Dr. Vikram Malhotra',
      email: 'vikram.m@apex.edu',
      phone: '+91 98112 55901',
      departmentId: 'DEP-CSE',
      designation: 'Associate Professor',
      specialization: 'Operating Systems & System Software',
      experienceYears: 14,
      maxHours: 16,
      status: 'On Leave',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      assignedSubjects: []
    }
  ],

  subjects: [
    {
      code: 'SUB-CS301',
      name: 'Database Management Systems',
      shortName: 'DBMS',
      departmentId: 'DEP-CSE',
      semester: 5,
      credits: 4,
      lectureHours: 3,
      tutorialHours: 0,
      practicalHours: 2, // lab counts as 2 hrs teaching
      type: 'Integrated', // Theory + Lab
      color: '#3b82f6'
    },
    {
      code: 'SUB-CS302',
      name: 'Computer Networks',
      shortName: 'CN',
      departmentId: 'DEP-CSE',
      semester: 5,
      credits: 3,
      lectureHours: 3,
      tutorialHours: 0,
      practicalHours: 0,
      type: 'Theory',
      color: '#0ea5e9'
    },
    {
      code: 'SUB-CS303',
      name: 'Data Structures & Algorithms',
      shortName: 'DSA',
      departmentId: 'DEP-CSE',
      semester: 3,
      credits: 4,
      lectureHours: 3,
      tutorialHours: 1,
      practicalHours: 2,
      type: 'Integrated',
      color: '#6366f1'
    },
    {
      code: 'SUB-CS305',
      name: 'Cloud Computing & DevOps',
      shortName: 'Cloud',
      departmentId: 'DEP-CSE',
      semester: 7,
      credits: 3,
      lectureHours: 3,
      tutorialHours: 0,
      practicalHours: 0,
      type: 'Theory',
      color: '#06b6d4'
    },
    {
      code: 'SUB-AI401',
      name: 'Machine Learning Fundamentals',
      shortName: 'ML',
      departmentId: 'DEP-AIML',
      semester: 5,
      credits: 4,
      lectureHours: 3,
      tutorialHours: 0,
      practicalHours: 2,
      type: 'Integrated',
      color: '#8b5cf6'
    },
    {
      code: 'SUB-AI402',
      name: 'Deep Learning & Neural Networks',
      shortName: 'DL & NN',
      departmentId: 'DEP-AIML',
      semester: 7,
      credits: 4,
      lectureHours: 3,
      tutorialHours: 0,
      practicalHours: 2,
      type: 'Integrated',
      color: '#a855f7'
    },
    {
      code: 'SUB-AI403',
      name: 'Natural Language Processing',
      shortName: 'NLP',
      departmentId: 'DEP-AIML',
      semester: 7,
      credits: 3,
      lectureHours: 3,
      tutorialHours: 0,
      practicalHours: 0,
      type: 'Theory',
      color: '#d946ef'
    },
    {
      code: 'SUB-EC301',
      name: 'Digital Signal Processing',
      shortName: 'DSP',
      departmentId: 'DEP-ECE',
      semester: 5,
      credits: 4,
      lectureHours: 3,
      tutorialHours: 1,
      practicalHours: 0,
      type: 'Theory',
      color: '#14b8a6'
    },
    {
      code: 'SUB-EC302',
      name: 'VLSI Design & Embedded Systems',
      shortName: 'VLSI',
      departmentId: 'DEP-ECE',
      semester: 6,
      credits: 4,
      lectureHours: 3,
      tutorialHours: 0,
      practicalHours: 2,
      type: 'Integrated',
      color: '#10b981'
    },
    {
      code: 'SUB-MA201',
      name: 'Discrete Mathematics & Graph Theory',
      shortName: 'DMGT',
      departmentId: 'DEP-MATH',
      semester: 3,
      credits: 4,
      lectureHours: 3,
      tutorialHours: 1,
      practicalHours: 0,
      type: 'Theory',
      color: '#f59e0b'
    }
  ],

  rooms: [
    {
      roomNo: 'A-101',
      building: 'Block A (Alan Turing Block)',
      floor: 1,
      capacity: 65,
      type: 'Lecture Hall',
      hasProjector: true,
      hasSmartBoard: true,
      isAvailable: true,
      currentClass: 'Free'
    },
    {
      roomNo: 'A-202',
      building: 'Block A (Alan Turing Block)',
      floor: 2,
      capacity: 65,
      type: 'Lecture Hall',
      hasProjector: true,
      hasSmartBoard: false,
      isAvailable: true,
      currentClass: 'Free'
    },
    {
      roomNo: 'B-305',
      building: 'Block B (J.C. Bose Block)',
      floor: 3,
      capacity: 120,
      type: 'Seminar Hall',
      hasProjector: true,
      hasSmartBoard: true,
      isAvailable: true,
      currentClass: 'Free'
    },
    {
      roomNo: 'Lab-1',
      building: 'Block A (Alan Turing Block)',
      floor: 1,
      capacity: 45,
      type: 'Computer Lab',
      hasProjector: true,
      hasSmartBoard: true,
      isAvailable: true,
      currentClass: 'Free'
    },
    {
      roomNo: 'Lab-2',
      building: 'Block A (Alan Turing Block)',
      floor: 2,
      capacity: 40,
      type: 'AI & Data Lab',
      hasProjector: true,
      hasSmartBoard: true,
      isAvailable: true,
      currentClass: 'Free'
    },
    {
      roomNo: 'C-104',
      building: 'Block C (Ramanujan Block)',
      floor: 1,
      capacity: 70,
      type: 'Lecture Hall',
      hasProjector: true,
      hasSmartBoard: false,
      isAvailable: true,
      currentClass: 'Free'
    }
  ],

  sections: [
    { id: 'SEC-CSE-3A', name: 'CSE - 3rd Sem (Sec A)', departmentId: 'DEP-CSE', semester: 3, studentCount: 62 },
    { id: 'SEC-CSE-5A', name: 'CSE - 5th Sem (Sec A)', departmentId: 'DEP-CSE', semester: 5, studentCount: 58 },
    { id: 'SEC-CSE-5B', name: 'CSE - 5th Sem (Sec B)', departmentId: 'DEP-CSE', semester: 5, studentCount: 60 },
    { id: 'SEC-AIML-5A', name: 'AI & ML - 5th Sem', departmentId: 'DEP-AIML', semester: 5, studentCount: 54 },
    { id: 'SEC-ECE-5A', name: 'ECE - 5th Sem', departmentId: 'DEP-ECE', semester: 5, studentCount: 56 }
  ],

  timeSlots: [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 01:00',
    '01:00 - 02:00', // Lunch break
    '02:00 - 03:00',
    '03:00 - 04:00',
    '04:00 - 05:00'
  ],

  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

  timetable: [
    // MONDAY
    {
      id: 'TT-001',
      day: 'Monday',
      timeSlot: '09:00 - 10:00',
      subjectCode: 'SUB-CS301',
      facultyId: 'FAC-101', // Dr. Ananya Rao
      roomNo: 'A-101',
      sectionId: 'SEC-CSE-5A',
      type: 'Lecture'
    },
    {
      id: 'TT-002',
      day: 'Monday',
      timeSlot: '10:00 - 11:00',
      subjectCode: 'SUB-CS302',
      facultyId: 'FAC-105', // Dr. Rajesh Verma
      roomNo: 'A-101',
      sectionId: 'SEC-CSE-5A',
      type: 'Lecture'
    },
    {
      id: 'TT-003',
      day: 'Monday',
      timeSlot: '11:00 - 12:00',
      subjectCode: 'SUB-MA201',
      facultyId: 'FAC-103', // Dr. Priya Nair
      roomNo: 'A-101',
      sectionId: 'SEC-CSE-5A',
      type: 'Lecture'
    },
    {
      id: 'TT-004',
      day: 'Monday',
      timeSlot: '09:00 - 10:00',
      subjectCode: 'SUB-AI401',
      facultyId: 'FAC-102', // Prof. Rahul Sharma
      roomNo: 'A-202',
      sectionId: 'SEC-AIML-5A',
      type: 'Lecture'
    },
    {
      id: 'TT-005',
      day: 'Monday',
      timeSlot: '02:00 - 04:00',
      timeSlotStart: '02:00 - 03:00',
      timeSlotEnd: '03:00 - 04:00',
      subjectCode: 'SUB-CS301',
      facultyId: 'FAC-101', // Dr. Ananya Rao
      roomNo: 'Lab-1',
      sectionId: 'SEC-CSE-5A',
      type: 'Practical Lab'
    },

    // TUESDAY
    {
      id: 'TT-006',
      day: 'Tuesday',
      timeSlot: '09:00 - 10:00',
      subjectCode: 'SUB-CS302',
      facultyId: 'FAC-105', // Dr. Rajesh Verma
      roomNo: 'A-101',
      sectionId: 'SEC-CSE-5A',
      type: 'Lecture'
    },
    {
      id: 'TT-007',
      day: 'Tuesday',
      timeSlot: '10:00 - 11:00',
      subjectCode: 'SUB-CS301',
      facultyId: 'FAC-101', // Dr. Ananya Rao
      roomNo: 'A-101',
      sectionId: 'SEC-CSE-5A',
      type: 'Lecture'
    },
    {
      id: 'TT-008',
      day: 'Tuesday',
      timeSlot: '11:00 - 12:00',
      subjectCode: 'SUB-AI402',
      facultyId: 'FAC-102', // Prof. Rahul Sharma
      roomNo: 'A-202',
      sectionId: 'SEC-AIML-5A',
      type: 'Lecture'
    },
    {
      id: 'TT-009',
      day: 'Tuesday',
      timeSlot: '02:00 - 04:00',
      timeSlotStart: '02:00 - 03:00',
      timeSlotEnd: '03:00 - 04:00',
      subjectCode: 'SUB-AI401',
      facultyId: 'FAC-102', // Prof. Rahul Sharma
      roomNo: 'Lab-2',
      sectionId: 'SEC-AIML-5A',
      type: 'Practical Lab'
    },
    {
      id: 'TT-010',
      day: 'Tuesday',
      timeSlot: '03:00 - 04:00',
      subjectCode: 'SUB-CS305',
      facultyId: 'FAC-101', // Dr. Ananya Rao
      roomNo: 'B-305',
      sectionId: 'SEC-CSE-5B',
      type: 'Lecture'
    },

    // WEDNESDAY
    {
      id: 'TT-011',
      day: 'Wednesday',
      timeSlot: '09:00 - 10:00',
      subjectCode: 'SUB-MA201',
      facultyId: 'FAC-103', // Dr. Priya Nair
      roomNo: 'A-101',
      sectionId: 'SEC-CSE-5A',
      type: 'Lecture'
    },
    {
      id: 'TT-012',
      day: 'Wednesday',
      timeSlot: '10:00 - 11:00',
      subjectCode: 'SUB-CS301',
      facultyId: 'FAC-101', // Dr. Ananya Rao
      roomNo: 'A-101',
      sectionId: 'SEC-CSE-5A',
      type: 'Lecture'
    },
    {
      id: 'TT-013',
      day: 'Wednesday',
      timeSlot: '11:00 - 12:00',
      subjectCode: 'SUB-CS302',
      facultyId: 'FAC-105', // Dr. Rajesh Verma
      roomNo: 'A-101',
      sectionId: 'SEC-CSE-5A',
      type: 'Lecture'
    },
    {
      id: 'TT-014',
      day: 'Wednesday',
      timeSlot: '02:00 - 03:00',
      subjectCode: 'SUB-EC301',
      facultyId: 'FAC-104', // Prof. Arjun Kumar
      roomNo: 'A-202',
      sectionId: 'SEC-ECE-5A',
      type: 'Lecture'
    },

    // THURSDAY
    {
      id: 'TT-015',
      day: 'Thursday',
      timeSlot: '09:00 - 10:00',
      subjectCode: 'SUB-AI401',
      facultyId: 'FAC-102', // Prof. Rahul Sharma
      roomNo: 'A-202',
      sectionId: 'SEC-AIML-5A',
      type: 'Lecture'
    },
    {
      id: 'TT-016',
      day: 'Thursday',
      timeSlot: '10:00 - 11:00',
      subjectCode: 'SUB-CS305',
      facultyId: 'FAC-101', // Dr. Ananya Rao
      roomNo: 'A-101',
      sectionId: 'SEC-CSE-5A',
      type: 'Lecture'
    },
    {
      id: 'TT-017',
      day: 'Thursday',
      timeSlot: '11:00 - 12:00',
      subjectCode: 'SUB-EC302',
      facultyId: 'FAC-104', // Prof. Arjun Kumar
      roomNo: 'B-305',
      sectionId: 'SEC-ECE-5A',
      type: 'Lecture'
    },
    {
      id: 'TT-018',
      day: 'Thursday',
      timeSlot: '02:00 - 04:00',
      timeSlotStart: '02:00 - 03:00',
      timeSlotEnd: '03:00 - 04:00',
      subjectCode: 'SUB-EC302',
      facultyId: 'FAC-104', // Prof. Arjun Kumar
      roomNo: 'Lab-1',
      sectionId: 'SEC-ECE-5A',
      type: 'Practical Lab'
    },

    // FRIDAY
    {
      id: 'TT-019',
      day: 'Friday',
      timeSlot: '09:00 - 10:00',
      subjectCode: 'SUB-CS301',
      facultyId: 'FAC-101', // Dr. Ananya Rao
      roomNo: 'A-101',
      sectionId: 'SEC-CSE-5B',
      type: 'Lecture'
    },
    {
      id: 'TT-020',
      day: 'Friday',
      timeSlot: '10:00 - 11:00',
      subjectCode: 'SUB-MA201',
      facultyId: 'FAC-103', // Dr. Priya Nair
      roomNo: 'A-101',
      sectionId: 'SEC-CSE-5A',
      type: 'Lecture'
    },
    {
      id: 'TT-021',
      day: 'Friday',
      timeSlot: '11:00 - 12:00',
      subjectCode: 'SUB-AI403',
      facultyId: 'FAC-106', // Prof. Sneha Patel
      roomNo: 'A-202',
      sectionId: 'SEC-AIML-5A',
      type: 'Lecture'
    },
    {
      id: 'TT-022',
      day: 'Friday',
      timeSlot: '02:00 - 03:00',
      subjectCode: 'SUB-CS303',
      facultyId: 'FAC-106', // Prof. Sneha Patel
      roomNo: 'A-101',
      sectionId: 'SEC-CSE-3A',
      type: 'Lecture'
    },

    // SATURDAY
    {
      id: 'TT-023',
      day: 'Saturday',
      timeSlot: '09:00 - 11:00',
      timeSlotStart: '09:00 - 10:00',
      timeSlotEnd: '10:00 - 11:00',
      subjectCode: 'SUB-CS301',
      facultyId: 'FAC-101', // Dr. Ananya Rao
      roomNo: 'Lab-1',
      sectionId: 'SEC-CSE-5B',
      type: 'Practical Lab'
    },
    {
      id: 'TT-024',
      day: 'Saturday',
      timeSlot: '11:00 - 12:00',
      subjectCode: 'SUB-CS305',
      facultyId: 'FAC-101', // Dr. Ananya Rao
      roomNo: 'A-101',
      sectionId: 'SEC-CSE-5A',
      type: 'Tutorial'
    }
  ],

  notifications: [
    {
      id: 'NOTIF-01',
      title: 'Timetable Published',
      message: 'Fall Semester 2026 timetable has been officially finalized for CSE & AIML.',
      type: 'info',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: 'NOTIF-02',
      title: 'Workload Threshold Warning',
      message: 'Dr. Ananya Rao has reached 17.0 hrs/week (Maximum allowed: 16.0 hrs).',
      type: 'warning',
      timestamp: 'Yesterday',
      read: false
    },
    {
      id: 'NOTIF-03',
      title: 'Room Maintenance Notice',
      message: 'Lab-2 air conditioning scheduled for routine maintenance this Saturday 2 PM - 5 PM.',
      type: 'alert',
      timestamp: '2 days ago',
      read: true
    },
    {
      id: 'NOTIF-04',
      title: 'New Subject Allocation',
      message: 'Prof. Sneha Patel assigned to Natural Language Processing (SUB-AI403).',
      type: 'success',
      timestamp: '3 days ago',
      read: true
    }
  ],

  settings: {
    universityName: 'Apex Institute of Engineering & Technology',
    portalTitle: 'Faculty Workload & Timetable Management Portal',
    academicYear: '2026-2027',
    currentSemester: 'Odd Semester (Fall 2026)',
    maxTeachingHours: 16,
    minTeachingHours: 10,
    excessWorkloadThreshold: 16,
    lowWorkloadThreshold: 11,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    lunchBreakSlot: '01:00 - 02:00'
  }
};

class AcademicDatabase {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using initial seed data.', e);
    }
    this.save(INITIAL_DATABASE);
    return JSON.parse(JSON.stringify(INITIAL_DATABASE));
  }

  save(dataToSave) {
    if (dataToSave) this.data = dataToSave;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATABASE));
    this.save();
    return this.data;
  }

  // --- Relational Calculation Helpers ---

  // Calculate actual scheduled weekly hours for a faculty member from timetable slots
  getFacultyScheduledHours(facultyId) {
    const slots = this.data.timetable.filter(t => t.facultyId === facultyId);
    let totalHours = 0;
    slots.forEach(slot => {
      // If multi-hour slot
      if (slot.timeSlot.includes('09:00 - 11:00') || slot.timeSlot.includes('02:00 - 04:00')) {
        totalHours += 2;
      } else {
        totalHours += 1;
      }
    });
    return totalHours;
  }

  // Get Faculty enriched with departmental info and calculated workload
  getFacultyList() {
    return this.data.faculty.map(f => {
      const dept = this.data.departments.find(d => d.id === f.departmentId);
      const scheduledHours = this.getFacultyScheduledHours(f.id);
      
      // Determine workload status
      let workloadStatus = 'Optimal';
      let workloadClass = 'status-optimal';
      if (scheduledHours > f.maxHours) {
        workloadStatus = 'Overloaded';
        workloadClass = 'status-overloaded';
      } else if (scheduledHours < this.data.settings.lowWorkloadThreshold) {
        workloadStatus = 'Underloaded';
        workloadClass = 'status-underloaded';
      }

      // Enriched subject objects
      const subjects = (f.assignedSubjects || []).map(subCode => 
        this.data.subjects.find(s => s.code === subCode)
      ).filter(Boolean);

      return {
        ...f,
        departmentName: dept ? dept.name : 'Unknown',
        departmentCode: dept ? dept.code : 'GEN',
        scheduledHours,
        workloadStatus,
        workloadClass,
        assignedSubjectDetails: subjects
      };
    });
  }

  // Get Faculty by ID
  getFacultyById(id) {
    return this.getFacultyList().find(f => f.id === id);
  }

  // Get Subjects enriched with department and assigned faculty
  getSubjectList() {
    return this.data.subjects.map(s => {
      const dept = this.data.departments.find(d => d.id === s.departmentId);
      const assignedFaculty = this.data.faculty.filter(f => (f.assignedSubjects || []).includes(s.code));
      const totalHours = (s.lectureHours || 0) + (s.tutorialHours || 0) + (s.practicalHours || 0);

      return {
        ...s,
        departmentName: dept ? dept.name : 'General',
        departmentCode: dept ? dept.code : 'GEN',
        assignedFaculty,
        totalHours
      };
    });
  }

  // Get Rooms enriched with current occupancy and utilization
  getRoomList() {
    return this.data.rooms.map(room => {
      const daySlots = this.data.timetable.filter(t => t.roomNo === room.roomNo && t.day === 'Monday');
      const utilization = Math.min(100, Math.round((daySlots.length / 7) * 100)); // 7 working slots

      // Find if occupied at current simulated slot (e.g., 10:00 - 11:00)
      const activeSlot = daySlots.find(s => s.timeSlot === '10:00 - 11:00');
      let currentClassDesc = 'Free';
      let isAvailable = true;

      if (activeSlot) {
        const sub = this.data.subjects.find(s => s.code === activeSlot.subjectCode);
        currentClassDesc = sub ? `${sub.shortName} (${activeSlot.sectionId})` : 'Class in Session';
        isAvailable = false;
      }

      return {
        ...room,
        utilization,
        mondaySlotsCount: daySlots.length,
        currentClass: currentClassDesc,
        isAvailable
      };
    });
  }

  // Conflict Detection Engine
  detectConflict({ day, timeSlot, facultyId, roomNo, sectionId, excludeId = null }) {
    const conflicts = [];
    const entries = this.data.timetable.filter(t => t.id !== excludeId && t.day === day);

    // Helper to check slot overlap
    const isSlotOverlap = (slotA, slotB) => {
      if (slotA === slotB) return true;
      if (slotA === '02:00 - 04:00' && (slotB === '02:00 - 03:00' || slotB === '03:00 - 04:00')) return true;
      if (slotB === '02:00 - 04:00' && (slotA === '02:00 - 03:00' || slotA === '03:00 - 04:00')) return true;
      if (slotA === '09:00 - 11:00' && (slotB === '09:00 - 10:00' || slotB === '10:00 - 11:00')) return true;
      if (slotB === '09:00 - 11:00' && (slotA === '09:00 - 10:00' || slotA === '10:00 - 11:00')) return true;
      return false;
    };

    entries.forEach(item => {
      if (!isSlotOverlap(item.timeSlot, timeSlot)) return;

      const sub = this.data.subjects.find(s => s.code === item.subjectCode) || { shortName: item.subjectCode };
      const fac = this.data.faculty.find(f => f.id === item.facultyId) || { name: 'Unknown Faculty' };
      const sec = this.data.sections.find(s => s.id === item.sectionId) || { name: item.sectionId };

      // 1. Faculty Collision
      if (item.facultyId === facultyId) {
        conflicts.push({
          type: 'faculty',
          message: `Faculty Clash: ${fac.name} is already teaching ${sub.shortName} (${sec.name}) during ${timeSlot} on ${day}.`
        });
      }

      // 2. Room Collision
      if (item.roomNo === roomNo) {
        conflicts.push({
          type: 'room',
          message: `Room Clash: ${roomNo} is already occupied by ${fac.name} for ${sub.shortName} during ${timeSlot} on ${day}.`
        });
      }

      // 3. Section Collision
      if (item.sectionId === sectionId) {
        conflicts.push({
          type: 'section',
          message: `Section Clash: Class ${sec.name} is already scheduled for ${sub.shortName} in room ${item.roomNo} during ${timeSlot}.`
        });
      }
    });

    return conflicts;
  }

  // Add or Update Timetable Slot
  saveTimetableSlot(slotData) {
    if (slotData.id) {
      const idx = this.data.timetable.findIndex(t => t.id === slotData.id);
      if (idx !== -1) {
        this.data.timetable[idx] = { ...this.data.timetable[idx], ...slotData };
      }
    } else {
      const newId = 'TT-' + String(Date.now()).slice(-4);
      this.data.timetable.push({ ...slotData, id: newId });
    }
    this.save();
    return true;
  }

  deleteTimetableSlot(id) {
    this.data.timetable = this.data.timetable.filter(t => t.id !== id);
    this.save();
    return true;
  }

  // Faculty CRUD
  saveFaculty(facultyData) {
    if (facultyData.id && this.data.faculty.some(f => f.id === facultyData.id)) {
      const idx = this.data.faculty.findIndex(f => f.id === facultyData.id);
      this.data.faculty[idx] = { ...this.data.faculty[idx], ...facultyData };
    } else {
      const newId = facultyData.id || 'FAC-' + (100 + this.data.faculty.length + 1);
      this.data.faculty.push({
        ...facultyData,
        id: newId,
        assignedSubjects: facultyData.assignedSubjects || [],
        status: facultyData.status || 'Active',
        avatar: facultyData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(facultyData.name)}&background=0284c7&color=fff`
      });
    }
    this.save();
    return true;
  }

  deleteFaculty(id) {
    this.data.faculty = this.data.faculty.filter(f => f.id !== id);
    this.data.timetable = this.data.timetable.filter(t => t.facultyId !== id);
    this.save();
    return true;
  }

  // Subject CRUD
  saveSubject(subjectData) {
    if (this.data.subjects.some(s => s.code === subjectData.code)) {
      const idx = this.data.subjects.findIndex(s => s.code === subjectData.code);
      this.data.subjects[idx] = { ...this.data.subjects[idx], ...subjectData };
    } else {
      this.data.subjects.push(subjectData);
    }
    this.save();
    return true;
  }

  deleteSubject(code) {
    this.data.subjects = this.data.subjects.filter(s => s.code !== code);
    this.data.faculty.forEach(f => {
      if (f.assignedSubjects) {
        f.assignedSubjects = f.assignedSubjects.filter(c => c !== code);
      }
    });
    this.data.timetable = this.data.timetable.filter(t => t.subjectCode !== code);
    this.save();
    return true;
  }

  // Room CRUD
  saveRoom(roomData) {
    const idx = this.data.rooms.findIndex(r => r.roomNo === roomData.roomNo);
    if (idx !== -1) {
      this.data.rooms[idx] = { ...this.data.rooms[idx], ...roomData };
    } else {
      this.data.rooms.push({ ...roomData, isAvailable: true, currentClass: 'Free' });
    }
    this.save();
    return true;
  }

  deleteRoom(roomNo) {
    this.data.rooms = this.data.rooms.filter(r => r.roomNo !== roomNo);
    this.save();
    return true;
  }

  // Assign / Unassign subject to faculty
  toggleFacultySubject(facultyId, subjectCode) {
    const faculty = this.data.faculty.find(f => f.id === facultyId);
    if (!faculty) return false;

    if (!faculty.assignedSubjects) faculty.assignedSubjects = [];

    if (faculty.assignedSubjects.includes(subjectCode)) {
      faculty.assignedSubjects = faculty.assignedSubjects.filter(c => c !== subjectCode);
    } else {
      faculty.assignedSubjects.push(subjectCode);
    }
    this.save();
    return true;
  }
}

// Global instance
window.db = new AcademicDatabase();
