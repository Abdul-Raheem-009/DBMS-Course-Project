/**
 * Main Application Orchestrator & View Controller
 */

class Application {
  constructor() {
    this.modalBackdrop = null;
    this.toastContainer = null;
  }

  init() {
    this.modalBackdrop = document.getElementById('modalBackdrop');
    this.toastContainer = document.getElementById('toast-container');

    // Register State Listeners
    window.store.on('viewChanged', (viewId) => this.handleViewChange(viewId));
    window.store.on('roleChanged', (roleData) => this.handleRoleChange(roleData));
    window.store.on('toast', (toastData) => this.displayToast(toastData));

    // Initialize Theme
    const savedTheme = localStorage.getItem('fwts_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Initial render
    this.renderSidebar();
    this.updateHeaderProfile();
    this.handleViewChange(window.store.currentView);
    this.updateHeaderBadges();

    // Close modal on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });

    console.log('Faculty Workload & Timetable Management System Initialized.');
  }

  handleViewChange(viewId) {
    const container = document.getElementById('view-content');
    if (!container) return;

    // Update active class in sidebar
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-view') === viewId);
    });

    // Render corresponding view
    switch (viewId) {
      case 'dashboard':
        window.DashboardView.render(container);
        break;
      case 'faculty':
        window.FacultyView.render(container);
        break;
      case 'subjects':
        window.SubjectsView.render(container);
        break;
      case 'workload':
        window.WorkloadView.render(container);
        break;
      case 'timetable':
        window.TimetableView.render(container);
        break;
      case 'rooms':
        window.RoomsView.render(container);
        break;
      case 'departments':
        window.DepartmentsView.render(container);
        break;
      case 'reports':
        window.ReportsView.render(container);
        break;
      case 'notifications':
        window.NotificationsView.render(container);
        break;
      case 'schema':
        window.SchemaView.render(container);
        break;
      case 'settings':
        window.SettingsView.render(container);
        break;
      default:
        window.DashboardView.render(container);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleRoleChange(roleData) {
    this.renderSidebar();
    this.updateHeaderProfile();
    window.store.showToast(`Switched active role to ${roleData.name} (${roleData.badge})`, 'info');
  }

  renderSidebar() {
    const sidebarMenu = document.getElementById('sidebarMenu');
    if (!sidebarMenu) return;

    const currentRole = window.store.getCurrentRoleData();
    const allowed = currentRole.allowedViews;

    // Definitions of all navigation items with SVG icons
    const navItems = [
      {
        id: 'dashboard',
        label: currentRole.id === 'faculty' ? 'My Dashboard' : 'Dashboard',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`
      },
      {
        id: 'faculty',
        label: currentRole.id === 'coordinator' ? 'Dept Faculty' : 'Faculty',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
      },
      {
        id: 'subjects',
        label: currentRole.id === 'faculty' ? 'My Subjects' : 'Subjects',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`
      },
      {
        id: 'workload',
        label: currentRole.id === 'faculty' ? 'My Workload' : 'Workload Management',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
        badge: window.db.getFacultyList().filter(f => f.workloadStatus === 'Overloaded').length > 0 ? 'Alert' : null,
        badgeClass: 'danger'
      },
      {
        id: 'timetable',
        label: currentRole.id === 'faculty' ? 'My Timetable' : 'Timetable',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`
      },
      {
        id: 'rooms',
        label: 'Rooms & Labs',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
      },
      {
        id: 'departments',
        label: 'Departments',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`
      },
      {
        id: 'reports',
        label: 'Reports & Audits',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
        badge: window.db.data.notifications.filter(n => !n.read).length || null,
        badgeClass: 'warning'
      },
      {
        id: 'schema',
        label: 'DBMS ER & Schema',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
        badge: 'DBMS',
        badgeClass: 'warning'
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
      }
    ];

    let html = `<div class="menu-section-label">Navigation Menu</div>`;

    navItems.forEach(item => {
      if (allowed.includes(item.id)) {
        html += `
          <div 
            class="nav-item ${item.id === window.store.currentView ? 'active' : ''}" 
            data-view="${item.id}"
            onclick="window.store.setView('${item.id}')"
          >
            ${item.icon}
            <span>${item.label}</span>
            ${item.badge ? `<span class="nav-badge ${item.badgeClass || ''}">${item.badge}</span>` : ''}
          </div>
        `;
      }
    });

    sidebarMenu.innerHTML = html;
  }

  updateHeaderProfile() {
    const role = window.store.getCurrentRoleData();
    const avatar = document.getElementById('headerAvatar');
    const name = document.getElementById('headerName');
    const roleBadge = document.getElementById('headerRole');
    const roleSelect = document.getElementById('roleSelect');

    if (avatar) avatar.src = role.avatar;
    if (name) name.textContent = role.name;
    if (roleBadge) roleBadge.textContent = role.roleTitle;
    if (roleSelect) roleSelect.value = role.id;
  }

  updateHeaderBadges() {
    const unread = window.db.data.notifications.filter(n => !n.read).length;
    const badge = document.getElementById('headerNotifCount');
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? 'flex' : 'none';
    }
  }

