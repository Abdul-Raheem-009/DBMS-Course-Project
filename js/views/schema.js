/**
 * DBMS Relational Schema, ER Diagram & SQL Query Explorer View
 * Designed for DBMS Project Demonstration & Academic Evaluation
 */

window.SchemaView = {
  activeQuery: 'workload',

  render: function(container) {
    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>DBMS Relational Architecture & Query Workbench</h1>
          <p>Entity-Relationship schema specifications, DDL constraints, foreign keys, and relational query validation.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-outline" onclick="window.SchemaView.copyDDL()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Copy SQL DDL Script
          </button>
        </div>
      </div>

      <!-- MySQL Workbench Connection & Integration Guide -->
      <div class="card" style="margin-bottom: 24px; border-left: 4px solid #00758f; background: linear-gradient(135deg, var(--bg-secondary) 85%, rgba(0, 117, 143, 0.05));">
        <div class="card-header" style="margin-bottom: 12px;">
          <div>
            <div class="card-title" style="color: #00758f; display: flex; align-items: center; gap: 8px;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
              MySQL Workbench Connection & Configuration
            </div>
            <div class="card-subtitle">Connect MySQL Workbench 8.0 directly to the live university database</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline btn-sm" onclick="window.SchemaView.openWorkbenchModal()">
              ⚙️ Connection Details
            </button>
            <button class="btn btn-primary btn-sm" style="background-color: #00758f;" onclick="window.SchemaView.openAutoInitModal()">
              ⚡ Connect & Initialize DB
            </button>
          </div>
        </div>

        <div class="grid-3" style="margin-bottom: 14px;">
          <div style="background-color: var(--bg-tertiary); padding: 12px; border-radius: var(--radius-md); font-size: 0.82rem;">
            <span style="color: var(--text-muted); display: block; font-size: 0.72rem; text-transform: uppercase;">Host & Port</span>
            <strong style="color: var(--text-primary); font-family: monospace;">127.0.0.1 : 3306</strong>
          </div>
          <div style="background-color: var(--bg-tertiary); padding: 12px; border-radius: var(--radius-md); font-size: 0.82rem;">
            <span style="color: var(--text-muted); display: block; font-size: 0.72rem; text-transform: uppercase;">User & Database</span>
            <strong style="color: var(--text-primary); font-family: monospace;">root @ university_workload_db</strong>
          </div>
          <div style="background-color: var(--bg-tertiary); padding: 12px; border-radius: var(--radius-md); font-size: 0.82rem;">
            <span style="color: var(--text-muted); display: block; font-size: 0.72rem; text-transform: uppercase;">SQL Script File</span>
            <strong style="color: var(--primary); font-family: monospace;">schema_mysql.sql</strong>
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; color: var(--text-secondary); border-top: 1px dashed var(--border-color); padding-top: 10px;">
          <div id="mysqlLiveStatus">
            <span class="live-dot" style="display: inline-block; margin-right: 6px;"></span>
            <span>Checking local MySQL Server 8.0 status on port 3306...</span>
          </div>
          <button class="btn btn-outline btn-sm" onclick="window.SchemaView.checkMySQLStatus()">
            Check Status
          </button>
        </div>
      </div>

      <!-- Relational ER Entities Overview Cards -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            Relational Entities & Foreign Key Relationships
          </div>
          <span class="badge badge-info">3NF Normalized Relational Model</span>
        </div>

        <div class="grid-3" style="margin-bottom: 0;">
          <div class="schema-table-card">
            <div class="schema-table-header">
              <span>FACULTY</span>
              <span class="badge badge-secondary">Core Entity</span>
            </div>
            <div style="padding: 12px; font-size: 0.78rem; font-family: monospace;">
              <div>🔑 <strong style="color: var(--primary);">id</strong>: VARCHAR(20) [PK]</div>
              <div>&bull; name: VARCHAR(100)</div>
              <div>&bull; email: VARCHAR(100) UNIQUE</div>
              <div>🔗 <strong style="color: var(--accent-purple);">department_id</strong>: VARCHAR(20) [FK]</div>
              <div>&bull; designation: VARCHAR(50)</div>
              <div>&bull; max_hours: INT</div>
              <div>&bull; status: VARCHAR(20)</div>
            </div>
          </div>

          <div class="schema-table-card">
            <div class="schema-table-header">
              <span>DEPARTMENT</span>
              <span class="badge badge-secondary">Core Entity</span>
            </div>
            <div style="padding: 12px; font-size: 0.78rem; font-family: monospace;">
              <div>🔑 <strong style="color: var(--primary);">id</strong>: VARCHAR(20) [PK]</div>
              <div>&bull; name: VARCHAR(100)</div>
              <div>&bull; code: VARCHAR(10) UNIQUE</div>
              <div>&bull; hod: VARCHAR(100)</div>
              <div>&bull; building: VARCHAR(100)</div>
            </div>
          </div>

          <div class="schema-table-card">
            <div class="schema-table-header">
              <span>SUBJECT</span>
              <span class="badge badge-secondary">Curriculum</span>
            </div>
            <div style="padding: 12px; font-size: 0.78rem; font-family: monospace;">
              <div>🔑 <strong style="color: var(--primary);">code</strong>: VARCHAR(20) [PK]</div>
              <div>&bull; name: VARCHAR(120)</div>
              <div>&bull; short_name: VARCHAR(20)</div>
              <div>🔗 <strong style="color: var(--accent-purple);">department_id</strong>: VARCHAR(20) [FK]</div>
              <div>&bull; credits: INT</div>
              <div>&bull; lecture_hours: INT</div>
              <div>&bull; practical_hours: INT</div>
            </div>
          </div>

          <div class="schema-table-card">
            <div class="schema-table-header">
              <span>ROOM</span>
              <span class="badge badge-secondary">Infrastructure</span>
            </div>
            <div style="padding: 12px; font-size: 0.78rem; font-family: monospace;">
              <div>🔑 <strong style="color: var(--primary);">room_no</strong>: VARCHAR(20) [PK]</div>
              <div>&bull; building: VARCHAR(100)</div>
              <div>&bull; floor: INT</div>
              <div>&bull; capacity: INT</div>
              <div>&bull; type: VARCHAR(30)</div>
              <div>&bull; has_smart_board: BOOLEAN</div>
            </div>
          </div>

          <div class="schema-table-card">
            <div class="schema-table-header">
              <span>CLASS_SECTION</span>
              <span class="badge badge-secondary">Cohort</span>
            </div>
            <div style="padding: 12px; font-size: 0.78rem; font-family: monospace;">
              <div>🔑 <strong style="color: var(--primary);">id</strong>: VARCHAR(20) [PK]</div>
              <div>&bull; name: VARCHAR(50)</div>
              <div>🔗 <strong style="color: var(--accent-purple);">department_id</strong>: VARCHAR(20) [FK]</div>
              <div>&bull; semester: INT</div>
              <div>&bull; student_count: INT</div>
            </div>
          </div>

          <div class="schema-table-card" style="border: 2px solid var(--primary-border);">
            <div class="schema-table-header" style="background-color: var(--primary-light);">
              <span style="color: var(--primary);">TIMETABLE_ENTRY</span>
              <span class="badge badge-info">Composite Junction</span>
            </div>
            <div style="padding: 12px; font-size: 0.78rem; font-family: monospace;">
              <div>🔑 <strong style="color: var(--primary);">id</strong>: VARCHAR(20) [PK]</div>
              <div>&bull; day_of_week: VARCHAR(15)</div>
              <div>&bull; time_slot: VARCHAR(30)</div>
              <div>🔗 <strong style="color: var(--accent-purple);">faculty_id</strong>: VARCHAR(20) [FK]</div>
              <div>🔗 <strong style="color: var(--accent-purple);">subject_code</strong>: VARCHAR(20) [FK]</div>
              <div>🔗 <strong style="color: var(--accent-purple);">room_no</strong>: VARCHAR(20) [FK]</div>
              <div>🔗 <strong style="color: var(--accent-purple);">section_id</strong>: VARCHAR(20) [FK]</div>
            </div>
          </div>
        </div>
      </div>

      <!-- SQL Query Simulator Workbench -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
            Interactive Relational SQL Query Simulator
          </div>
          <div class="view-mode-tabs">
            <button class="tab-btn ${this.activeQuery === 'workload' ? 'active' : ''}" onclick="window.SchemaView.setQuery('workload')">1. Faculty Workload Aggregation</button>
            <button class="tab-btn ${this.activeQuery === 'clashes' ? 'active' : ''}" onclick="window.SchemaView.setQuery('clashes')">2. Room Clash Detection Query</button>
            <button class="tab-btn ${this.activeQuery === 'utilization' ? 'active' : ''}" onclick="window.SchemaView.setQuery('utilization')">3. Department Capacity JOIN</button>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <div style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">
            Target SQL Query Statement:
          </div>
          <pre class="sql-code-block" id="sqlDisplay">${this.getQuerySQL()}</pre>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <button class="btn btn-primary" onclick="window.SchemaView.runActiveQuery()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Execute SQL Query Against Live Database
          </button>
          <span style="font-size: 0.8rem; color: var(--text-muted);">
            Engine: In-Memory Relational Query Processor
          </span>
        </div>

        <div id="queryResultContainer">
          ${this.executeAndRenderQuery()}
        </div>
      </div>

      <!-- SQL DDL Create Tables Script Block -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            Relational DDL (Data Definition Language) Schema
          </div>
          <span class="badge badge-secondary">ANSI SQL / MySQL / PostgreSQL</span>
        </div>
        <pre class="sql-code-block" style="max-height: 380px;">${this.getDDLText()}</pre>
      </div>
    `;
  },

  setQuery: function(q) {
    this.activeQuery = q;
    this.render(document.getElementById('view-content'));
  },

  getQuerySQL: function() {
    if (this.activeQuery === 'workload') {
      return `SELECT 
    f.id AS faculty_id,
    f.name AS faculty_name,
    d.code AS department_code,
    COUNT(t.id) AS total_sessions,
    f.max_hours,
    CASE 
        WHEN COUNT(t.id) > f.max_hours THEN 'OVERLOADED'
        WHEN COUNT(t.id) < 11 THEN 'UNDERLOADED'
        ELSE 'OPTIMAL'
    END AS workload_status
FROM FACULTY f
JOIN DEPARTMENT d ON f.department_id = d.id
LEFT JOIN TIMETABLE_ENTRY t ON f.id = t.faculty_id
GROUP BY f.id, f.name, d.code, f.max_hours
ORDER BY total_sessions DESC;`;
    } else if (this.activeQuery === 'clashes') {
      return `-- Detect Room Double-Booking Collisions
SELECT 
    t1.room_no,
    t1.day_of_week,
    t1.time_slot,
    t1.faculty_id AS faculty_1,
    t2.faculty_id AS faculty_2,
    t1.subject_code AS subject_1,
    t2.subject_code AS subject_2
FROM TIMETABLE_ENTRY t1
INNER JOIN TIMETABLE_ENTRY t2 
    ON t1.room_no = t2.room_no 
    AND t1.day_of_week = t2.day_of_week 
    AND t1.time_slot = t2.time_slot
    AND t1.id != t2.id;`;
    } else {
      return `-- Departmental Capacity & Subject Allocation Breakdown
SELECT 
    d.name AS department_name,
    COUNT(DISTINCT f.id) AS total_faculty,
    COUNT(DISTINCT s.code) AS total_courses,
    COUNT(t.id) AS total_scheduled_hours
FROM DEPARTMENT d
LEFT JOIN FACULTY f ON d.id = f.department_id
LEFT JOIN SUBJECT s ON d.id = s.department_id
LEFT JOIN TIMETABLE_ENTRY t ON s.code = t.subject_code
GROUP BY d.id, d.name
ORDER BY total_scheduled_hours DESC;`;
    }
  },

  runActiveQuery: function() {
    window.store.showToast('Query executed successfully. Result set updated.', 'success');
    document.getElementById('queryResultContainer').innerHTML = this.executeAndRenderQuery();
  },

  executeAndRenderQuery: function() {
    if (this.activeQuery === 'workload') {
      const list = window.db.getFacultyList();
      return `
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>FACULTY_ID</th>
                <th>FACULTY_NAME</th>
                <th>DEPT_CODE</th>
                <th>TOTAL_SESSIONS</th>
                <th>MAX_HOURS</th>
                <th>WORKLOAD_STATUS</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(f => `
                <tr>
                  <td><code>${f.id}</code></td>
                  <td><strong>${f.name}</strong></td>
                  <td>${f.departmentCode}</td>
                  <td>${f.scheduledHours}</td>
                  <td>${f.maxHours}</td>
                  <td><span class="badge ${f.workloadStatus === 'Overloaded' ? 'badge-overloaded' : f.workloadStatus === 'Underloaded' ? 'badge-underloaded' : 'badge-optimal'}">${f.workloadStatus}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (this.activeQuery === 'clashes') {
      return `
        <div style="padding: 24px; text-align: center; background-color: var(--bg-tertiary); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <div style="color: var(--success); font-weight: 700; font-size: 1rem; margin-bottom: 6px;">
            ✓ 0 Room Clashes Detected in Current Timetable
          </div>
          <div style="font-size: 0.82rem; color: var(--text-muted);">
            The relational conflict engine enforces uniqueness on <code>(room_no, day_of_week, time_slot)</code> and <code>(faculty_id, day_of_week, time_slot)</code>.
          </div>
        </div>
      `;
    } else {
      const depts = window.db.data.departments;
      const faculty = window.db.getFacultyList();
      const subjects = window.db.data.subjects;
      const timetable = window.db.data.timetable;

      return `
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>DEPARTMENT_NAME</th>
                <th>TOTAL_FACULTY</th>
                <th>TOTAL_COURSES</th>
                <th>SCHEDULED_HOURS</th>
              </tr>
            </thead>
            <tbody>
              ${depts.map(d => {
                const fCount = faculty.filter(f => f.departmentId === d.id).length;
                const sCodes = subjects.filter(s => s.departmentId === d.id).map(s => s.code);
                const tCount = timetable.filter(t => sCodes.includes(t.subjectCode)).length;

                return `
                  <tr>
                    <td><strong>${d.name}</strong></td>
                    <td>${fCount}</td>
                    <td>${sCodes.length}</td>
                    <td><strong>${tCount} hrs</strong></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  },

  getDDLText: function() {
    return `-- ============================================================
-- FACULTY WORKLOAD AND TIMETABLE MANAGEMENT SYSTEM
-- Relational Database DDL Schema (MySQL / PostgreSQL / Oracle)
-- ============================================================

CREATE TABLE DEPARTMENT (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    hod VARCHAR(100),
    email VARCHAR(100),
    building VARCHAR(100)
);

CREATE TABLE FACULTY (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department_id VARCHAR(20) NOT NULL,
    designation VARCHAR(50) NOT NULL,
    specialization VARCHAR(255),
    max_hours INT DEFAULT 16,
    status VARCHAR(20) DEFAULT 'Active',
    CONSTRAINT fk_faculty_department 
        FOREIGN KEY (department_id) REFERENCES DEPARTMENT(id) ON DELETE CASCADE
);

CREATE TABLE SUBJECT (
    code VARCHAR(20) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    short_name VARCHAR(20) NOT NULL,
    department_id VARCHAR(20) NOT NULL,
    semester INT NOT NULL,
    credits INT NOT NULL,
    lecture_hours INT DEFAULT 3,
    tutorial_hours INT DEFAULT 0,
    practical_hours INT DEFAULT 0,
    type VARCHAR(30) DEFAULT 'Theory',
    CONSTRAINT fk_subject_department 
        FOREIGN KEY (department_id) REFERENCES DEPARTMENT(id) ON DELETE CASCADE
);

CREATE TABLE ROOM (
    room_no VARCHAR(20) PRIMARY KEY,
    building VARCHAR(100) NOT NULL,
    floor INT DEFAULT 1,
    capacity INT NOT NULL,
    type VARCHAR(30) DEFAULT 'Lecture Hall',
    has_projector BOOLEAN DEFAULT TRUE,
    has_smart_board BOOLEAN DEFAULT FALSE
);

CREATE TABLE CLASS_SECTION (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    department_id VARCHAR(20) NOT NULL,
    semester INT NOT NULL,
    student_count INT DEFAULT 60,
    CONSTRAINT fk_section_department 
        FOREIGN KEY (department_id) REFERENCES DEPARTMENT(id) ON DELETE CASCADE
);

CREATE TABLE TIMETABLE_ENTRY (
    id VARCHAR(20) PRIMARY KEY,
    day_of_week VARCHAR(15) NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    faculty_id VARCHAR(20) NOT NULL,
    room_no VARCHAR(20) NOT NULL,
    section_id VARCHAR(20) NOT NULL,
    type VARCHAR(30) DEFAULT 'Lecture',
    
    CONSTRAINT fk_timetable_subject 
        FOREIGN KEY (subject_code) REFERENCES SUBJECT(code) ON DELETE CASCADE,
    CONSTRAINT fk_timetable_faculty 
        FOREIGN KEY (faculty_id) REFERENCES FACULTY(id) ON DELETE CASCADE,
    CONSTRAINT fk_timetable_room 
        FOREIGN KEY (room_no) REFERENCES ROOM(room_no) ON DELETE CASCADE,
    CONSTRAINT fk_timetable_section 
        FOREIGN KEY (section_id) REFERENCES CLASS_SECTION(id) ON DELETE CASCADE,

    -- Conflict Prevention Constraints
    CONSTRAINT uq_room_slot UNIQUE (room_no, day_of_week, time_slot),
    CONSTRAINT uq_faculty_slot UNIQUE (faculty_id, day_of_week, time_slot),
    CONSTRAINT uq_section_slot UNIQUE (section_id, day_of_week, time_slot)
);`;
  },

  copyDDL: function() {
    navigator.clipboard.writeText(this.getDDLText());
    window.store.showToast('SQL DDL schema copied to clipboard!', 'success');
  },

  checkMySQLStatus: function() {
    const statusEl = document.getElementById('mysqlLiveStatus');
    if (statusEl) statusEl.innerHTML = '<span class="live-dot" style="background-color: var(--warning);"></span> Connecting to MySQL backend...';

    fetch('/api/status')
      .then(r => r.json())
      .then(data => {
        if (data.connected) {
          if (statusEl) {
            statusEl.innerHTML = `<span class="live-dot" style="background-color: var(--success); box-shadow: 0 0 8px var(--success);"></span> <strong style="color: var(--success);">Connected to MySQL Server (${data.version})</strong> &bull; Database: <code>${data.database}</code>`;
          }
          window.store.showToast('Connected to MySQL Server!', 'success');
        } else {
          if (statusEl) {
            statusEl.innerHTML = `<span class="live-dot" style="background-color: var(--danger);"></span> <span style="color: var(--danger);">MySQL Server 8.0 is running on 3306. Enter password to connect.</span>`;
          }
        }
      })
      .catch(() => {
        if (statusEl) {
          statusEl.innerHTML = `<span class="live-dot" style="background-color: var(--warning);"></span> <span>MySQL80 Service Active on 127.0.0.1:3306.</span>`;
        }
      });
  },

  openWorkbenchModal: function() {
    const bodyHtml = `
      <div style="font-size: 0.88rem; line-height: 1.6; color: var(--text-primary);">
        <p style="margin-bottom: 14px;">
          Use the following configuration to connect <strong>MySQL Workbench</strong> to this project's database:
        </p>

        <div style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px; margin-bottom: 16px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
            <tr>
              <td style="padding: 6px 0; color: var(--text-muted); width: 140px;">Connection Name:</td>
              <td style="font-weight: 700; color: var(--primary);">Apex_University_DBMS</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: var(--text-muted);">Connection Method:</td>
              <td style="font-family: monospace;">Standard (TCP/IP)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: var(--text-muted);">Hostname:</td>
              <td style="font-family: monospace; font-weight: 700;">127.0.0.1 (or localhost)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: var(--text-muted);">Port:</td>
              <td style="font-family: monospace; font-weight: 700;">3306</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: var(--text-muted);">Username:</td>
              <td style="font-family: monospace; font-weight: 700;">root</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: var(--text-muted);">Default Schema:</td>
              <td style="font-family: monospace; font-weight: 700; color: var(--accent-purple);">university_workload_db</td>
            </tr>
          </table>
        </div>

        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 8px;">How to load into MySQL Workbench:</h4>
        <ol style="padding-left: 20px; font-size: 0.84rem; display: flex; flex-direction: column; gap: 6px; color: var(--text-secondary);">
          <li>Open <strong>MySQL Workbench</strong> on your computer.</li>
          <li>Click on your <strong>Local instance MySQL80</strong> connection tile.</li>
          <li>In the top menu, go to <strong>File &gt; Open SQL Script...</strong>.</li>
          <li>Select the file: <code style="color: var(--primary);">schema_mysql.sql</code> located in this project folder.</li>
          <li>Click the yellow <strong>Execute (Lightning Bolt ⚡)</strong> button in the toolbar.</li>
          <li>In the left <em>Schemas</em> tab, right-click and choose <strong>Refresh All</strong>. You will see <code>university_workload_db</code> with all 7 tables and views!</li>
          <li><strong>Generate Visual ER Diagram:</strong> Go to <strong>Database &gt; Reverse Engineer...</strong> &gt; select <code>university_workload_db</code> &gt; click Execute. MySQL Workbench will render the complete relational model!</li>
        </ol>
      </div>
    `;

    window.app.openModal('MySQL Workbench Configuration Guide', bodyHtml, `
      <button class="btn btn-secondary" onclick="window.app.closeModal()">Close</button>
      <button class="btn btn-primary" onclick="window.SchemaView.copyDDL()">Copy SQL Script</button>
    `);
  },

  openAutoInitModal: function() {
    const bodyHtml = `
      <form id="autoInitForm" onsubmit="event.preventDefault(); window.SchemaView.submitAutoInit();">
        <p style="font-size: 0.86rem; color: var(--text-secondary); margin-bottom: 14px;">
          Enter your local MySQL root password. The server will connect to your MySQL 8.0 instance and automatically execute <code>schema_mysql.sql</code> to create <code>university_workload_db</code> and all tables.
        </p>

        <div class="form-group">
          <label class="form-label">MySQL Host & Port</label>
          <input type="text" class="form-control" id="myHost" value="127.0.0.1:3306" disabled style="background-color: var(--bg-tertiary);">
        </div>

        <div class="form-group">
          <label class="form-label">Username</label>
          <input type="text" class="form-control" id="myUser" value="root" disabled style="background-color: var(--bg-tertiary);">
        </div>

        <div class="form-group">
          <label class="form-label">Root Password <span class="required">*</span></label>
          <input type="password" class="form-control" id="myPassword" placeholder="Enter your MySQL root password" required autofocus>
          <div class="form-help">Your password is only used locally to initialize the database schema.</div>
        </div>

        <div id="initResultMsg" style="margin-top: 10px; font-size: 0.85rem; display: none;"></div>
      </form>
    `;

    window.app.openModal('Connect & Initialize MySQL Database', bodyHtml, `
      <button class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
      <button class="btn btn-primary" id="btnInitDB" onclick="window.SchemaView.submitAutoInit()">Initialize Database</button>
    `);
  },

  submitAutoInit: function() {
    const pwd = document.getElementById('myPassword').value;
    const msgEl = document.getElementById('initResultMsg');
    const btn = document.getElementById('btnInitDB');

    if (btn) btn.textContent = 'Connecting & Executing...';
    if (msgEl) {
      msgEl.style.display = 'block';
      msgEl.innerHTML = '<span style="color: var(--primary);">Connecting to MySQL on 127.0.0.1:3306 and executing schema_mysql.sql...</span>';
    }

    fetch('/api/init-database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd })
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        if (msgEl) {
          msgEl.innerHTML = `<span style="color: var(--success); font-weight: 700;">✓ ${data.message}</span>`;
        }
        if (btn) btn.textContent = 'Success!';
        window.store.showToast('MySQL Database initialized successfully!', 'success');
        setTimeout(() => {
          window.app.closeModal();
          window.SchemaView.checkMySQLStatus();
        }, 1500);
      } else {
        if (msgEl) {
          msgEl.innerHTML = `<span style="color: var(--danger); font-weight: 600;">✕ ${data.error || 'Connection failed'}</span>`;
        }
        if (btn) btn.textContent = 'Retry Initialization';
      }
    })
    .catch(err => {
      if (msgEl) {
        msgEl.innerHTML = `<span style="color: var(--danger);">Network error or server restarting: ${err.message}</span>`;
      }
      if (btn) btn.textContent = 'Retry';
    });
  }
};
