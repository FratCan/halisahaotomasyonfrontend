import React from "react";
import { Table, Button } from "react-bootstrap";

// JavaScript gün indeksini backend dayOfWeek formatına çevir
// Eğer backend'inizde Pazartesi=0, Salı=1, ... Pazar=6 formatı kullanılıyorsa:
// const jsDayToBackendDay = (jsDay) => (jsDay + 6) % 7;

// Eğer backend'inizde JavaScript ile aynı format kullanılıyorsa (Pazar=0, Pazartesi=1, ...):
const jsDayToBackendDay = (jsDay) => jsDay;

const Calendar = ({
  currentDate,
  setCurrentDate,
  weekDays,
  hoursRange,
  handleSlotClick,
  field,
  weeklyOpenings,
  exceptions,
  isAvailable = true,
}) => {
  const ymd = (date) => date.toISOString().slice(0, 10);

  // Öncelik: explicit prop → field
  const allWeekly = weeklyOpenings ?? field?.weeklyOpenings ?? [];
  const allExcepts = exceptions ?? field?.exceptions ?? [];
  const availFlag = isAvailable && (field?.isAvailable ?? field?.available ?? true);

  console.log("=== Calendar Debug Info ===");
  console.log("Field:", field?.name);
  console.log("Available flag:", availFlag);
  console.log("Weekly openings:", allWeekly);
  console.log("Exceptions:", allExcepts);
  console.log("Hours range:", hoursRange);
  console.log("Week days:", weekDays.map(d => d.toLocaleDateString('tr-TR')));
  console.log("==========================");

  // Belirli bir tarih için exception bulma
  const getExceptionForDate = (date) => {
    const dateStr = ymd(date);
    return allExcepts.find((ex) => {
      const exDate = ex.date?.slice(0, 10);
      return dateStr === exDate;
    });
  };

  // Belirli bir gün için haftalık açılış saatleri bulma
  const getWeeklyOpeningForDay = (date) => {
    const jsDayOfWeek = date.getDay(); // 0=Pazar, 1=Pazartesi, ...
    const backendDayOfWeek = jsDayToBackendDay(jsDayOfWeek);
    
    console.log(`Day mapping: JS day ${jsDayOfWeek} (${date.toLocaleDateString('tr-TR', { weekday: 'long' })}) -> Backend day ${backendDayOfWeek}`);
    
    const found = allWeekly.find((w) => Number(w.dayOfWeek) === backendDayOfWeek);
    console.log(`Weekly opening for ${date.toLocaleDateString('tr-TR')}:`, found);
    
    return found;
  };

  // Belirli bir tarih ve saat için slot açık mı kontrol et
  const isSlotOpen = (date, hour) => {
    console.log(`\n=== Checking slot: ${date.toLocaleDateString('tr-TR')} ${hour}:00 ===`);
    
    // Eğer saha genel olarak kapalıysa
    if (!availFlag) {
      console.log("❌ Field not available (availFlag=false)");
      return false;
    }

    // Önce exception kontrol et
    const exception = getExceptionForDate(date);
    if (exception) {
      console.log(`🚨 Exception found for ${ymd(date)}:`, exception);
      if (!exception.isOpen) {
        console.log("❌ Exception says closed");
        return false;
      }
      console.log("✅ Exception says open, checking normal hours...");
    }

    // Haftalık açılış saatlerini kontrol et
    const weeklyOpening = getWeeklyOpeningForDay(date);
    if (!weeklyOpening) {
      console.log(`❌ No weekly opening found for ${date.toLocaleDateString('tr-TR')}`);
      return false;
    }

    // Saat aralığını kontrol et
    const startHour = parseInt(weeklyOpening.startTime.slice(0, 2), 10);
    const endHour = parseInt(weeklyOpening.endTime.slice(0, 2), 10);
    
    console.log(`⏰ Time check: ${hour}:00 vs Range ${startHour}:00-${endHour}:00`);
    
    const isInRange = hour >= startHour && hour < endHour;
    console.log(`${isInRange ? '✅' : '❌'} Slot ${isInRange ? 'OPEN' : 'CLOSED'}`);
    
    return isInRange;
  };

  // Belirli bir gün açık mı kontrol et (gün başlığı için)
  const isDayOpen = (date) => {
    if (!availFlag) return false;

    const exception = getExceptionForDate(date);
    if (exception) {
      return exception.isOpen;
    }

    const weeklyOpening = getWeeklyOpeningForDay(date);
    return Boolean(weeklyOpening);
  };

  // Hafta değiştirme
  const shiftWeek = (weeks) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + weeks * 7);
    setCurrentDate(newDate);
  };

  // Slot tıklama handler'ı
  const handleSlotClickInternal = (date, hour) => {
    if (isSlotOpen(date, hour)) {
      handleSlotClick({
        day: date.toLocaleDateString("tr-TR"),
        hour: `${hour.toString().padStart(2, "0")}:00`,
        date: date,
        reservationInfo: {
          name: "Test Rezervasyon",
          email: "test@test.com",
          phone: "0555 123 45 67"
        }
      });
    }
  };

  return (
    <div className="border border-light p-3">
      {/* Hafta navigasyonu */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="light" onClick={() => shiftWeek(-1)}>
          &larr; Önceki Hafta
        </Button>
        <h4 className="mb-0">
          {weekDays.length > 0 &&
            `${weekDays[0].toLocaleDateString("tr-TR")} - ${weekDays[6].toLocaleDateString("tr-TR")}`}
        </h4>
        <Button variant="light" onClick={() => shiftWeek(1)}>
          Sonraki Hafta &rarr;
        </Button>
      </div>

      {/* Debug bilgisi */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-3 p-2 bg-light rounded">
          <small>
            <strong>Debug:</strong> 
            Haftalık açılışlar: {allWeekly.length}, 
            İstisnalar: {allExcepts.length}, 
            Saha durumu: {availFlag ? 'Açık' : 'Kapalı'}
          </small>
        </div>
      )}

      <Table bordered responsive>
        <thead>
          <tr>
            <th style={{ width: "100px" }}>Saat</th>
            {weekDays.map((date, index) => {
              const dayIsOpen = isDayOpen(date);
              return (
                <th
                  key={index}
                  style={{
                    backgroundColor: dayIsOpen ? "#e8f5e9" : "#ffebee",
                    color: dayIsOpen ? "black" : "gray",
                    textAlign: "center"
                  }}
                >
                  <div>
                    {date.toLocaleDateString("tr-TR", { weekday: "long" })}
                  </div>
                  <div>
                    {date.toLocaleDateString("tr-TR")}
                  </div>
                  <div style={{ fontSize: "0.8rem", fontWeight: "normal" }}>
                    {dayIsOpen ? "(Açık)" : "(Kapalı)"}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {hoursRange.map((hour) => (
            <tr key={hour}>
              <td style={{ fontWeight: "bold", textAlign: "center" }}>
                {`${hour.toString().padStart(2, "0")}:00`}
              </td>
              {weekDays.map((date, dayIndex) => {
                const slotIsOpen = isSlotOpen(date, hour);
                return (
                  <td
                    key={dayIndex}
                    onClick={() => handleSlotClickInternal(date, hour)}
                    style={{
                      backgroundColor: slotIsOpen ? "#d4edda" : "#f8d7da",
                      cursor: slotIsOpen ? "pointer" : "not-allowed",
                      textAlign: "center",
                      color: slotIsOpen ? "black" : "gray",
                      padding: "8px",
                      transition: "background-color 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (slotIsOpen) {
                        e.target.style.backgroundColor = "#c3e6cb";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (slotIsOpen) {
                        e.target.style.backgroundColor = "#d4edda";
                      }
                    }}
                  >
                    {slotIsOpen ? "Müsait" : "Kapalı"}
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