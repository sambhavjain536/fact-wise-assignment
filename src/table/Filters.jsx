import React, { useRef, useEffect, useState } from 'react';
import './Filters.css';
import { debounce } from '../utils';
import { DELAYS, STATUS_OPTIONS } from '../constants';

const { SEARCH_DEBOUNCE } = DELAYS;

export default function Filters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  clearFilters
}) {
  const debouncedSetSearchRef = useRef(null);
  const [localSearch, setLocalSearch] = useState('');
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    debouncedSetSearchRef.current = debounce(val => setSearch(val), SEARCH_DEBOUNCE);
    return () => {
      debouncedSetSearchRef.current && debouncedSetSearchRef.current.cancel();
    };
  }, [setSearch]);

  // Sync local search with external search state (for clear filters)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const [start, end] = dateRange || [null, null];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSetSearchRef.current && debouncedSetSearchRef.current(value);
  };

  const handleStartDateChange = (e) => {
    const newStart = e.target.value || null;
    
    // Validate: start date should not be after end date
    if (newStart && end && new Date(newStart) > new Date(end)) {
      setDateError('Start date cannot be after end date');
      return;
    }
    
    setDateError('');
    setDateRange([newStart, end]);
  };

  const handleEndDateChange = (e) => {
    const newEnd = e.target.value || null;
    
    // Validate: end date should not be before start date
    if (start && newEnd && new Date(newEnd) < new Date(start)) {
      setDateError('End date cannot be before start date');
      return;
    }
    
    setDateError('');
    setDateRange([start, newEnd]);
  };

  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search"
        value={localSearch}
        onChange={handleSearchChange}
        className="filters__text"
      />
      <select 
        className="filters__select" 
        value={statusFilter} 
        onChange={e => setStatusFilter(e.target.value)}
      >
        <option value="">Status</option>
        {STATUS_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            className="filters__date"
            type="date"
            value={start || ''}
            onChange={handleStartDateChange}
            max={end || undefined}
          />
          <input
            className="filters__date"
            type="date"
            value={end || ''}
            onChange={handleEndDateChange}
            min={start || undefined}
          />
        </div>
        {dateError && (
          <div style={{ color: '#dc3545', fontSize: '12px', marginLeft: '4px' }}>
            {dateError}
          </div>
        )}
      </div>

      <button className="clear-btn" onClick={clearFilters}>Clear</button>
    </div>
  );
}