import React from 'react';
import './TableHeader.css';

export default function TableHeader({ sortBy, setSortBy }) {
  const onSort = key => {
    if (sortBy.key === key) {
      setSortBy({ key, dir: -sortBy.dir });
    } else {
      setSortBy({ key, dir: 1 });
    }
  };

  return (
    <div className="table-header">
      <div className="col-name" onClick={() => onSort('name')}>
        Name {sortBy.key === 'name' ? (sortBy.dir === 1 ? '▲' : '▼') : ''}
      </div>
      <div className="col-date" onClick={() => onSort('date')}>
        Date {sortBy.key === 'date' ? (sortBy.dir === 1 ? '▲' : '▼') : ''}
      </div>
      <div className="col-invited" onClick={() => onSort('invitedBy')}>
        Invited By {sortBy.key === 'invitedBy' ? (sortBy.dir === 1 ? '▲' : '▼') : ''}
      </div>
      <div className="col-status" onClick={() => onSort('status')}>
        Status {sortBy.key === 'status' ? (sortBy.dir === 1 ? '▲' : '▼') : ''}
      </div>
      <div className="col-action">Action</div>
    </div>
  );
}