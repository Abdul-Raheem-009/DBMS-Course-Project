/**
 * Academic Departments View Component
 */

window.DepartmentsView = {
  render: function(container) {
    const depts = window.db.data.departments;
    const facultyList = window.db.getFacultyList();
    const subjects = window.db.data.subjects;

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Academic Departments</h1>
          <p>Institutional divisions, Department Chairs, enrolled cohort sizes, and faculty distribution.</p>
        </div>
      </div>

      <!-- Department Cards Grid -->
      <div class="grid-2">
        ${depts.map(d => {
          const deptFaculty = facultyList.filter(f => f.departmentId === d.id);
          const deptSubjects = subjects.filter(s => s.departmentId === d.id);
          const totalDeptHours = deptFaculty.reduce((acc, f) => acc + f.scheduledHours, 0);
          const avgHours = deptFaculty.length > 0 ? (totalDeptHours / deptFaculty.length).toFixed(1) : 0;

          return `
            <div class="dept-card">
              <div class="dept-card-stripe" style="background-color: ${d.color};"></div>
              
              <div class="dept-header">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span class="badge badge-secondary" style="font-weight: 700; color: ${d.color};">${d.code}</span>
                  <span style="font-size: 0.76rem; color: var(--text-muted);">${d.building}</span>
                </div>
                <h3 style="margin-top: 8px;">${d.name}</h3>
                <div class="dept-hod">Head of Department: <strong>${d.hod}</strong> (${d.email})</div>
              </div>

              <div class="dept-stats">
                <div>
                  <div class="dept-stat-val">${deptFaculty.length}</div>
                  <div class="dept-stat-lbl">Faculty Staff</div>
                </div>
                <div>
                  <div class="dept-stat-val">${deptSubjects.length}</div>
                  <div class="dept-stat-lbl">Active Courses</div>
                </div>
                <div>
                  <div class="dept-stat-val">${avgHours} <span style="font-size: 0.8rem;">h</span></div>
                  <div class="dept-stat-lbl">Avg Workload</div>
                </div>
              </div>

              <div>
                <div style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">
                  Faculty Members
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${deptFaculty.map(f => `
                    <div 
                      style="display: flex; align-items: center; gap: 6px; background-color: var(--bg-tertiary); padding: 4px 8px; border-radius: var(--radius-sm); cursor: pointer;"
                      onclick="window.FacultyView.viewProfile('${f.id}')"
                      title="${f.designation}"
                    >
                      <img src="${f.avatar}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover;">
                      <span style="font-size: 0.78rem; font-weight: 600;">${f.name}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.8rem; color: var(--text-muted);">${d.studentCount} Undergrad Students Enrolled</span>
                <button class="btn btn-outline btn-sm" onclick="window.FacultyView.setDeptFilter('${d.id}'); window.store.setView('faculty');">
                  View Faculty →
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
};
