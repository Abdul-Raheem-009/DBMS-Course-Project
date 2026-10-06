/**
 * Room Management & Utilization View Component
 */

window.RoomsView = {
  filterType: 'ALL',

  render: function(container) {
    const rooms = window.db.getRoomList();

    const filtered = rooms.filter(r => {
      return this.filterType === 'ALL' || r.type === this.filterType;
    });

    const totalRooms = rooms.length;
    const freeRooms = rooms.filter(r => r.isAvailable).length;
    const occupiedRooms = totalRooms - freeRooms;

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Classroom & Laboratory Management</h1>
          <p>Monitor real-time room occupancies, physical capacities, audiovisual assets, and campus space allocations.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-primary" onclick="window.RoomsView.openAddModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            Add New Room
          </button>
        </div>
      </div>

      <!-- Room Stats -->
      <div class="grid-3" style="margin-bottom: 24px;">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Rooms</div>
            <div class="stat-value">${totalRooms}</div>
            <div class="stat-footer">Lecture halls & specialised labs</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon emerald">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Currently Available</div>
            <div class="stat-value" style="color: var(--success);">${freeRooms}</div>
            <div class="stat-footer">Free for immediate booking</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon rose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Currently Occupied</div>
            <div class="stat-value" style="color: var(--danger);">${occupiedRooms}</div>
            <div class="stat-footer">Class sessions in progress</div>
          </div>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="table-toolbar">
        <div class="toolbar-filters">
          <select class="form-select" onchange="window.RoomsView.setFilter(this.value)">
            <option value="ALL" ${this.filterType === 'ALL' ? 'selected' : ''}>All Room Types</option>
            <option value="Lecture Hall" ${this.filterType === 'Lecture Hall' ? 'selected' : ''}>Lecture Halls</option>
            <option value="Computer Lab" ${this.filterType === 'Computer Lab' ? 'selected' : ''}>Computer Labs</option>
            <option value="AI & Data Lab" ${this.filterType === 'AI & Data Lab' ? 'selected' : ''}>AI & Data Labs</option>
            <option value="Seminar Hall" ${this.filterType === 'Seminar Hall' ? 'selected' : ''}>Seminar Halls</option>
          </select>
        </div>
      </div>

      <!-- Room Cards Grid -->
      <div class="grid-3">
        ${filtered.map(r => {
          return `
            <div class="room-card">
              <div>
                <div class="room-card-top">
                  <div>
                    <div class="room-number">${r.roomNo}</div>
                    <div class="room-building">${r.building} &bull; Floor ${r.floor}</div>
                  </div>
                  <span class="room-status-badge ${r.isAvailable ? 'status-free' : 'status-occupied'}">
                    <span class="live-dot" style="background-color: ${r.isAvailable ? 'var(--success)' : 'var(--danger)'};"></span>
                    ${r.isAvailable ? 'Available' : 'Occupied'}
                  </span>
                </div>

                <div class="room-meta-grid" style="margin: 16px 0;">
                  <div class="room-meta-item">
                    <span>Type</span>
                    <span>${r.type}</span>
                  </div>
                  <div class="room-meta-item">
                    <span>Capacity</span>
                    <span>${r.capacity} Seats</span>
                  </div>
                  <div class="room-meta-item">
                    <span>Current Session</span>
                    <span>${r.currentClass}</span>
                  </div>
                  <div class="room-meta-item">
                    <span>Smart Tech</span>
                    <span>${r.hasSmartBoard ? 'Smart Board + Proj' : r.hasProjector ? 'Projector' : 'Standard'}</span>
                  </div>
                </div>

                <div style="margin-top: 12px;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.74rem; font-weight: 600; margin-bottom: 4px;">
                    <span style="color: var(--text-muted);">Weekly Utilization</span>
                    <span style="color: var(--text-primary);">${r.utilization}%</span>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-fill optimal" style="width: ${r.utilization}%;"></div>
                  </div>
                </div>
              </div>

              <div style="border-top: 1px solid var(--border-color); padding-top: 14px; display: flex; align-items: center; justify-content: space-between;">
                <button class="btn btn-outline btn-sm" onclick="window.TimetableView.switchViewMode('room'); window.TimetableView.setTarget('${r.roomNo}'); window.store.setView('timetable');">
                  View Timetable
                </button>
                <div style="display: flex; gap: 6px;">
                  <button class="btn btn-outline btn-sm" onclick="window.RoomsView.openEditModal('${r.roomNo}')" title="Edit Room">
                    Edit
                  </button>
                  <button class="btn btn-outline btn-sm" onclick="window.RoomsView.deleteRoom('${r.roomNo}')" style="color: var(--danger);" title="Delete Room">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  setFilter: function(type) {
    this.filterType = type;
    this.render(document.getElementById('view-content'));
  },

  openAddModal: function() {
    const bodyHtml = `
      <form id="addRoomForm" onsubmit="event.preventDefault(); window.RoomsView.saveNewRoom();">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Room Number <span class="required">*</span></label>
            <input type="text" class="form-control" id="roomNo" placeholder="e.g. B-204" required>
          </div>
          <div class="form-group">
            <label class="form-label">Capacity (Students) <span class="required">*</span></label>
            <input type="number" class="form-control" id="roomCap" value="60" min="15" max="300" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Building <span class="required">*</span></label>
            <input type="text" class="form-control" id="roomBuilding" placeholder="e.g. Block A (Alan Turing Block)" required>
          </div>
          <div class="form-group">
            <label class="form-label">Floor Number</label>
            <input type="number" class="form-control" id="roomFloor" value="2" min="0" max="8">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Room Type</label>
            <select class="form-control" id="roomType">
              <option value="Lecture Hall" selected>Lecture Hall</option>
              <option value="Computer Lab">Computer Lab</option>
              <option value="AI & Data Lab">AI & Data Lab</option>
              <option value="Seminar Hall">Seminar Hall</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Audiovisual Equipment</label>
            <select class="form-control" id="roomTech">
              <option value="smart" selected>Smart Board + Projector</option>
              <option value="projector">HD Projector Only</option>
              <option value="basic">Standard Whiteboard</option>
            </select>
          </div>
        </div>
      </form>
    `;

    window.app.openModal('Add Classroom / Lab', bodyHtml, `
      <button class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="window.RoomsView.saveNewRoom()">Save Room</button>
    `);
  },

  saveNewRoom: function() {
    const roomNo = document.getElementById('roomNo').value.trim();
    const capacity = parseInt(document.getElementById('roomCap').value, 10);
    const building = document.getElementById('roomBuilding').value.trim();
    const floor = parseInt(document.getElementById('roomFloor').value, 10);
    const type = document.getElementById('roomType').value;
    const tech = document.getElementById('roomTech').value;

    if (!roomNo || !building) {
      window.store.showToast('Please enter room number and building.', 'warning');
      return;
    }

    window.db.saveRoom({
      roomNo,
      capacity,
      building,
      floor,
      type,
      hasProjector: tech === 'smart' || tech === 'projector',
      hasSmartBoard: tech === 'smart'
    });

    window.app.closeModal();
    window.store.showToast(`Room ${roomNo} added successfully.`, 'success');
    this.render(document.getElementById('view-content'));
  },

  openEditModal: function(roomNo) {
    const r = window.db.data.rooms.find(room => room.roomNo === roomNo);
    if (!r) return;

    const bodyHtml = `
      <form id="editRoomForm" onsubmit="event.preventDefault(); window.RoomsView.updateRoom('${r.roomNo}');">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Room Number</label>
            <input type="text" class="form-control" value="${r.roomNo}" disabled style="background-color: var(--bg-tertiary);">
          </div>
          <div class="form-group">
            <label class="form-label">Capacity <span class="required">*</span></label>
            <input type="number" class="form-control" id="editRoomCap" value="${r.capacity}" min="15" max="300" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Building</label>
            <input type="text" class="form-control" id="editRoomBuilding" value="${r.building}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Room Type</label>
            <select class="form-control" id="editRoomType">
              <option value="Lecture Hall" ${r.type === 'Lecture Hall' ? 'selected' : ''}>Lecture Hall</option>
              <option value="Computer Lab" ${r.type === 'Computer Lab' ? 'selected' : ''}>Computer Lab</option>
              <option value="AI & Data Lab" ${r.type === 'AI & Data Lab' ? 'selected' : ''}>AI & Data Lab</option>
              <option value="Seminar Hall" ${r.type === 'Seminar Hall' ? 'selected' : ''}>Seminar Hall</option>
            </select>
          </div>
        </div>
      </form>
    `;

    window.app.openModal('Edit Room: ' + r.roomNo, bodyHtml, `
      <button class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="window.RoomsView.updateRoom('${r.roomNo}')">Save Changes</button>
    `);
  },

  updateRoom: function(roomNo) {
    const capacity = parseInt(document.getElementById('editRoomCap').value, 10);
    const building = document.getElementById('editRoomBuilding').value.trim();
    const type = document.getElementById('editRoomType').value;

    window.db.saveRoom({
      roomNo,
      capacity,
      building,
      type
    });

    window.app.closeModal();
    window.store.showToast(`Room ${roomNo} updated.`, 'success');
    this.render(document.getElementById('view-content'));
  },

  deleteRoom: function(roomNo) {
    if (confirm(`Are you sure you want to remove Room ${roomNo}?`)) {
      window.db.deleteRoom(roomNo);
      window.store.showToast(`Room ${roomNo} deleted.`, 'danger');
      this.render(document.getElementById('view-content'));
    }
  }
};
