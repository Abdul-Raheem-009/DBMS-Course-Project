/**
 * Application State Store & Role Manager
 */

class AppStore {
  constructor() {
    this.currentView = 'dashboard';
    this.currentRole = localStorage.getItem('fwts_role') || 'admin';
    this.theme = localStorage.getItem('fwts_theme') || 'light';
    this.searchQuery = '';
    this.subscribers = {};

    this.roles = {
      admin: {
        id: 'admin',
        name: 'Dr. S. K. Narayanan',
        roleTitle: 'Dean of Academics & Super Admin',
        dept: 'Central Administration',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        allowedViews: [
          'dashboard', 'faculty', 'subjects', 'workload', 'timetable', 
          'rooms', 'departments', 'reports', 'notifications', 'schema', 'settings'
        ],
        badge: 'Admin'
      },
      coordinator: {
        id: 'coordinator',
        name: 'Dr. Rajesh Verma',
        roleTitle: 'CSE Department Coordinator',
        dept: 'Computer Science & Engineering',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        allowedViews: [
          'dashboard', 'faculty', 'workload', 'timetable', 'reports', 'notifications'
        ],
        badge: 'Coordinator'
      },
      faculty: {
        id: 'faculty',
        name: 'Dr. Ananya Rao',
        roleTitle: 'Associate Professor (CSE)',
        dept: 'Computer Science & Engineering',
        facultyId: 'FAC-101',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        allowedViews: [
          'dashboard', 'timetable', 'workload', 'subjects', 'notifications'
        ],
        badge: 'Faculty'
      }
    };
  }

  on(event, callback) {
    if (!this.subscribers[event]) this.subscribers[event] = [];
    this.subscribers[event].push(callback);
  }

  emit(event, data) {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach(cb => cb(data));
    }
  }

  getCurrentRoleData() {
    return this.roles[this.currentRole] || this.roles.admin;
  }

  setRole(roleKey) {
    if (!this.roles[roleKey]) return;
    this.currentRole = roleKey;
    localStorage.setItem('fwts_role', roleKey);
    
    // If the active view is not permitted for the new role, switch to dashboard
    const roleData = this.roles[roleKey];
    if (!roleData.allowedViews.includes(this.currentView)) {
      this.currentView = 'dashboard';
    }
    
    this.emit('roleChanged', roleData);
    this.emit('viewChanged', this.currentView);
  }

  setView(viewId) {
    const roleData = this.getCurrentRoleData();
    if (!roleData.allowedViews.includes(viewId)) {
      this.showToast('Access restricted for this role.', 'warning');
      return;
    }
    this.currentView = viewId;
    this.emit('viewChanged', viewId);
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem('fwts_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.emit('themeChanged', theme);
  }

  toggleTheme() {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  showToast(message, type = 'info', duration = 3500) {
    this.emit('toast', { message, type, duration });
  }

  showModal(modalId, options = {}) {
    this.emit('openModal', { modalId, options });
  }

  closeModal() {
    this.emit('closeModal', {});
  }
}

window.store = new AppStore();
