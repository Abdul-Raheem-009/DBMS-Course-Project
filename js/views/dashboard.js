/**
 * Dashboard View Component
 */

window.DashboardView = {
  charts: {},

  render: function(container) {
    const facultyList = window.db.getFacultyList();
    const subjects = window.db.data.subjects;
    const timetable = window.db.data.timetable;
    const rooms = window.db.getRoomList();

    // Calculations
    const totalFaculty = facultyList.length;
    const totalSubjects = subjects.length;
    const totalClasses = timetable.length;
    const totalRooms = rooms.length;

    const totalHours = facultyList.reduce((sum, f) => sum + f.scheduledHours, 0);
    const avgWorkload = totalFaculty > 0 ? (totalHours / totalFaculty).toFixed(1) : 0;

    const excessFaculty = facultyList.filter(f => f.workloadStatus === 'Overloaded');
    const lowFaculty = facultyList.filter(f => f.workloadStatus === 'Underloaded');

    // Filter today's classes (Monday by default for rich display)
    const todayClasses = timetable.filter(t => t.day === 'Monday').sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>University Academic Dashboard</h1>
          <p>Real-time overview of faculty workload, class schedules, room allocations, and curriculum health.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="window.store.setView('reports')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Export Summary
          </button>
          <button class="btn btn-primary" onclick="window.app.openAddClassModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            Schedule Class
          </button>
        </div>
      </div>

      <!-- Stat Cards Grid -->
      <div class="stat-grid">
        <div class="stat-card" onclick="window.store.setView('faculty')" style="cursor: pointer;">
          <div class="stat-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Faculty</div>
            <div class="stat-value">${totalFaculty}</div>
            <div class="stat-footer">Across 4 Departments</div>
          </div>
        </div>

        <div class="stat-card" onclick="window.store.setView('subjects')" style="cursor: pointer;">
          <div class="stat-icon purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Active Subjects</div>
            <div class="stat-value">${totalSubjects}</div>
            <div class="stat-footer">Theory & Labs</div>
          </div>
        </div>

        <div class="stat-card" onclick="window.store.setView('timetable')" style="cursor: pointer;">
          <div class="stat-icon emerald">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Weekly Classes</div>
            <div class="stat-value">${totalClasses}</div>
            <div class="stat-footer">Scheduled slots</div>
          </div>
        </div>

        <div class="stat-card" onclick="window.store.setView('rooms')" style="cursor: pointer;">
          <div class="stat-icon cyan">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Rooms</div>
            <div class="stat-value">${totalRooms}</div>
            <div class="stat-footer">Halls & Tech Labs</div>
          </div>
        </div>

        <div class="stat-card" onclick="window.store.setView('workload')" style="cursor: pointer;">
          <div class="stat-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Avg Workload</div>
            <div class="stat-value">${avgWorkload} <span style="font-size: 0.9rem; font-weight: 500;">hrs/wk</span></div>
            <div class="stat-footer">Target: 14-16 hrs</div>
          </div>
        </div>

        <div class="stat-card" onclick="window.store.setView('workload')" style="cursor: pointer;">
          <div class="stat-icon rose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Excess Workload</div>
            <div class="stat-value" style="color: var(--danger);">${excessFaculty.length}</div>
            <div class="stat-footer">>16 hrs (Needs attention)</div>
          </div>
        </div>

        <div class="stat-card" onclick="window.store.setView('workload')" style="cursor: pointer;">
          <div class="stat-icon amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Low Workload</div>
            <div class="stat-value" style="color: var(--warning);">${lowFaculty.length}</div>
            <div class="stat-footer"><11 hrs (Available capacity)</div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                Faculty Workload Distribution
              </div>
              <div class="card-subtitle">Scheduled teaching hours vs. maximum assigned ceiling</div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="window.store.setView('workload')">Manage</button>
          </div>
          <div style="height: 280px; position: relative;">
            <canvas id="facultyWorkloadChart"></canvas>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 10 10h-10z"></path></svg>
                Department-wise Workload Share
              </div>
              <div class="card-subtitle">Aggregated weekly contact hours by department</div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="window.store.setView('departments')">Details</button>
          </div>
          <div style="height: 280px; position: relative;">
            <canvas id="deptWorkloadChart"></canvas>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom: 28px;">
        <div class="card-header">
          <div>
            <div class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              Weekly Class Load Distribution
            </div>
            <div class="card-subtitle">Total classroom hours distributed across academic days</div>
          </div>
          <div class="badge badge-info">Fall 2026 Grid</div>
        </div>
        <div style="height: 220px; position: relative;">
          <canvas id="weeklyDistributionChart"></canvas>
        </div>
      </div>

      <!-- Today's Schedule Section -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Today's Schedule (Monday)
            </div>
            <div class="card-subtitle">Active classes running in academic blocks</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="window.store.setView('timetable')">
            Full Weekly Timetable →
          </button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Time Slot</th>
                <th>Subject</th>
                <th>Faculty</th>
                <th>Room</th>
                <th>Class / Section</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${todayClasses.map(cls => {
                const sub = subjects.find(s => s.code === cls.subjectCode) || { name: cls.subjectCode, shortName: cls.subjectCode };
                const fac = facultyList.find(f => f.id === cls.facultyId) || { name: 'Unknown', avatar: '' };
                const sec = window.db.data.sections.find(s => s.id === cls.sectionId) || { name: cls.sectionId };

                return `
                  <tr>
                    <td>
                      <span style="font-weight: 700; color: var(--text-primary);">${cls.timeSlot}</span>
                    </td>
                    <td>
                      <div style="font-weight: 700; color: var(--text-primary);">${sub.shortName}</div>
                      <div style="font-size: 0.76rem; color: var(--text-muted);">${sub.name}</div>
                    </td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <img src="${fac.avatar}" alt="${fac.name}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;">
                        <span style="font-weight: 600;">${fac.name}</span>
                      </div>
                    </td>
                    <td>
                      <span class="badge badge-secondary" style="font-weight: 700;">${cls.roomNo}</span>
                    </td>
                    <td>
                      <span class="badge badge-info">${sec.name}</span>
                    </td>
                    <td>
                      <span class="badge ${cls.type.includes('Lab') ? 'badge-optimal' : 'badge-secondary'}">
                        ${cls.type}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-outline btn-sm" onclick="window.app.editClass('${cls.id}')" title="Edit Class">
                        Edit
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Render Charts using Chart.js
    this.renderCharts(facultyList);
  },

  renderCharts: function(facultyList) {
    if (typeof Chart === 'undefined') return;

    // Destroy prior charts if exist
    Object.keys(this.charts).forEach(key => {
      if (this.charts[key]) this.charts[key].destroy();
    });

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

    // Chart 1: Faculty Workload Bar Chart
    const ctx1 = document.getElementById('facultyWorkloadChart');
    if (ctx1) {
      this.charts.facultyWorkload = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: facultyList.map(f => f.name.split(' ')[1] || f.name),
          datasets: [
            {
              label: 'Scheduled Hours',
              data: facultyList.map(f => f.scheduledHours),
              backgroundColor: facultyList.map(f => 
                f.workloadStatus === 'Overloaded' ? '#ef4444' : 
                f.workloadStatus === 'Underloaded' ? '#f59e0b' : '#3b82f6'
              ),
              borderRadius: 6
            },
            {
              label: 'Max Allowed',
              data: facultyList.map(f => f.maxHours),
              type: 'line',
              borderColor: '#94a3b8',
              borderDash: [5, 5],
              borderWidth: 2,
              pointRadius: 4,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } },
              title: { display: true, text: 'Hours per Week', color: textColor, font: { size: 11 } }
            }
          }
        }
      });
    }

    // Chart 2: Department Workload Doughnut Chart
    const ctx2 = document.getElementById('deptWorkloadChart');
    if (ctx2) {
      const depts = window.db.data.departments;
      const deptHours = depts.map(d => {
        const facs = facultyList.filter(f => f.departmentId === d.id);
        return facs.reduce((acc, f) => acc + f.scheduledHours, 0);
      });

      this.charts.deptWorkload = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: depts.map(d => d.code),
          datasets: [{
            data: deptHours,
            backgroundColor: ['#2563eb', '#7c3aed', '#0891b2', '#059669'],
            borderWidth: 2,
            borderColor: isDark ? '#111827' : '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 12 } }
            }
          },
          cutout: '68%'
        }
      });
    }

    // Chart 3: Weekly Distribution Line Chart
    const ctx3 = document.getElementById('weeklyDistributionChart');
    if (ctx3) {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const counts = days.map(d => window.db.data.timetable.filter(t => t.day === d).length);

      this.charts.weekly = new Chart(ctx3, {
        type: 'line',
        data: {
          labels: days,
          datasets: [{
            label: 'Total Classes Scheduled',
            data: counts,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#2563eb',
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: textColor, stepSize: 1, font: { family: 'Plus Jakarta Sans', size: 11 } }
            }
          }
        }
      });
    }
  }
};
