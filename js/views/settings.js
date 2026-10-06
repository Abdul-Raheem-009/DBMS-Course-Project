/**
 * System Settings & Data Management View Component
 */

window.SettingsView = {
  render: function(container) {
    const s = window.db.data.settings;

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>System Configuration & Parameters</h1>
          <p>Institutional parameters, workload threshold rules, academic terms, and database maintenance.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-primary" onclick="window.SettingsView.saveSettings()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            Save Configuration
          </button>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Institutional Details
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">University / College Name</label>
            <input type="text" class="form-control" id="cfgUnivName" value="${s.universityName}">
          </div>

          <div class="form-group">
            <label class="form-label">Portal Application Title</label>
            <input type="text" class="form-control" id="cfgPortalTitle" value="${s.portalTitle}">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Academic Year</label>
              <input type="text" class="form-control" id="cfgAcadYear" value="${s.academicYear}">
            </div>
            <div class="form-group">
              <label class="form-label">Current Active Semester</label>
              <input type="text" class="form-control" id="cfgSemester" value="${s.currentSemester}">
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Faculty Workload Threshold Rules
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Excess Workload Threshold (Hrs/Wk)</label>
              <input type="number" class="form-control" id="cfgExcess" value="${s.excessWorkloadThreshold || 16}">
              <div class="form-help">Scheduled hours above this value trigger Overload warnings.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Low Workload Threshold (Hrs/Wk)</label>
              <input type="number" class="form-control" id="cfgLow" value="${s.lowWorkloadThreshold || 11}">
              <div class="form-help">Scheduled hours below this value flag under-utilization.</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Lunch Interval Break</label>
            <input type="text" class="form-control" value="01:00 - 02:00" disabled style="background-color: var(--bg-tertiary);">
          </div>
        </div>
      </div>

      <!-- Database Maintenance Card -->
      <div class="card" style="border-left: 4px solid var(--danger);">
        <div class="card-header">
          <div>
            <div class="card-title" style="color: var(--danger);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>
              Database Reset & Seed Restoration
            </div>
            <div class="card-subtitle">Restore fresh realistic sample data for DBMS course evaluation and demos</div>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-outline btn-sm" onclick="window.SettingsView.backupJSON()">
              Download JSON Backup
            </button>
            <button class="btn btn-danger btn-sm" onclick="window.SettingsView.resetDatabase()">
              Reset Sample Data
            </button>
          </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
          Resetting will reload the complete authentic relational dataset including Dr. Ananya Rao (CSE), Prof. Rahul Sharma (AI & ML), Dr. Priya Nair (Mathematics), Prof. Arjun Kumar (ECE), all subjects, laboratory rooms, and pre-scheduled timetable slots.
        </p>
      </div>
    `;
  },

  saveSettings: function() {
    window.db.data.settings.universityName = document.getElementById('cfgUnivName').value.trim();
    window.db.data.settings.portalTitle = document.getElementById('cfgPortalTitle').value.trim();
    window.db.data.settings.academicYear = document.getElementById('cfgAcadYear').value.trim();
    window.db.data.settings.currentSemester = document.getElementById('cfgSemester').value.trim();
    window.db.data.settings.excessWorkloadThreshold = parseInt(document.getElementById('cfgExcess').value, 10);
    window.db.data.settings.lowWorkloadThreshold = parseInt(document.getElementById('cfgLow').value, 10);
    window.db.save();

    window.store.showToast('System settings saved successfully.', 'success');
  },

  resetDatabase: function() {
    if (confirm('Reset database back to default seed records? All custom changes will be restored to default state.')) {
      window.db.resetToDefaults();
      window.store.showToast('Database reset to fresh sample data!', 'success');
      window.store.setView('dashboard');
    }
  },

  backupJSON: function() {
    const jsonStr = JSON.stringify(window.db.data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FWTS_Academic_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.store.showToast('JSON Database backup downloaded.', 'info');
  }
};
