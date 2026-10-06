/**
 * Faculty Workload Management View Component
 */

window.WorkloadView = {
  selectedStatus: 'ALL',
  selectedDept: 'ALL',

  render: function(container) {
    const facultyList = window.db.getFacultyList();
    const depts = window.db.data.departments;

    const overloaded = facultyList.filter(f => f.workloadStatus === 'Overloaded');
    const optimal = facultyList.filter(f => f.workloadStatus === 'Optimal');
    const underloaded = facultyList.filter(f => f.workloadStatus === 'Underloaded');

    const filtered = facultyList.filter(f => {
      const matchDept = this.selectedDept === 'ALL' || f.departmentId === this.selectedDept;
      const matchStatus = this.selectedStatus === 'ALL' || f.workloadStatus === this.selectedStatus;
      return matchDept && matchStatus;
    });

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Workload Management & Allocation</h1>
          <p>Monitor faculty teaching hours, balance curricular contact distribution, and resolve over-utilization.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-outline" onclick="window.WorkloadView.rebalanceWorkloadAuto()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            Auto Balance Recommendations
          </button>
        </div>
      </div>

      <!-- Workload KPI Summary Status -->
      <div class="grid-3" style="margin-bottom: 24px;">
        <div class="card" style="border-left: 4px solid var(--danger);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--danger); text-transform: uppercase;">Overloaded Faculty</div>
              <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-top: 2px;">${overloaded.length}</div>
              <div style="font-size: 0.76rem; color: var(--text-muted);">>16 scheduled hrs/wk</div>
            </div>
            <div class="stat-icon rose">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
          </div>
        </div>

        <div class="card" style="border-left: 4px solid var(--success);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--success); text-transform: uppercase;">Optimal Workload</div>
              <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-top: 2px;">${optimal.length}</div>
              <div style="font-size: 0.76rem; color: var(--text-muted);">Within 11 - 16 hrs/wk standard</div>
            </div>
            <div class="stat-icon emerald">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
          </div>
        </div>

        <div class="card" style="border-left: 4px solid var(--warning);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--warning); text-transform: uppercase;">Underloaded Faculty</div>
              <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-top: 2px;">${underloaded.length}</div>
              <div style="font-size: 0.76rem; color: var(--text-muted);"><11 scheduled hrs/wk (Available)</div>
            </div>
            <div class="stat-icon amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="table-toolbar">
        <div class="toolbar-filters">
          <div class="view-mode-tabs">
            <button class="tab-btn ${this.selectedStatus === 'ALL' ? 'active' : ''}" onclick="window.WorkloadView.setStatus('ALL')">All Faculty (${facultyList.length})</button>
            <button class="tab-btn ${this.selectedStatus === 'Overloaded' ? 'active' : ''}" onclick="window.WorkloadView.setStatus('Overloaded')" style="color: var(--danger);">Overloaded (${overloaded.length})</button>
            <button class="tab-btn ${this.selectedStatus === 'Optimal' ? 'active' : ''}" onclick="window.WorkloadView.setStatus('Optimal')" style="color: var(--success);">Optimal (${optimal.length})</button>
            <button class="tab-btn ${this.selectedStatus === 'Underloaded' ? 'active' : ''}" onclick="window.WorkloadView.setStatus('Underloaded')" style="color: var(--warning);">Underloaded (${underloaded.length})</button>
          </div>

          <select class="form-select" onchange="window.WorkloadView.setDept(this.value)">
            <option value="ALL" ${this.selectedDept === 'ALL' ? 'selected' : ''}>All Departments</option>
            ${depts.map(d => `<option value="${d.id}" ${this.selectedDept === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Workload Summary Cards Grid -->
      <div class="grid-3">
        ${filtered.map(f => {
          const pct = Math.min(100, Math.round((f.scheduledHours / f.maxHours) * 100));
          const progressClass = f.workloadStatus === 'Overloaded' ? 'overloaded' : f.workloadStatus === 'Underloaded' ? 'underloaded' : 'optimal';
          const badgeClass = f.workloadStatus === 'Overloaded' ? 'badge-overloaded' : f.workloadStatus === 'Underloaded' ? 'badge-underloaded' : 'badge-optimal';

          return `
            <div class="workload-card">
              <div>
                <div class="workload-card-header">
                  <img src="${f.avatar}" class="workload-avatar" alt="${f.name}">
                  <div class="workload-faculty-info">
                    <h4>${f.name}</h4>
                    <p>${f.designation} &bull; ${f.departmentCode}</p>
                  </div>
                </div>

                <div style="margin: 16px 0;">
                  <div class="workload-stats-row">
                    <div>
                      <span class="workload-hours">${f.scheduledHours}</span>
                      <span class="workload-max"> / ${f.maxHours} hrs max</span>
                    </div>
                    <span class="badge ${badgeClass}">${f.workloadStatus} (${pct}%)</span>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-fill ${progressClass}" style="width: ${pct}%;"></div>
                  </div>
                </div>

                <div style="margin-top: 12px;">
                  <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">
                    Assigned Courses (${f.assignedSubjectDetails.length})
                  </div>
                  <div class="subject-tag-list">
                    ${f.assignedSubjectDetails.length > 0 ? f.assignedSubjectDetails.map(s => `
                      <span class="subject-chip" title="${s.name}">${s.shortName} (${s.totalHours}h)</span>
                    `).join('') : '<span style="color: var(--text-muted); font-size: 0.76rem;">No assigned subjects</span>'}
                  </div>
                </div>
              </div>

              <div style="border-top: 1px solid var(--border-color); padding-top: 14px; display: flex; align-items: center; justify-content: space-between;">
                <button class="btn btn-outline btn-sm" onclick="window.FacultyView.viewProfile('${f.id}')">
                  View Schedule
                </button>
                <div style="display: flex; gap: 6px;">
                  <button class="btn btn-primary btn-sm" onclick="window.FacultyView.openAssignModal('${f.id}')">
                    Assign Subject
                  </button>
                  <button class="btn btn-secondary btn-sm" onclick="window.WorkloadView.editMaxHours('${f.id}')" title="Adjust Ceiling">
                    Adjust Max
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  setStatus: function(status) {
    this.selectedStatus = status;
    this.render(document.getElementById('view-content'));
  },

  setDept: function(dept) {
    this.selectedDept = dept;
    this.render(document.getElementById('view-content'));
  },

  editMaxHours: function(facultyId) {
    const f = window.db.getFacultyById(facultyId);
    if (!f) return;

    const newHours = prompt(`Update maximum weekly teaching hours for ${f.name} (Current: ${f.maxHours} hrs):`, f.maxHours);
    if (newHours && !isNaN(newHours)) {
      const parsed = parseInt(newHours, 10);
      if (parsed >= 4 && parsed <= 30) {
        window.db.saveFaculty({ id: f.id, maxHours: parsed });
        window.store.showToast(`Updated maximum workload ceiling for ${f.name} to ${parsed} hours.`, 'success');
        this.render(document.getElementById('view-content'));
      } else {
        alert('Please enter a realistic teaching workload between 4 and 30 hours.');
      }
    }
  },

  rebalanceWorkloadAuto: function() {
    const facultyList = window.db.getFacultyList();
    const overloaded = facultyList.filter(f => f.workloadStatus === 'Overloaded');
    const underloaded = facultyList.filter(f => f.workloadStatus === 'Underloaded');

    if (overloaded.length === 0) {
      window.store.showToast('Workload is balanced across faculty! No overloaded faculty detected.', 'success');
      return;
    }

    let recommendations = `<strong>AI Workload Balancing Suggestions:</strong><br><br>`;
    overloaded.forEach(ov => {
      const peers = underloaded.filter(u => u.departmentId === ov.departmentId);
      if (peers.length > 0) {
        recommendations += `&bull; Reassign one course (${ov.assignedSubjectDetails[0] ? ov.assignedSubjectDetails[0].shortName : 'course'}) from <strong>${ov.name}</strong> (${ov.scheduledHours} hrs) to <strong>${peers[0].name}</strong> (${peers[0].scheduledHours} hrs).<br>`;
      } else {
        recommendations += `&bull; <strong>${ov.name}</strong> exceeds limit. Consider assigning a lab session to a teaching assistant or adjunct faculty.<br>`;
      }
    });

    window.app.openModal('Workload Rebalancing Recommendation', `
      <div style="font-size: 0.9rem; line-height: 1.6; color: var(--text-primary);">
        ${recommendations}
      </div>
    `, `<button class="btn btn-secondary" onclick="window.app.closeModal()">Close</button>`);
  }
};
