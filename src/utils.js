/**
 * Throttle function - executes at most once every n milliseconds
 * @param {Function} fn - function to throttle
 * @param {number} wait - interval in milliseconds
 * @returns {Function} throttled function with cancel method
 */

export function throttle(fn, wait) {
  let last = 0;
  let timer = null;
  const throttled = (...args) => {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      last = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    last = 0;
  };
  return throttled;
}

/**
 * Debounce function - delays execution until n milliseconds have passed since last call
 * @param {Function} fn - function to debounce
 * @param {number} wait - delay in milliseconds
 * @returns {Function} debounced function with cancel method
 */
export function debounce(fn, wait) {
  let timer = null;
  const debounced = (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, wait);
  };
  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  return debounced;
}



/**
 * Validate if a single date string is valid
 * @param {string} dateStr - ISO date string (YYYY-MM-DD)
 * @returns {boolean}
 */
export function isValidDate(dateStr) {
  if (!dateStr) return true;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const d = new Date(dateStr);
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * Validate date range
 * @param {string} startDate - ISO date string
 * @param {string} endDate - ISO date string
 * @returns {Object} { isValid: boolean, error?: string }
 */
export function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return { isValid: true };
  }

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return { 
      isValid: false, 
      error: 'Invalid date format' 
    };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    return { 
      isValid: false, 
      error: 'End date must be after start date' 
    };
  }

  return { isValid: true };
}

/**
 * Parse ISO date string to Date object
 * @param {string} dateStr - ISO date string
 * @returns {Date}
 */
export function parseDate(dateStr) {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Parse end date to include entire day
 * @param {string} dateStr - ISO date string
 * @returns {Date}
 */
export function parseDateEnd(dateStr) {
  const d = new Date(dateStr);
  d.setHours(23, 59, 59, 999);
  return d;
}