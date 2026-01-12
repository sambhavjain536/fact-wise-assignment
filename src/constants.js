// Table configuration
export const TABLE_CONFIG = {
  ROW_HEIGHT: 72,
  CONTAINER_HEIGHT: 360,
  BUFFER_ROWS: 2,
  INCREMENTAL_LOAD: 5,
  PAGE_SIZE: 10,
};

// Debounce/Throttle delays (ms)
export const DELAYS = {
  SEARCH_DEBOUNCE: 300,
  SCROLL_THROTTLE: 50,
  INTERSECTION_THROTTLE: 200,
};

// Filter status options
export const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'ACTIVE', color: '#0A9A62' },
  { value: 'INVITED', label: 'INVITED', color: '#2B7EEA' },
  { value: 'BLOCKED', label: 'BLOCKED', color: '#D33' },
];

// Data generation defaults
export const DATA_CONFIG = {
  TOTAL_RECORDS: 100,
};

// CSS class names
export const CSS_CLASSES = {
  TABLE: 'user-table',
  CARD: 'table-card',
  ROW: 'table-row',
  HEADER: 'table-header',
  BODY: 'table-body',
  FOOTER: 'table-footer',
};