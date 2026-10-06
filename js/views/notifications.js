/**
 * Notifications Center View Component
 */

window.NotificationsView = {
  render: function(container) {
    const notifs = window.db.data.notifications;
    const unreadCount = notifs.filter(n => !n.read).length;

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>System Alerts & Notifications</h1>
          <p>Real-time campus scheduling events, workload threshold notifications, and facility announcements.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-outline" onclick="window.NotificationsView.markAllRead()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Mark All as Read
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            Inbox (${unreadCount} Unread)
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${notifs.map(n => {
            const iconColor = n.type === 'warning' ? 'var(--warning)' : n.type === 'alert' ? 'var(--danger)' : n.type === 'success' ? 'var(--success)' : 'var(--primary)';
            return `
              <div style="display: flex; align-items: flex-start; justify-content: space-between; padding: 16px; border-radius: var(--radius-md); background-color: ${n.read ? 'var(--bg-tertiary)' : 'var(--bg-secondary)'}; border: 1px solid ${n.read ? 'var(--border-color)' : 'var(--primary-border)'};">
                <div style="display: flex; align-items: flex-start; gap: 14px;">
                  <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${iconColor}; margin-top: 6px; flex-shrink: 0;"></div>
                  <div>
                    <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">${n.title}</div>
                    <div style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 4px;">${n.message}</div>
                    <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 6px;">${n.timestamp}</div>
                  </div>
                </div>
                ${!n.read ? `
                  <button class="btn btn-outline btn-sm" onclick="window.NotificationsView.markSingleRead('${n.id}')">
                    Mark Read
                  </button>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  markAllRead: function() {
    window.db.data.notifications.forEach(n => n.read = true);
    window.db.save();
    window.store.showToast('All notifications marked as read.', 'info');
    this.render(document.getElementById('view-content'));
    window.app.updateHeaderBadges();
  },

  markSingleRead: function(id) {
    const notif = window.db.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      window.db.save();
      this.render(document.getElementById('view-content'));
      window.app.updateHeaderBadges();
    }
  }
};
