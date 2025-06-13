import React from "react";
import { Table, Button } from "react-bootstrap";

const js2idx = (js) => (js + 6) % 7;   // Sun(0) → 6, Mon(1) → 0 …

const Calendar = ({
  currentDate,
  setCurrentDate,
  weekDays,
  hoursRange,
  handleSlotClick,
  field,                 // eski kullanım
  weeklyOpenings,        // yeni kullanım
  exceptions,
  isAvailable = true,
}) => {
  const ymd = (d) => d.toISOString().slice(0, 10);

  /* Öncelik: explicit prop → field */
  const allWeekly  = weeklyOpenings ?? field?.weeklyOpenings ?? [];
  const allExcepts = exceptions     ?? field?.exceptions      ?? [];
  const availFlag  = isAvailable    && (field?.isAvailable ?? true);

  const exceptionFor = (d) =>
    allExcepts.find((ex) => ymd(d) === ex.date?.slice(0, 10));

  const openingFor = (d) =>
    allWeekly.find((w) => Number(w.dayOfWeek) === js2idx(d.getDay()));

  const slotOpen = (d, h) => {
    if (!availFlag) return false;

    const ex = exceptionFor(d);
    if (ex) return ex.isOpen;

    const o = openingFor(d);
    if (!o) return false;

    const s = parseInt(o.startTime.slice(0, 2), 10);
    const e = parseInt(o.endTime.slice(0, 2), 10);
    return h >= s && h < e;
  };

  const dayOpen = (d) => slotOpen(d, hoursRange[0] ?? 0);

  const shiftWeek = (k) => {
    const x = new Date(currentDate);
    x.setDate(currentDate.getDate() + k * 7);
    setCurrentDate(x);
  };

  return (
    <div className="border border-light p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="light" onClick={() => shiftWeek(-1)}>
          &larr; Önceki Hafta
        </Button>
        <h4 className="mb-0">
          {weekDays.length &&
            `${weekDays[0].toLocaleDateString("tr-TR")} - ${weekDays[6].toLocaleDateString("tr-TR")}`}
        </h4>
        <Button variant="light" onClick={() => shiftWeek(1)}>
          Sonraki Hafta &rarr;
        </Button>
      </div>

      <Table bordered responsive>
        <thead>
          <tr>
            <th>Saat</th>
            {weekDays.map((d, i) => (
              <th
                key={i}
                style={{
                  backgroundColor: dayOpen(d) ? "#e8f5e9" : "#ffebee",
                  color: dayOpen(d) ? "black" : "gray",
                }}
              >
                {d.toLocaleDateString("tr-TR", { weekday: "long" })} <br />
                {d.toLocaleDateString("tr-TR")}
                <div style={{ fontSize: "0.8rem" }}>
                  {dayOpen(d) ? "(Açık)" : "(Kapalı)"}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hoursRange.map((h) => (
            <tr key={h}>
              <td>{`${h.toString().padStart(2, "0")}:00`}</td>
              {weekDays.map((d, i) => {
                const ok = slotOpen(d, h);
                return (
                  <td
                    key={i}
                    onClick={() =>
                      ok &&
                      handleSlotClick({
                        day: d.toLocaleDateString("tr-TR"),
                        hour: `${h.toString().padStart(2, "0")}:00`,
                      })
                    }
                    style={{
                      backgroundColor: ok ? "#d4edda" : "#f8d7da",
                      cursor: ok ? "pointer" : "not-allowed",
                      textAlign: "center",
                      color: ok ? "black" : "gray",
                    }}
                  >
                    {ok ? "Müsait" : "Kapalı"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Calendar;
