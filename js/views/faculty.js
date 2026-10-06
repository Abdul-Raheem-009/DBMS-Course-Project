/**
 * Faculty Management View Component
 */

window.FacultyView = {
  filterDept: 'ALL',
  filterWorkload: 'ALL',
  searchQuery: '',

  render: function(container) {
    const facultyList = window.db.getFacultyList();
    const depts = window.db.data.departments;

    // Filter logic
    const filtered = facultyList.filter(f => {
      const matchDept = this.filterDept === 'ALL' || f.departmentId === this.filterDept;
      const matchWorkload = this.filterWorkload === 'ALL' || f.workloadStatus === this.filterWorkload;
      const matchSearch = !this.searchQuery || 
        f.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        f.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        f.designation.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        f.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchDept && matchWorkload && matchSearch;
    });

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Faculty Management</h1>
          <p>Manage university faculty profiles, teaching appointments, designations, and workload ceilings.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-outline" onclick="window.FacultyView.exportCSV()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export Faculty List
          </button>
          <button class="btn btn-primary" onclick="window.FacultyView.openAddModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            Add New Faculty
          </button>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="table-toolbar">
        <div class="toolbar-filters">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search faculty name, ID, or email..." 
            value="${this.searchQuery}" 
            oninput="window.FacultyView.setSearch(this.value)"
            style="width: 280px;"
          />

          <select class="form-select" onchange="window.FacultyView.setDeptFilter(this.value)">
            <option value="ALL" ${this.filterDept === 'ALL' ? 'selected' : ''}>All Departments</option>
            ${depts.map(d => `<option value="${d.id}" ${this.filterDept === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
          </select>

          <select class="form-select" onchange="window.FacultyView.setWorkloadFilter(this.value)">
            <option value="ALL" ${this.filterWorkload === 'ALL' ? 'selected' : ''}>All Workload Statuses</option>
            <option value="Optimal" ${this.filterWorkload === 'Optimal' ? 'selected' : ''}>Optimal (11 - 16 hrs)</option>
            <option value="Overloaded" ${this.filterWorkload === 'Overloaded' ? 'selected' : ''}>Overloaded (> 16 hrs)</option>
            <option value="Underloaded" ${this.filterWorkload === 'Underloaded' ? 'selected' : ''}>Underloaded (< 11 hrs)</option>
          </select>
        </div>

        <div style="font-size: 0.85rem; color: var(--text-muted);">
          Showing <strong>${filtered.length}</strong> of ${facultyList.length} faculty
        </div>
      </div>

      <!-- Faculty Directory Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Faculty ID</th>
              <th>Faculty Name & Info</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Subjects Assigned</th>
              <th>Weekly Workload</th>
              <th>Max Hours</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `
              <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">
                  No faculty records found matching your filters.
                </td>
              </tr>
            ` : filtered.map(f => {
              const workloadPct = Math.min(100, Math.round((f.scheduledHours / f.maxHours) * 100));
              const progressClass = f.workloadStatus === 'Overloaded' ? 'overloaded' : f.workloadStatus === 'Underloaded' ? 'underloaded' : 'optimal';
              const badgeClass = f.workloadStatus === 'Overloaded' ? 'badge-overloaded' : f.workloadStatus === 'Underloaded' ? 'badge-underloaded' : 'badge-optimal';

              return `
                <tr>
                  <td>
                    <span style="font-weight: 700; font-family: monospace; color: var(--primary);">${f.id}</span>
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <img src="${f.avatar}" alt="${f.name}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);">
                      <div>
                        <div style="font-weight: 700; color: var(--text-primary); cursor: pointer;" onclick="window.FacultyView.viewProfile('${f.id}')">
                          ${f.name}
                        </div>
                        <div style="font-size: 0.76rem; color: var(--text-muted);">${f.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-secondary" style="font-weight: 600;">${f.departmentCode}</span>
                  </td>
                  <td>
                    <span style="font-weight: 500;">${f.designation}</span>
                  </td>
                  <td>
                    <div class="subject-tag-list">
                      ${f.assignedSubjectDetails.length > 0 ? f.assignedSubjectDetails.map(s => `
                        <span class="subject-chip" title="${s.name}">${s.shortName}</span>
                      `).join('') : '<span style="color: var(--text-muted); font-size: 0.78rem;">None</span>'}
                    </div>
                  </td>
                  <td style="min-width: 140px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                      <span style="font-weight: 700; font-size: 0.85rem;">${f.scheduledHours} hrs</span>
                      <span class="badge ${badgeClass}" style="font-size: 0.65rem; padding: 1px 6px;">${f.workloadStatus}</span>
                    </div>
                    <div class="progress-bar-container">
                      <div class="progress-fill ${progressClass}" style="width: ${workloadPct}%;"></div>
                    </div>
                  </td>
                  <td>
                    <span style="font-weight: 600; color: var(--text-secondary);">${f.maxHours} hrs</span>
                  </td>
                  <td>
                    <span class="badge ${f.status === 'Active' ? 'badge-optimal' : 'badge-underloaded'}">
                      ${f.status}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <div style="display: inline-flex; align-items: center; gap: 6px;">
                      <button class="btn btn-outline btn-sm" onclick="window.FacultyView.openAssignModal('${f.id}')" title="Assign Subjects">
                        Assign
                      </button>
                      <button class="btn btn-outline btn-sm" onclick="window.FacultyView.openEditModal('${f.id}')" title="Edit Faculty">
                        Edit
                      </button>
                      <button class="btn btn-outline btn-sm" onclick="window.FacultyView.deleteFaculty('${f.id}')" style="color: var(--danger);" title="Delete Faculty">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  setSearch: function(val) {
    this.searchQuery = val;
    this.render(document.getElementById('view-content'));
  },

  setDeptFilter: function(val) {
    this.filterDept = val;
    this.render(document.getElementById('view-content'));
  },

  setWorkloadFilter: function(val) {
    this.filterWorkload = val;
    this.render(document.getElementById('view-content'));
  },

  viewProfile: function(id) {
    const f = window.db.getFacultyById(id);
    if (!f) return;

    const slots = window.db.data.timetable.filter(t => t.facultyId === id);

    const bodyHtml = `
      <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
        <img src="${f.avatar}" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-border);">
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">${f.name}</h3>
          <p style="color: var(--text-secondary); font-size: 0.88rem;">${f.designation} &bull; ${f.departmentName}</p>
          <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 4px;">${f.email} &bull; ${f.phone || 'N/A'}</p>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom: 16px;">
        <div style="background-color: var(--bg-tertiary); padding: 12px; border-radius: var(--radius-md);">
          <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Teaching Workload</div>
          <div style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary);">${f.scheduledHours} / ${f.maxHours} hrs/week</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Status: ${f.workloadStatus}</div>
        </div>
        <div style="background-color: var(--bg-tertiary); padding: 12px; border-radius: var(--radius-md);">
          <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Specialization</div>
          <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-top: 4px;">${f.specialization || 'Not specified'}</div>
        </div>
      </div>

      <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 10px; color: var(--text-primary);">Weekly Teaching Schedule (${slots.length} Sessions)</h4>
      <div class="table-container" style="max-height: 220px; overflow-y: auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Subject</th>
              <th>Room</th>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            ${slots.length === 0 ? `<tr><td colspan="5" style="text-align: center;">No scheduled classes yet.</td></tr>` : slots.map(s => {
              const sub = window.db.data.subjects.find(sub => sub.code === s.subjectCode) || { shortName: s.subjectCode };
              return `
                <tr>
                  <td><strong>${s.day}</strong></td>
                  <td>${s.timeSlot}</td>
                  <td>${sub.shortName}</td>
                  <td><span class="badge badge-secondary">${s.roomNo}</span></td>
                  <td>${s.sectionId}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    window.app.openModal('Faculty Profile: ' + f.name, bodyHtml, `
      <button class="btn btn-secondary" onclick="window.app.closeModal()">Close</button>
      <button class="btn btn-primary" onclick="window.FacultyView.openAssignModal('${f.id}')">Manage Subjects</button>
    `);
  },

  openAddModal: function() {
    const depts = window.db.data.departments;

    const bodyHtml = `
      <form id="addFacultyForm" onsubmit="event.preventDefault(); window.FacultyView.saveNewFaculty();">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Full Name <span class="required">*</span></label>
            <input type="text" class="form-control" id="facName" placeholder="e.g. Dr. Ramesh Gupta" required>
          </div>
          <div class="form-group">
            <label class="form-label">Faculty ID <span class="required">*</span></label>
            <input type="text" class="form-control" id="facId" placeholder="e.g. FAC-108" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Department <span class="required">*</span></label>
            <select class="form-control" id="facDept" required>
              ${depts.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Designation <span class="required">*</span></label>
            <select class="form-control" id="facDesignation" required>
              <option value="Professor">Professor</option>
              <option value="Associate Professor" selected>Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Adjunct Faculty">Adjunct Faculty</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Email Address <span class="required">*</span></label>
            <input type="email" class="form-control" id="facEmail" placeholder="ramesh.gupta@apex.edu" required>
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="text" class="form-control" id="facPhone" placeholder="+91 98765 43210">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Maximum Teaching Hours/Week <span class="required">*</span></label>
            <input type="number" class="form-control" id="facMaxHours" value="16" min="6" max="24" required>
            <div class="form-help">University norm is 14 to 18 hours/week.</div>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-control" id="facStatus">
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Specialization / Research Area</label>
          <input type="text" class="form-control" id="facSpecialization" placeholder="e.g. Distributed Databases & High Performance Computing">
        </div>
      </form>
    `;

    window.app.openModal('Add New Faculty Member', bodyHtml, `
      <button class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="window.FacultyView.saveNewFaculty()">Save Faculty</button>
    `);
  },

  saveNewFaculty: function() {
    const name = document.getElementById('facName').value.trim();
    const id = document.getElementById('facId').value.trim();
    const dept = document.getElementById('facDept').value;
    const designation = document.getElementById('facDesignation').value;
    const email = document.getElementById('facEmail').value.trim();
    const phone = document.getElementById('facPhone').value.trim();
    const maxHours = parseInt(document.getElementById('facMaxHours').value, 10) || 16;
    const status = document.getElementById('facStatus').value;
    const specialization = document.getElementById('facSpecialization').value.trim();

    if (!name || !id || !email) {
      window.store.showToast('Please fill in all required fields.', 'warning');
      return;
    }

    window.db.saveFaculty({
      id,
      name,
      departmentId: dept,
      designation,
      email,
      phone,
      maxHours,
      status,
      specialization,
      assignedSubjects: []
    });

    window.app.closeModal();
    window.store.showToast(`Faculty member ${name} added successfully!`, 'success');
    this.render(document.getElementById('view-content'));
  },

  openEditModal: function(id) {
    const f = window.db.getFacultyById(id);
    if (!f) return;
    const depts = window.db.data.departments;

    const bodyHtml = `
      <form id="editFacultyForm" onsubmit="event.preventDefault(); window.FacultyView.updateFaculty('${f.id}');">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Full Name <span class="required">*</span></label>
            <input type="text" class="form-control" id="editFacName" value="${f.name}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Faculty ID</label>
            <input type="text" class="form-control" value="${f.id}" disabled style="background-color: var(--bg-tertiary);">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Department</label>
            <select class="form-control" id="editFacDept">
              ${depts.map(d => `<option value="${d.id}" ${f.departmentId === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Designation</label>
            <select class="form-control" id="editFacDesignation">
              <option value="Professor" ${f.designation.includes('Professor') && !f.designation.includes('Associate') && !f.designation.includes('Assistant') ? 'selected' : ''}>Professor</option>
              <option value="Associate Professor" ${f.designation.includes('Associate') ? 'selected' : ''}>Associate Professor</option>
              <option value="Assistant Professor" ${f.designation.includes('Assistant') ? 'selected' : ''}>Assistant Professor</option>
              <option value="Adjunct Faculty" ${f.designation.includes('Adjunct') ? 'selected' : ''}>Adjunct Faculty</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Email Address <span class="required">*</span></label>
            <input type="email" class="form-control" id="editFacEmail" value="${f.email}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Max Hours/Week</label>
            <input type="number" class="form-control" id="editFacMaxHours" value="${f.maxHours}" min="6" max="24" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-control" id="editFacStatus">
            <option value="Active" ${f.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="On Leave" ${f.status === 'On Leave' ? 'selected' : ''}>On Leave</option>
          </select>
        </div>
      </form>
    `;

    window.app.openModal('Edit Faculty: ' + f.name, bodyHtml, `
      <button class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="window.FacultyView.updateFaculty('${f.id}')">Update Changes</button>
    `);
  },

  updateFaculty: function(id) {
    const name = document.getElementById('editFacName').value.trim();
    const dept = document.getElementById('editFacDept').value;
    const designation = document.getElementById('editFacDesignation').value;
    const email = document.getElementById('editFacEmail').value.trim();
    const maxHours = parseInt(document.getElementById('editFacMaxHours').value, 10);
    const status = document.getElementById('editFacStatus').value;

    window.db.saveFaculty({
      id,
      name,
      departmentId: dept,
      designation,
      email,
      maxHours,
      status
    });

    window.app.closeModal();
    window.store.showToast(`Faculty profile updated.`, 'success');
    this.render(document.getElementById('view-content'));
  },

  openAssignModal: function(id) {
    const f = window.db.getFacultyById(id);
    if (!f) return;

    const allSubjects = window.db.getSubjectList();

    const bodyHtml = `
      <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 16px;">
        Assign or unassign subjects for <strong>${f.name}</strong> (${f.departmentName}).
      </p>

      <div style="display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto;">
        ${allSubjects.map(sub => {
          const isAssigned = (f.assignedSubjects || []).includes(sub.code);
          return `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background-color: var(--bg-tertiary); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>
                <div style="font-weight: 700; color: var(--text-primary); font-size: 0.88rem;">${sub.name} (${sub.shortName})</div>
                <div style="font-size: 0.74rem; color: var(--text-muted);">${sub.code} &bull; ${sub.credits} Credits &bull; ${sub.totalHours} hrs/wk &bull; ${sub.departmentCode}</div>
              </div>
              <button 
                class="btn btn-sm ${isAssigned ? 'btn-danger' : 'btn-primary'}" 
                onclick="window.FacultyView.toggleSubject('${f.id}', '${sub.code}')"
              >
                ${isAssigned ? 'Unassign' : 'Assign'}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    window.app.openModal('Assign Subjects: ' + f.name, bodyHtml, `
      <button class="btn btn-secondary" onclick="window.app.closeModal()">Done</button>
    `);
  },

  toggleSubject: function(facultyId, subjectCode) {
    window.db.toggleFacultySubject(facultyId, subjectCode);
    this.openAssignModal(facultyId); // re-render modal content
    this.render(document.getElementById('view-content'));
    window.store.showToast('Subject assignment updated.', 'info');
  },

  deleteFaculty: function(id) {
    const f = window.db.getFacultyById(id);
    if (!f) return;

    if (confirm(`Are you sure you want to delete ${f.name}? All timetable sessions associated with this faculty will also be unassigned.`)) {
      window.db.deleteFaculty(id);
      window.store.showToast(`${f.name} deleted from records.`, 'danger');
      this.render(document.getElementById('view-content'));
    }
  },

  exportCSV: function() {
    const facultyList = window.db.getFacultyList();
    let csv = 'Faculty ID,Name,Department,Designation,Email,Weekly Workload,Max Workload,Status\n';
    facultyList.forEach(f => {
      csv += `"${f.id}","${f.name}","${f.departmentName}","${f.designation}","${f.email}","${f.scheduledHours} hrs","${f.maxHours} hrs","${f.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Faculty_Workload_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.store.showToast('Faculty CSV exported successfully!', 'success');
  }
};
