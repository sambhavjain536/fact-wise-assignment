import React, { useEffect, useRef, useState } from 'react';
import './UserTable.css';
import './table.css';
import Filters from './Filters';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import useTableData from './useTableData';
import { throttle } from '../utils';
import { TABLE_CONFIG, DELAYS, CSS_CLASSES } from '../constants';

const { ROW_HEIGHT, CONTAINER_HEIGHT, BUFFER_ROWS, INCREMENTAL_LOAD, PAGE_SIZE } = TABLE_CONFIG;
const { SCROLL_THROTTLE, INTERSECTION_THROTTLE } = DELAYS;

export default function UserTable() {
  const {
    data,
    page,
    setPage,
    totalPages,
    setSearch,
    search,
    setStatusFilter,
    statusFilter,
    dateRange,
    setDateRange,
    setSortBy,
    sortBy,
    updateStatus,
    clearFilters,
    stats,
    fullCount
  } = useTableData();

  const [visibleCount, setVisibleCount] = useState(INCREMENTAL_LOAD);
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);

  // Reset incremental load when filters/page change
  useEffect(() => {
    setVisibleCount(INCREMENTAL_LOAD);
    if (containerRef.current) containerRef.current.scrollTop = 0;
  }, [search, statusFilter, dateRange, sortBy, page]);

  // IntersectionObserver for incremental loading within current page
  useEffect(() => {
    if (!sentinelRef.current) return;
    
    const onIntersect = entries => {
      entries.forEach(ent => {
        if (ent.isIntersecting && visibleCount < data.length) {
          setVisibleCount(prev => {
            const newCount = prev + INCREMENTAL_LOAD;
            // Only increase count up to current page data length
            // Removed auto-advance to next page to fix pagination control
            return Math.min(data.length, newCount);
          });
        }
      });
    };
    
    const throttled = throttle(onIntersect, INTERSECTION_THROTTLE);
    const obs = new IntersectionObserver(throttled, { root: null, threshold: 0.1 });
    obs.observe(sentinelRef.current);
    
    return () => {
      obs.disconnect();
      throttled.cancel && throttled.cancel();
    };
  }, [data.length, visibleCount]);

  // Virtualization with throttled scroll
  const [scrollTop, setScrollTop] = useState(0);
  const scrollHandlerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      setScrollTop(containerRef.current.scrollTop);
    };
    scrollHandlerRef.current = throttle(handleScroll, SCROLL_THROTTLE);
    const c = containerRef.current;
    if (c) c.addEventListener('scroll', scrollHandlerRef.current, { passive: true });
    return () => {
      if (c) c.removeEventListener('scroll', scrollHandlerRef.current);
      scrollHandlerRef.current && scrollHandlerRef.current.cancel && scrollHandlerRef.current.cancel();
    };
  }, []);

  // Compute virtual rendering bounds
  const pageData = data;
  const visibleData = pageData.slice(0, visibleCount);
  const totalVirtual = visibleData.length;

  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_ROWS);
  const visibleRowCount = Math.ceil(CONTAINER_HEIGHT / ROW_HEIGHT) + BUFFER_ROWS * 2;
  const endIndex = Math.min(totalVirtual, startIndex + visibleRowCount);

  const contentHeight = totalVirtual * ROW_HEIGHT;

  // Calculate correct display counts for pagination
  const startRecord = (page - 1) * PAGE_SIZE + 1;
  const endRecord = Math.min(page * PAGE_SIZE, fullCount);

  return (
    <div className={CSS_CLASSES.TABLE}>
      <div className="user-table__top">
        <div className="user-table__title">User Details</div>
        <div className="user-table__stats">
          <div className="stat-card">
            <small>Total Users</small>
            <div className="value">{stats.total}</div>
          </div>
          <div className="stat-card stat-card--accent-green">
            <small>Active Users</small>
            <div className="value">{stats.active}</div>
          </div>
          <div className="stat-card stat-card--accent-blue">
            <small>Inactive Users</small>
            <div className="value">{stats.invited}</div>
          </div>
          <div className="stat-card stat-card--accent-red">
            <small>Blocked Users</small>
            <div className="value">{stats.blocked}</div>
          </div>
        </div>
      </div>

      <Filters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        clearFilters={clearFilters}
      />

      <div className={CSS_CLASSES.CARD}>
        <TableHeader sortBy={sortBy} setSortBy={setSortBy} />
        <div
          ref={containerRef}
          className={CSS_CLASSES.BODY}
          style={{ height: `${CONTAINER_HEIGHT}px` }}
        >
          <div style={{ height: `${contentHeight}px`, position: 'relative' }}>
            {visibleData.slice(startIndex, endIndex).map((item, i) => {
              const idx = startIndex + i;
              const top = idx * ROW_HEIGHT;
              return (
                <div key={item.id} style={{ position: 'absolute', left: 0, right: 0, top, height: ROW_HEIGHT }}>
                  <TableRow item={item} onUpdate={updateStatus} />
                </div>
              );
            })}
          </div>
        </div>
        <div ref={sentinelRef} style={{ height: 20, background: '#f9f9f9' }} />

        <div className={CSS_CLASSES.FOOTER}>
          <div>
            Showing {fullCount > 0 ? startRecord : 0} - {endRecord} of {fullCount} (Page {page} / {totalPages})
          </div>
          <div className="pagination">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>Prev</button>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}