/**
 * Comprehensive Academic Reports View Component
 */

window.ReportsView = {
  reportType: 'faculty', // 'faculty' | 'department' | 'timetable' | 'rooms'
  filterDept: 'ALL',

  render: function(container) {
    const depts = window.db.data.departments;

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Curricular & Operational Reports</h1>
          <p>Generate auditable compliance documents, timetable matrices, room occupancy indices, and faculty workload digests.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-outline" onclick="window.print()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Print / PDF Document
          </button>
          <button class="btn btn-primary" onclick="window.ReportsView.exportCurrentCSV()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export CSV / Excel
          </button>
        </div>
      </div>

      <!-- Report Type Selector & Filters -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="timetable-controls" style="margin-bottom: 0;">
          <div class="timetable-filter-group">
            <div class="view-mode-tabs">
              <button class="tab-btn ${this.reportType === 'faculty' ? 'active' : ''}" onclick="window.ReportsView.setReportType('faculty')">Faculty Workload</button>
              <button class="tab-btn ${this.reportType === 'department' ? 'active' : ''}" onclick="window.ReportsView.setReportType('department')">Department Summary</button>
              <button class="tab-btn ${this.reportType === 'timetable' ? 'active' : ''}" onclick="window.ReportsView.setReportType('timetable')">Master Schedule</button>
              <button class="tab-btn ${this.reportType === 'rooms' ? 'active' : ''}" onclick="window.ReportsView.setReportType('rooms')">Room Utilization</button>
            </div>

            <select class="form-select" onchange="window.ReportsView.setDeptFilter(this.value)">
              <option value="ALL" ${this.filterDept === 'ALL' ? 'selected' : ''}>All Departments</option>
              ${depts.map(d => `<option value="${d.id}" ${this.filterDept === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
            </select>
          </div>

          <div style="font-size: 0.85rem; color: var(--text-muted);">
            Academic Term: <strong>Fall 2026 (Odd Semester)</strong>
          </div>
        </div>
      </div>

      <!-- Generated Report Table Preview -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              ${this.getReportTitle()}
            </div>
            <div class="card-subtitle">Generated timestamp: ${new Date().toLocaleDateString()} &bull; Official Institutional Record</div>
          </div>
        </div>

        <div class="table-container">
          ${this.renderReportContent()}
        </div>
      </div>
    `;
  },

  getReportTitle: function() {
    switch (this.reportType) {
      case 'faculty': return 'Faculty Workload Audit & Utilization Report';
      case 'department': return 'Departmental Academic Load Distribution Report';
      case 'timetable': return 'Master Institutional Timetable Schedule Digest';
      case 'rooms': return 'Campus Room Occupancy & Facility Utilization Report';
      default: return 'Institutional Report';
    }
  },

  setReportType: function(type) {
    this.reportType = type;
    this.render(document.getElementById('view-content'));
  },

  setDeptFilter: function(dept) {
    this.filterDept = dept;
    this.render(document.getElementById('view-content'));
  },

  renderReportContent: function() {
    if (this.reportType === 'faculty') {
      let facultyList = window.db.getFacultyList();
      if (this.filterDept !== 'ALL') {
        facultyList = facultyList.filter(f => f.departmentId === this.filterDept);
      }

      return `
        <table class="data-table">
          <thead>
            <tr>
              <th>Faculty ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Courses Taught</th>
              <th>Scheduled Contact Hours</th>
              <th>Max Capacity</th>
              <th>Utilization %</th>
              <th>Compliance Status</th>
            </tr>
          </thead>
          <tbody>
            ${facultyList.map(f => {
              const util = Math.round((f.scheduledHours / f.maxHours) * 100);
              const badgeClass = f.workloadStatus === 'Overloaded' ? 'badge-overloaded' : f.workloadStatus === 'Underloaded' ? 'badge-underloaded' : 'badge-optimal';
              return `
                <tr>
                  <td><strong>${f.id}</strong></td>
                  <td>${f.name}</td>
                  <td>${f.departmentCode}</td>
                  <td>${f.designation}</td>
                  <td>${f.assignedSubjectDetails.map(s => s.shortName).join(', ') || 'None'}</td>
                  <td><strong>${f.scheduledHours} hrs/wk</strong></td>
                  <td>${f.maxHours} hrs</td>
                  <td>${util}%</td>
                  <td><span class="badge ${badgeClass}">${f.workloadStatus}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    } else if (this.reportType === 'department') {
      const depts = window.db.data.departments;
      const facultyList = window.db.getFacultyList();
      const subjects = window.db.data.subjects;

      return `
        <table class="data-table">
          <thead>
            <tr>
              <th>Dept Code</th>
              <th>Department Name</th>
              <th>Head of Department</th>
              <th>Total Faculty</th>
              <th>Total Courses</th>
              <th>Total Contact Hours</th>
              <th>Avg Workload / Faculty</th>
            </tr>
          </thead>
          <tbody>
            ${depts.map(d => {
              const facs = facultyList.filter(f => f.departmentId === d.id);
              const subs = subjects.filter(s => s.departmentId === d.id);
              const totalHours = facs.reduce((a, b) => a + b.scheduledHours, 0);
              const avg = facs.length > 0 ? (totalHours / facs.length).toFixed(1) : 0;
              return `
                <tr>
                  <td><strong>${d.code}</strong></td>
                  <td>${d.name}</td>
                  <td>${d.hod}</td>
                  <td>${facs.length}</td>
                  <td>${subs.length}</td>
                  <td><strong>${totalHours} hrs/wk</strong></td>
                  <td>${avg} hrs/wk</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    } else if (this.reportType === 'timetable') {
      let timetable = window.db.data.timetable;
      const facultyList = window.db.getFacultyList();
      const subjects = window.db.data.subjects;

      return `
        <table class="data-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Time Slot</th>
              <th>Subject</th>
              <th>Faculty Instructor</th>
              <th>Room</th>
              <th>Cohort Section</th>
              <th>Format</th>
            </tr>
          </thead>
          <tbody>
            ${timetable.map(t => {
              const sub = subjects.find(s => s.code === t.subjectCode) || { shortName: t.subjectCode };
              const fac = facultyList.find(f => f.id === t.facultyId) || { name: 'Unknown' };
              return `
                <tr>
                  <td><strong>${t.day}</strong></td>
                  <td>${t.timeSlot}</td>
                  <td>${sub.shortName}</td>
                  <td>${fac.name}</td>
                  <td><span class="badge badge-secondary">${t.roomNo}</span></td>
                  <td>${t.sectionId}</td>
                  <td>${t.type || 'Lecture'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    } else if (this.reportType === 'rooms') {
      const rooms = window.db.getRoomList();

      return `
        <table class="data-table">
          <thead>
            <tr>
              <th>Room No</th>
              <th>Building & Location</th>
              <th>Capacity</th>
              <th>Room Type</th>
              <th>AV Equipment</th>
              <th>Current Occupancy</th>
              <th>Utilization Rate</th>
            </tr>
          </thead>
          <tbody>
            ${rooms.map(r => {
              return `
                <tr>
                  <td><strong>${r.roomNo}</strong></td>
                  <td>${r.building} (Floor ${r.floor})</td>
                  <td>${r.capacity} seats</td>
                  <td>${r.type}</td>
                  <td>${r.hasSmartBoard ? 'Smart Board + Projector' : 'Projector'}</td>
                  <td><span class="badge ${r.isAvailable ? 'badge-optimal' : 'badge-overloaded'}">${r.isAvailable ? 'Free' : 'Occupied'}</span></td>
                  <td><strong>${r.utilization}%</strong></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }
  },

  exportCurrentCSV: function() {
    let csv = '';
    const dateStr = new Date().toISOString().slice(0, 10);

    if (this.reportType === 'faculty') {
      const list = window.db.getFacultyList();
      csv = 'Faculty ID,Name,Department,Designation,Scheduled Hours,Max Capacity,Utilization,Status\n';
      list.forEach(f => {
        csv += `"${f.id}","${f.name}","${f.departmentCode}","${f.designation}",${f.scheduledHours},${f.maxHours},"${Math.round(f.scheduledHours/f.maxHours*100)}%","${f.workloadStatus}"\n`;
      });
    } else if (this.reportType === 'rooms') {
      const rooms = window.db.getRoomList();
      csv = 'Room No,Building,Floor,Capacity,Type,Current Status,Utilization\n';
      rooms.forEach(r => {
        csv += `"${r.roomNo}","${r.building}",${r.floor},${r.capacity},"${r.type}","${r.isAvailable ? 'Available' : 'Occupied'}","${r.utilization}%"\n`;
      });
    } else {
      const tt = window.db.data.timetable;
      csv = 'Day,Time Slot,Subject Code,Faculty ID,Room No,Section\n';
      tt.forEach(t => {
        csv += `"${t.day}","${t.timeSlot}","${t.subjectCode}","${t.facultyId}","${t.roomNo}","${t.sectionId}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Academic_Report_${this.reportType}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.store.showToast('Report CSV downloaded successfully.', 'success');
  }
};
