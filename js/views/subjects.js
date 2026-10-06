/**
 * Subject Curriculum Management View Component
 */

window.SubjectsView = {
  filterDept: 'ALL',
  searchQuery: '',

  render: function(container) {
    const subjects = window.db.getSubjectList();
    const depts = window.db.data.departments;

    const filtered = subjects.filter(s => {
      const matchDept = this.filterDept === 'ALL' || s.departmentId === this.filterDept;
      const matchSearch = !this.searchQuery ||
        s.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        s.shortName.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchDept && matchSearch;
    });

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Curriculum & Subject Management</h1>
          <p>Define courses, contact hours breakdown (L-T-P), credit allocation, and assigned faculty.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-primary" onclick="window.SubjectsView.openAddModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            Add New Subject
          </button>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="table-toolbar">
        <div class="toolbar-filters">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search subject title, code, or abbreviation..." 
            value="${this.searchQuery}" 
            oninput="window.SubjectsView.setSearch(this.value)"
            style="width: 300px;"
          />

          <select class="form-select" onchange="window.SubjectsView.setDeptFilter(this.value)">
            <option value="ALL" ${this.filterDept === 'ALL' ? 'selected' : ''}>All Departments</option>
            ${depts.map(d => `<option value="${d.id}" ${this.filterDept === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
          </select>
        </div>

        <div style="font-size: 0.85rem; color: var(--text-muted);">
          Showing <strong>${filtered.length}</strong> of ${subjects.length} subjects
        </div>
      </div>

      <!-- Subjects Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Subject Title</th>
              <th>Department</th>
              <th>Sem</th>
              <th>Credits</th>
              <th>L - T - P Breakdown</th>
              <th>Total Weekly Hours</th>
              <th>Assigned Faculty</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `
              <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">
                  No subject records found.
                </td>
              </tr>
            ` : filtered.map(s => {
              return `
                <tr>
                  <td>
                    <span style="font-weight: 700; font-family: monospace; color: var(--primary);">${s.code}</span>
                  </td>
                  <td>
                    <div style="font-weight: 700; color: var(--text-primary);">${s.name}</div>
                    <div style="font-size: 0.74rem; color: var(--text-muted);">Abbr: <strong>${s.shortName}</strong> &bull; Type: ${s.type}</div>
                  </td>
                  <td>
                    <span class="badge badge-secondary" style="font-weight: 600;">${s.departmentCode}</span>
                  </td>
                  <td>
                    <span style="font-weight: 600;">Sem ${s.semester}</span>
                  </td>
                  <td>
                    <span class="badge badge-info">${s.credits} Credits</span>
                  </td>
                  <td>
                    <span style="font-family: monospace; font-size: 0.85rem; font-weight: 600;">
                      ${s.lectureHours}L - ${s.tutorialHours}T - ${s.practicalHours}P
                    </span>
                  </td>
                  <td>
                    <span style="font-weight: 700; color: var(--text-primary);">${s.totalHours} hrs/wk</span>
                  </td>
                  <td>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                      ${s.assignedFaculty.length > 0 ? s.assignedFaculty.map(f => `
                        <div style="display: flex; align-items: center; gap: 6px;">
                          <img src="${f.avatar}" style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover;">
                          <span style="font-size: 0.82rem; font-weight: 500;">${f.name}</span>
                        </div>
                      `).join('') : '<span style="color: var(--text-muted); font-size: 0.78rem;">Unassigned</span>'}
                    </div>
                  </td>
                  <td style="text-align: right;">
                    <div style="display: inline-flex; align-items: center; gap: 6px;">
                      <button class="btn btn-outline btn-sm" onclick="window.SubjectsView.openEditModal('${s.code}')" title="Edit Subject">
                        Edit
                      </button>
                      <button class="btn btn-outline btn-sm" onclick="window.SubjectsView.deleteSubject('${s.code}')" style="color: var(--danger);" title="Delete Subject">
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

  openAddModal: function() {
    const depts = window.db.data.departments;

    const bodyHtml = `
      <form id="addSubjectForm" onsubmit="event.preventDefault(); window.SubjectsView.saveNewSubject();">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Subject Code <span class="required">*</span></label>
            <input type="text" class="form-control" id="subCode" placeholder="e.g. SUB-CS306" required>
          </div>
          <div class="form-group">
            <label class="form-label">Short Name / Acronym <span class="required">*</span></label>
            <input type="text" class="form-control" id="subShort" placeholder="e.g. AI-ETHICS" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Subject Title <span class="required">*</span></label>
          <input type="text" class="form-control" id="subName" placeholder="e.g. AI Ethics and Responsible Computing" required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Department <span class="required">*</span></label>
            <select class="form-control" id="subDept" required>
              ${depts.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Semester</label>
            <select class="form-control" id="subSem">
              ${[1, 2, 3, 4, 5, 6, 7, 8].map(sem => `<option value="${sem}">Semester ${sem}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Credits</label>
            <input type="number" class="form-control" id="subCredits" value="4" min="1" max="6" required>
          </div>
          <div class="form-group">
            <label class="form-label">Course Type</label>
            <select class="form-control" id="subType">
              <option value="Theory">Theory</option>
              <option value="Practical Lab">Practical Lab</option>
              <option value="Integrated" selected>Integrated (Theory + Lab)</option>
            </select>
          </div>
        </div>

        <div class="form-row" style="grid-template-columns: repeat(3, 1fr);">
          <div class="form-group">
            <label class="form-label">Lecture (L) Hrs/Wk</label>
            <input type="number" class="form-control" id="subL" value="3" min="0" max="6">
          </div>
          <div class="form-group">
            <label class="form-label">Tutorial (T) Hrs/Wk</label>
            <input type="number" class="form-control" id="subT" value="0" min="0" max="3">
          </div>
          <div class="form-group">
            <label class="form-label">Practical (P) Hrs/Wk</label>
            <input type="number" class="form-control" id="subP" value="2" min="0" max="6">
          </div>
        </div>
      </form>
    `;

    window.app.openModal('Add New Subject', bodyHtml, `
      <button class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="window.SubjectsView.saveNewSubject()">Save Subject</button>
    `);
  },

  saveNewSubject: function() {
    const code = document.getElementById('subCode').value.trim();
    const shortName = document.getElementById('subShort').value.trim();
    const name = document.getElementById('subName').value.trim();
    const departmentId = document.getElementById('subDept').value;
    const semester = parseInt(document.getElementById('subSem').value, 10);
    const credits = parseInt(document.getElementById('subCredits').value, 10);
    const type = document.getElementById('subType').value;
    const lectureHours = parseInt(document.getElementById('subL').value, 10) || 0;
    const tutorialHours = parseInt(document.getElementById('subT').value, 10) || 0;
    const practicalHours = parseInt(document.getElementById('subP').value, 10) || 0;

    if (!code || !name || !shortName) {
      window.store.showToast('Please fill in required fields.', 'warning');
      return;
    }

    window.db.saveSubject({
      code,
      name,
      shortName,
      departmentId,
      semester,
      credits,
      type,
      lectureHours,
      tutorialHours,
      practicalHours,
      color: '#2563eb'
    });

    window.app.closeModal();
    window.store.showToast(`Subject ${code} created successfully!`, 'success');
    this.render(document.getElementById('view-content'));
  },

  openEditModal: function(code) {
    const s = window.db.getSubjectList().find(sub => sub.code === code);
    if (!s) return;
    const depts = window.db.data.departments;

    const bodyHtml = `
      <form id="editSubjectForm" onsubmit="event.preventDefault(); window.SubjectsView.updateSubject('${s.code}');">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Subject Code</label>
            <input type="text" class="form-control" value="${s.code}" disabled style="background-color: var(--bg-tertiary);">
          </div>
          <div class="form-group">
            <label class="form-label">Short Name / Acronym <span class="required">*</span></label>
            <input type="text" class="form-control" id="editSubShort" value="${s.shortName}" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Subject Title <span class="required">*</span></label>
          <input type="text" class="form-control" id="editSubName" value="${s.name}" required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Department</label>
            <select class="form-control" id="editSubDept">
              ${depts.map(d => `<option value="${d.id}" ${s.departmentId === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Semester</label>
            <select class="form-control" id="editSubSem">
              ${[1, 2, 3, 4, 5, 6, 7, 8].map(sem => `<option value="${sem}" ${s.semester === sem ? 'selected' : ''}>Semester ${sem}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-row" style="grid-template-columns: repeat(3, 1fr);">
          <div class="form-group">
            <label class="form-label">Lecture (L)</label>
            <input type="number" class="form-control" id="editSubL" value="${s.lectureHours}">
          </div>
          <div class="form-group">
            <label class="form-label">Tutorial (T)</label>
            <input type="number" class="form-control" id="editSubT" value="${s.tutorialHours}">
          </div>
          <div class="form-group">
            <label class="form-label">Practical (P)</label>
            <input type="number" class="form-control" id="editSubP" value="${s.practicalHours}">
          </div>
        </div>
      </form>
    `;

    window.app.openModal('Edit Subject: ' + s.code, bodyHtml, `
      <button class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="window.SubjectsView.updateSubject('${s.code}')">Save Changes</button>
    `);
  },

  updateSubject: function(code) {
    const name = document.getElementById('editSubName').value.trim();
    const shortName = document.getElementById('editSubShort').value.trim();
    const departmentId = document.getElementById('editSubDept').value;
    const semester = parseInt(document.getElementById('editSubSem').value, 10);
    const lectureHours = parseInt(document.getElementById('editSubL').value, 10) || 0;
    const tutorialHours = parseInt(document.getElementById('editSubT').value, 10) || 0;
    const practicalHours = parseInt(document.getElementById('editSubP').value, 10) || 0;

    window.db.saveSubject({
      code,
      name,
      shortName,
      departmentId,
      semester,
      lectureHours,
      tutorialHours,
      practicalHours
    });

    window.app.closeModal();
    window.store.showToast('Subject updated successfully.', 'success');
    this.render(document.getElementById('view-content'));
  },

  deleteSubject: function(code) {
    if (confirm(`Are you sure you want to delete subject ${code}? This will remove it from all faculty assignments and scheduled timetable classes.`)) {
      window.db.deleteSubject(code);
      window.store.showToast(`Subject ${code} deleted.`, 'danger');
      this.render(document.getElementById('view-content'));
    }
  }
};
