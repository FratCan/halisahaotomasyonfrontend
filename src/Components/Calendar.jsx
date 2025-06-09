import React from 'react';
import { Table, Button } from 'react-bootstrap';

const Calendar = ({
  currentDate,
  setCurrentDate,
  weekDays,
  handleSlotClick,
  hoursRange,
  isAvailable,
  field
}) => {
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // İngilizce gün isimlerini Türkçeye çevirme fonksiyonu
  const translateDayToEnglish = (turkishDay) => {
    const daysMap = {
      'Pazartesi': 'Monday',
      'Salı': 'Tuesday',
      'Çarşamba': 'Wednesday',
      'Perşembe': 'Thursday',
      'Cuma': 'Friday',
      'Cumartesi': 'Saturday',
      'Pazar': 'Sunday'
    };
    return daysMap[turkishDay] || turkishDay;
  };

  const getDayName = (date) => {
    return date.toLocaleDateString("tr-TR", { weekday: "long" });
  };

  // Field'dan gelen openingDays'e göre gün kontrolü (İngilizce gün isimleri için)
  const isDayOpen = (day) => {
    const turkishDayName = getDayName(day);
    const englishDayName = translateDayToEnglish(turkishDayName);
    return field?.openingDays?.includes(englishDayName) ?? false;
  };

  // Kombine availability kontrolü
  const checkAvailability = (day, hour) => {
    // 1. Önce field'ın genel availability durumu
    if (field?.isAvailable === false) return false;
    
    // 2. Günün açık olup olmadığını kontrol et
    if (!isDayOpen(day)) return false;
    
    // 3. Saat aralığı kontrolü
    const h = parseInt(hour, 10);
    const startHour = parseInt(field?.startTime?.split(':')[0]) || 0;
    const endHour = parseInt(field?.endTime?.split(':')[0]) || 24;
    
    if (h < startHour || h >= endHour) return false;
    
    // 4. Eğer harici bir isAvailable fonksiyonu varsa onu da kontrol et
    if (typeof isAvailable === 'function') {
      return isAvailable(day, hour);
    }
    
    return true;
  };

  return (
    <div className="border border-light p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="light" onClick={goToPreviousWeek}>
          &larr; Önceki Hafta
        </Button>
        <h4 className="mb-0">
          {weekDays.length > 0 &&
            `${weekDays[0].toLocaleDateString("tr-TR")} - ${weekDays[6].toLocaleDateString("tr-TR")}`}
        </h4>
        <Button variant="light" onClick={goToNextWeek}>
          Sonraki Hafta &rarr;
        </Button>
      </div>

      <Table bordered responsive>
        <thead>
          <tr>
            <th>Saat</th>
            {weekDays.map((day, idx) => {
              const isOpen = isDayOpen(day);
              return (
                <th 
                  key={idx}
                  style={{
                    backgroundColor: isOpen ? '#e8f5e9' : '#ffebee',
                    color: isOpen ? 'black' : 'gray'
                  }}
                >
                  {getDayName(day)} <br /> 
                  {day.toLocaleDateString("tr-TR")}
                  <div style={{ fontSize: '0.8rem' }}>
                    {isOpen ? '(Açık)' : '(Kapalı)'}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {hoursRange.map((hour) => (
            <tr key={hour}>
              <td>{`${hour.toString().padStart(2, "0")}:00`}</td>
              {weekDays.map((day, idx) => {
                const available = checkAvailability(day, hour);
                return (
                  <td
                    key={idx}
                    style={{
                      backgroundColor: available ? "#d4edda" : "#f8d7da",
                      cursor: available ? "pointer" : "not-allowed",
                      textAlign: "center",
                      color: available ? "black" : "gray",
                    }}
                    onClick={() => {
                      if (!available) return;
                      handleSlotClick({
                        day: day.toLocaleDateString("tr-TR"),
                        hour: `${hour.toString().padStart(2, "0")}:00`,
                        status: "Available",
                        reservationInfo: {
                          name: "Rezervasyon Yok",
                          phone: "-",
                          email: "-",
                        },
                      });
                    }}
                  >
                    {available ? "Müsait" : "Kapalı"}
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