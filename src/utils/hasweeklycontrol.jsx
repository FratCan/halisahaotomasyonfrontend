// utils/weeklyConflicts.js
export const hasWeeklyConflict = (weeklyOpenings, reservations) => {
  return reservations.some((r) => {
    const day = new Date(r.slotStart).getDay();        // 0-6
    const start = r.slotStart.slice(11, 16);           // "HH:MM"
    const end   = r.slotEnd.slice(11, 16);

    const opening = weeklyOpenings.find((w) => w.dayOfWeek === day);
    if (!opening) return true;                         // o gün tamamen kapatılmış

    const ws = opening.startTime.slice(0, 5);          // "HH:MM"
    const we = opening.endTime.slice(0, 5);

    return start < ws || end > we;                     // dışarıda kalan varsa çatışma
  });
};
