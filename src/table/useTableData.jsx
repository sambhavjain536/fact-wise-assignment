import { useMemo, useState, useCallback, useEffect } from 'react';
import { generateRecords } from './dataGenerator';
import { parseDate, parseDateEnd } from '../utils';
import { DATA_CONFIG, TABLE_CONFIG } from '../constants';

const { TOTAL_RECORDS } = DATA_CONFIG;
const { PAGE_SIZE } = TABLE_CONFIG;

export default function useTableData() {
  const all = useMemo(() => generateRecords(TOTAL_RECORDS), []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [sortBy, setSortBy] = useState({ key: null, dir: 1 });
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(all);

  const updateStatus = useCallback((id, newStatus) => {
    setRecords(prev =>
      prev.map(r => (r.id === id ? { ...r, about: { ...r.about, status: newStatus } } : r))
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('');
    setDateRange([null, null]);
    setSortBy({ key: null, dir: 1 });
    setPage(1);
  }, []);

  // Reset page when any filter changes
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, dateRange, sortBy]);

  const filtered = useMemo(() => {
    let list = records.slice();

    // Search filter
    if (search && search.trim()) {
      const s = search.toLowerCase().trim();
      list = list.filter(r => r.about.name.toLowerCase().includes(s));
    }

    // Status filter
    if (statusFilter) {
      list = list.filter(r => r.about.status === statusFilter);
    }

    // Date range filter
    if (dateRange[0] && dateRange[1]) {
      const start = parseDate(dateRange[0]);
      const end = parseDateEnd(dateRange[1]);
      list = list.filter(r => {
        const d = parseDate(r.details.date);
        return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
      });
    }

    // Sorting
    if (sortBy.key) {
      list.sort((a, b) => {
        let va, vb;
        switch (sortBy.key) {
          case 'name':
            va = a.about.name.toLowerCase();
            vb = b.about.name.toLowerCase();
            break;
          case 'email':
            va = a.about.email.toLowerCase();
            vb = b.about.email.toLowerCase();
            break;
          case 'date':
            va = a.details.date;
            vb = b.details.date;
            break;
          case 'invitedBy':
            va = a.details.invitedBy.toLowerCase();
            vb = b.details.invitedBy.toLowerCase();
            break;
          case 'status':
            va = a.about.status;
            vb = b.about.status;
            break;
          default:
            va = '';
            vb = '';
        }
        if (va < vb) return -1 * sortBy.dir;
        if (va > vb) return 1 * sortBy.dir;
        return 0;
      });
    }

    return list;
  }, [records, search, statusFilter, dateRange, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Validate page and cap it
  const validPage = Math.min(page, totalPages);
  useEffect(() => {
    if (validPage !== page) {
      setPage(validPage);
    }
  }, [validPage, page]);

  const paged = useMemo(() => {
    const start = (validPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, validPage]);

  const stats = useMemo(() => {
    const total = records.length;
    const active = records.filter(r => r.about.status === 'ACTIVE').length;
    const invited = records.filter(r => r.about.status === 'INVITED').length;
    const blocked = records.filter(r => r.about.status === 'BLOCKED').length;
    return {
      total,
      active,
      invited,
      blocked,
      activePct: total > 0 ? Math.round((active / total) * 100) : 0,
      invitedPct: total > 0 ? Math.round((invited / total) * 100) : 0,
      blockedPct: total > 0 ? Math.round((blocked / total) * 100) : 0
    };
  }, [records]);

  return {
    data: paged,
    fullCount: filtered.length,
    totalPages,
    page: validPage,
    setPage,
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
    stats
  };
}