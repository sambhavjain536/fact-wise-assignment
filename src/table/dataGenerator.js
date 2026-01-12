import { DATA_CONFIG } from '../constants';

const { TOTAL_RECORDS } = DATA_CONFIG;
const STATUSES = ['ACTIVE', 'INVITED', 'BLOCKED'];

function formatDateYMD(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function generateRecords(count = TOTAL_RECORDS) {
  const records = [];
  for (let i = 1; i <= count; i++) {
    const status = STATUSES[(i - 1) % STATUSES.length];
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = formatDateYMD(d);
    records.push({
      id: String(i),
      about: {
        name: `Demo abhi ${i}`,
        status,
        email: `samb.d${i}@gmail.com`
      },
      details: {
        date,
        invitedBy: `Dem00 ${((i - 1) % 10) + 1}`
      }
    });
  }
  return records;
}