  displayToast({ message, type, duration }) {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-message">${message}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // --- Modal Helpers ---
  openModal(title, bodyHtml, footerHtml = '') {
    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalBody');
    const footerEl = document.getElementById('modalFooter');

    if (titleEl) titleEl.innerHTML = title;
    if (bodyEl) bodyEl.innerHTML = bodyHtml;
    if (footerEl) footerEl.innerHTML = footerHtml;

    if (this.modalBackdrop) {
      this.modalBackdrop.classList.add('active');
    }
  }

  closeModal() {
    if (this.modalBackdrop) {
      this.modalBackdrop.classList.remove('active');
    }
  }

  // Global "+ Add Class" with Live Conflict Detection
  openAddClassModal(initialData = {}) {
    const subjects = window.db.data.subjects;
    const facultyList = window.db.getFacultyList();
    const rooms = window.db.data.rooms;
    const sections = window.db.data.sections;
    const days = window.db.data.days;
    const timeSlots = window.db.data.timeSlots.filter(s => s !== '01:00 - 02:00'); // exclude lunch

    const defaultDay = initialData.day || 'Monday';
    const defaultSlot = initialData.timeSlot || '09:00 - 10:00';

    const bodyHtml = `
      <form id="addClassForm" onsubmit="event.preventDefault(); window.app.saveClassSlot();">
        <div id="modalConflictAlert" style="display: none;"></div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Day of Week <span class="required">*</span></label>
            <select class="form-control" id="slotDay" onchange="window.app.validateSlotConflict()" required>
              ${days.map(d => `<option value="${d}" ${d === defaultDay ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Time Slot <span class="required">*</span></label>
            <select class="form-control" id="slotTime" onchange="window.app.validateSlotConflict()" required>
              ${timeSlots.map(s => `<option value="${s}" ${s === defaultSlot ? 'selected' : ''}>${s}</option>`).join('')}
              <option value="02:00 - 04:00">02:00 - 04:00 (2-Hour Lab Block)</option>
              <option value="09:00 - 11:00">09:00 - 11:00 (2-Hour Lab Block)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Subject / Course <span class="required">*</span></label>
          <select class="form-control" id="slotSubject" onchange="window.app.onSubjectSelect(this.value)" required>
            ${subjects.map(s => `<option value="${s.code}">${s.code} - ${s.name} (${s.type})</option>`).join('')}
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Faculty Instructor <span class="required">*</span></label>
            <select class="form-control" id="slotFaculty" onchange="window.app.validateSlotConflict()" required>
              ${facultyList.map(f => `<option value="${f.id}">${f.name} (${f.departmentCode} &bull; ${f.scheduledHours}h)</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Room / Laboratory <span class="required">*</span></label>
            <select class="form-control" id="slotRoom" onchange="window.app.validateSlotConflict()" required>
              ${rooms.map(r => `<option value="${r.roomNo}">${r.roomNo} (${r.type} &bull; Cap: ${r.capacity})</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Class Section <span class="required">*</span></label>
            <select class="form-control" id="slotSection" onchange="window.app.validateSlotConflict()" required>
              ${sections.map(sec => `<option value="${sec.id}">${sec.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Session Format</label>
            <select class="form-control" id="slotType">
              <option value="Lecture" selected>Lecture</option>
              <option value="Practical Lab">Practical Lab</option>
              <option value="Tutorial">Tutorial</option>
            </select>
          </div>
        </div>
      </form>
    `;

    this.openModal('Schedule New Class Session', bodyHtml, `
      <button class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
      <button class="btn btn-primary" id="saveSlotBtn" onclick="window.app.saveClassSlot()">Schedule Class</button>
    `);

    // Run initial validation
    setTimeout(() => this.validateSlotConflict(), 50);
  }

  onSubjectSelect(subCode) {
    const sub = window.db.data.subjects.find(s => s.code === subCode);
    if (!sub) return;

    // Auto switch type if Lab
    const typeSelect = document.getElementById('slotType');
    if (typeSelect && sub.type === 'Practical Lab') {
      typeSelect.value = 'Practical Lab';
    }

    // Auto recommend room
    const roomSelect = document.getElementById('slotRoom');
    if (roomSelect) {
      if (sub.type.includes('Lab')) {
        roomSelect.value = 'Lab-1';
      }
    }

    this.validateSlotConflict();
  }

  validateSlotConflict(excludeId = null) {
    const day = document.getElementById('slotDay')?.value;
    const timeSlot = document.getElementById('slotTime')?.value;
    const facultyId = document.getElementById('slotFaculty')?.value;
    const roomNo = document.getElementById('slotRoom')?.value;
    const sectionId = document.getElementById('slotSection')?.value;
    const alertBox = document.getElementById('modalConflictAlert');
    const saveBtn = document.getElementById('saveSlotBtn');

    if (!day || !timeSlot || !facultyId || !roomNo || !sectionId) return;

    const conflicts = window.db.detectConflict({
      day,
      timeSlot,
      facultyId,
      roomNo,
      sectionId,
      excludeId
    });

    if (alertBox) {
      if (conflicts.length > 0) {
        alertBox.style.display = 'block';
        alertBox.className = 'conflict-alert-box';
        alertBox.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <div>
            <strong>Schedule Conflict Detected:</strong><br>
            ${conflicts.map(c => c.message).join('<br>')}
          </div>
        `;
        if (saveBtn) {
          saveBtn.classList.add('btn-danger');
          saveBtn.textContent = 'Force Schedule Over Conflict';
        }
      } else {
        alertBox.style.display = 'none';
        if (saveBtn) {
          saveBtn.classList.remove('btn-danger');
          saveBtn.textContent = 'Schedule Class';
        }
      }
    }
  }

  saveClassSlot(existingId = null) {
    const day = document.getElementById('slotDay').value;
    const timeSlot = document.getElementById('slotTime').value;
    const subjectCode = document.getElementById('slotSubject').value;
    const facultyId = document.getElementById('slotFaculty').value;
    const roomNo = document.getElementById('slotRoom').value;
    const sectionId = document.getElementById('slotSection').value;
    const type = document.getElementById('slotType').value;

    window.db.saveTimetableSlot({
      id: existingId,
      day,
      timeSlot,
      subjectCode,
      facultyId,
      roomNo,
      sectionId,
      type
    });

    this.closeModal();
    window.store.showToast('Class scheduled successfully!', 'success');
    window.store.emit('viewChanged', window.store.currentView);
  }

  editClass(id) {
    const entry = window.db.data.timetable.find(t => t.id === id);
    if (!entry) return;

    const subjects = window.db.data.subjects;
    const facultyList = window.db.getFacultyList();
    const rooms = window.db.data.rooms;
    const sections = window.db.data.sections;
    const days = window.db.data.days;
    const timeSlots = window.db.data.timeSlots.filter(s => s !== '01:00 - 02:00');

    const bodyHtml = `
      <form id="editClassForm" onsubmit="event.preventDefault(); window.app.saveClassSlot('${entry.id}');">
        <div id="modalConflictAlert" style="display: none;"></div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Day of Week</label>
            <select class="form-control" id="slotDay" onchange="window.app.validateSlotConflict('${entry.id}')">
              ${days.map(d => `<option value="${d}" ${d === entry.day ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Time Slot</label>
            <select class="form-control" id="slotTime" onchange="window.app.validateSlotConflict('${entry.id}')">
              ${timeSlots.map(s => `<option value="${s}" ${s === entry.timeSlot ? 'selected' : ''}>${s}</option>`).join('')}
              <option value="02:00 - 04:00" ${entry.timeSlot === '02:00 - 04:00' ? 'selected' : ''}>02:00 - 04:00 (2-Hour Lab Block)</option>
              <option value="09:00 - 11:00" ${entry.timeSlot === '09:00 - 11:00' ? 'selected' : ''}>09:00 - 11:00 (2-Hour Lab Block)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Subject / Course</label>
          <select class="form-control" id="slotSubject">
            ${subjects.map(s => `<option value="${s.code}" ${s.code === entry.subjectCode ? 'selected' : ''}>${s.code} - ${s.name}</option>`).join('')}
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Faculty Instructor</label>
            <select class="form-control" id="slotFaculty" onchange="window.app.validateSlotConflict('${entry.id}')">
              ${facultyList.map(f => `<option value="${f.id}" ${f.id === entry.facultyId ? 'selected' : ''}>${f.name} (${f.departmentCode})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Room / Lab</label>
            <select class="form-control" id="slotRoom" onchange="window.app.validateSlotConflict('${entry.id}')">
              ${rooms.map(r => `<option value="${r.roomNo}" ${r.roomNo === entry.roomNo ? 'selected' : ''}>${r.roomNo} (${r.type})</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Class Section</label>
            <select class="form-control" id="slotSection" onchange="window.app.validateSlotConflict('${entry.id}')">
              ${sections.map(sec => `<option value="${sec.id}" ${sec.id === entry.sectionId ? 'selected' : ''}>${sec.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Session Format</label>
            <select class="form-control" id="slotType">
              <option value="Lecture" ${entry.type === 'Lecture' ? 'selected' : ''}>Lecture</option>
              <option value="Practical Lab" ${entry.type === 'Practical Lab' ? 'selected' : ''}>Practical Lab</option>
              <option value="Tutorial" ${entry.type === 'Tutorial' ? 'selected' : ''}>Tutorial</option>
            </select>
          </div>
        </div>
      </form>
    `;

    this.openModal('Edit Scheduled Class Slot', bodyHtml, `
      <button class="btn btn-outline" style="color: var(--danger);" onclick="window.TimetableView.deleteSlot('${entry.id}'); window.app.closeModal();">Delete Slot</button>
      <button class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
      <button class="btn btn-primary" id="saveSlotBtn" onclick="window.app.saveClassSlot('${entry.id}')">Update Class</button>
    `);
  }

  handleGlobalSearch(query) {
    if (!query) return;
    const q = query.toLowerCase();

    // Check faculty
    const fac = window.db.getFacultyList().find(f => f.name.toLowerCase().includes(q) || f.id.toLowerCase().includes(q));
    if (fac) {
      window.store.setView('faculty');
      window.FacultyView.setSearch(query);
      return;
    }

    // Check subjects
    const sub = window.db.data.subjects.find(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
    if (sub) {
      window.store.setView('subjects');
      window.SubjectsView.setSearch(query);
      return;
    }

    // Default to timetable
    window.store.setView('timetable');
  }

  toggleSidebar() {
    const sb = document.querySelector('.sidebar');
    if (sb) sb.classList.toggle('open');
  }
}

// Global App instance
window.app = new Application();

document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
