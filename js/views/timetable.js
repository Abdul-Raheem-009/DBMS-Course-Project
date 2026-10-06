/**
 * Interactive Weekly Timetable Matrix with Conflict Detection Engine
 */

window.TimetableView = {
  viewMode: 'section', // 'section' | 'faculty' | 'room'
  selectedFilter: 'SEC-CSE-5A', // default selection

  render: function(container) {
    const days = window.db.data.days;
    const timeSlots = window.db.data.timeSlots;
    const sections = window.db.data.sections;
    const facultyList = window.db.getFacultyList();
    const rooms = window.db.data.rooms;
    const timetable = window.db.data.timetable;

    // Filter slots based on current viewMode & selectedFilter
    let currentFilteredSlots = [];
    if (this.viewMode === 'section') {
      currentFilteredSlots = timetable.filter(t => t.sectionId === this.selectedFilter);
    } else if (this.viewMode === 'faculty') {
      currentFilteredSlots = timetable.filter(t => t.facultyId === this.selectedFilter);
    } else if (this.viewMode === 'room') {
      currentFilteredSlots = timetable.filter(t => t.roomNo === this.selectedFilter);
    }

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Academic Timetable Matrix</h1>
          <p>Interactive weekly scheduling grid with integrated conflict resolution and room collision prevention.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-outline" onclick="window.print()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Print Timetable
          </button>
          <button class="btn btn-primary" onclick="window.app.openAddClassModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            Schedule Class
          </button>
        </div>
      </div>

      <div class="timetable-wrapper">
        <!-- Controls & Filter Switcher -->
        <div class="timetable-controls">
          <div class="timetable-filter-group">
            <div class="view-mode-tabs">
              <button class="tab-btn ${this.viewMode === 'section' ? 'active' : ''}" onclick="window.TimetableView.switchViewMode('section')">By Section</button>
              <button class="tab-btn ${this.viewMode === 'faculty' ? 'active' : ''}" onclick="window.TimetableView.switchViewMode('faculty')">By Faculty</button>
              <button class="tab-btn ${this.viewMode === 'room' ? 'active' : ''}" onclick="window.TimetableView.switchViewMode('room')">By Room</button>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-secondary);">Select Target:</span>
              ${this.renderTargetDropdown(sections, facultyList, rooms)}
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; font-size: 0.78rem;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="width: 12px; height: 12px; background: #3b82f6; border-radius: 2px;"></span>
              <span>Theory Lecture</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="width: 12px; height: 12px; background: #7c3aed; border-radius: 2px;"></span>
              <span>Practical Lab</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="width: 12px; height: 12px; background: #ef4444; border-radius: 2px;"></span>
              <span>Conflict Flag</span>
            </div>
          </div>
        </div>

        <!-- Weekly Matrix Grid -->
        <div class="timetable-grid-container">
          <table class="timetable-grid">
            <thead>
              <tr>
                <th class="time-col-header">Time Slot</th>
                ${days.map(d => `<th>${d}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${timeSlots.map(slot => {
                const isLunch = slot === '01:00 - 02:00';
                if (isLunch) {
                  return `
                    <tr class="lunch-row">
                      <td class="time-cell">${slot}</td>
                      <td colspan="${days.length}">
                        LUNCH & RECESS INTERVAL (CAMPUS DINING & BREAK)
                      </td>
                    </tr>
                  `;
                }

                return `
                  <tr>
                    <td class="time-cell">${slot}</td>
                    ${days.map(day => {
                      // Match entries for this day and slot
                      const entry = currentFilteredSlots.find(t => {
                        if (t.day !== day) return false;
                        if (t.timeSlot === slot) return true;
                        // multi-hour labs:
                        if (t.timeSlot === '02:00 - 04:00' && (slot === '02:00 - 03:00' || slot === '03:00 - 04:00')) return true;
                        if (t.timeSlot === '09:00 - 11:00' && (slot === '09:00 - 10:00' || slot === '10:00 - 11:00')) return true;
                        return false;
                      });

                      if (entry) {
                        const sub = window.db.data.subjects.find(s => s.code === entry.subjectCode) || { name: entry.subjectCode, shortName: entry.subjectCode };
                        const fac = facultyList.find(f => f.id === entry.facultyId) || { name: 'Unknown Faculty' };
                        const sec = sections.find(s => s.id === entry.sectionId) || { name: entry.sectionId };
                        const isLab = entry.type && entry.type.includes('Lab');

                        return `
                          <td class="slot-cell">
                            <div class="class-card ${isLab ? 'lab-card' : 'theory-card'}" onclick="window.app.editClass('${entry.id}')">
                              <div class="class-card-header">
                                <span class="class-code">${sub.shortName}</span>
                                <span class="class-type-badge">${isLab ? 'LAB' : 'LEC'}</span>
                              </div>
                              <div class="class-title" title="${sub.name}">${sub.name}</div>
                              <div class="class-meta">
                                <span class="class-faculty" title="${fac.name}">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                  ${fac.name.split(' ')[0]} ${fac.name.split(' ')[1] || ''}
                                </span>
                                <span class="class-room-badge">${entry.roomNo}</span>
                              </div>
                              <div class="card-actions-hover">
                                <button class="card-action-mini" onclick="event.stopPropagation(); window.app.editClass('${entry.id}')" title="Edit">✏️</button>
                                <button class="card-action-mini delete" onclick="event.stopPropagation(); window.TimetableView.deleteSlot('${entry.id}')" title="Delete">🗑️</button>
                              </div>
                            </div>
                          </td>
                        `;
                      } else {
                        // Empty slot with hover add button
                        return `
                          <td class="slot-cell">
                            <button 
                              class="slot-empty-trigger" 
                              onclick="window.app.openAddClassModal({ day: '${day}', timeSlot: '${slot}' })"
                              title="Click to schedule class here"
                            >
                              + Add
                            </button>
                          </td>
                        `;
                      }
                    }).join('')}
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderTargetDropdown: function(sections, facultyList, rooms) {
    if (this.viewMode === 'section') {
      return `
        <select class="form-select" onchange="window.TimetableView.setTarget(this.value)">
          ${sections.map(s => `<option value="${s.id}" ${this.selectedFilter === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
        </select>
      `;
    } else if (this.viewMode === 'faculty') {
      return `
        <select class="form-select" onchange="window.TimetableView.setTarget(this.value)">
          ${facultyList.map(f => `<option value="${f.id}" ${this.selectedFilter === f.id ? 'selected' : ''}>${f.name} (${f.departmentCode})</option>`).join('')}
        </select>
      `;
    } else {
      return `
        <select class="form-select" onchange="window.TimetableView.setTarget(this.value)">
          ${rooms.map(r => `<option value="${r.roomNo}" ${this.selectedFilter === r.roomNo ? 'selected' : ''}>${r.roomNo} (${r.type})</option>`).join('')}
        </select>
      `;
    }
  },

  switchViewMode: function(mode) {
    this.viewMode = mode;
    if (mode === 'section') {
      this.selectedFilter = 'SEC-CSE-5A';
    } else if (mode === 'faculty') {
      this.selectedFilter = 'FAC-101';
    } else if (mode === 'room') {
      this.selectedFilter = 'A-101';
    }
    this.render(document.getElementById('view-content'));
  },

  setTarget: function(val) {
    this.selectedFilter = val;
    this.render(document.getElementById('view-content'));
  },

  deleteSlot: function(id) {
    if (confirm('Are you sure you want to remove this scheduled class slot?')) {
      window.db.deleteTimetableSlot(id);
      window.store.showToast('Class slot removed from schedule.', 'info');
      this.render(document.getElementById('view-content'));
    }
  }
};
