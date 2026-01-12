import React from 'react';
import './TableRow.css';

export default function TableRow({ item, onUpdate }) {
  const statusClass =
    item.about.status === 'ACTIVE' ? 'status-active' :
    item.about.status === 'BLOCKED' ? 'status-blocked' : 'status-invited';

  return (
    <div className="table-row">
      <div className="row-name">
        <div className="title">{item.about.name}</div>
        <div className="row-meta">{item.about.email}</div>
      </div>
      <div className="row-date">{item.details.date}</div>
      <div className="row-invited">{item.details.invitedBy}</div>
      <div className="col-status">
        <span className={`status-badge ${statusClass}`}>{item.about.status}</span>
      </div>
      <div className="action-buttons">
        <button className="action-btn" onClick={() => onUpdate(item.id, 'ACTIVE')}>Active</button>
        <button className="action-btn" onClick={() => onUpdate(item.id, 'INVITED')}>Invite</button>
        <button className="action-btn warn" onClick={() => onUpdate(item.id, 'BLOCKED')}>Block</button>
      </div>
    </div>
  );
}

