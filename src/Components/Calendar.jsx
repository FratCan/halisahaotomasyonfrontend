import React from 'react';
import { Table, Button } from 'react-bootstrap';

const Calendar = ({ currentDate,
    setCurrentDate,
    weekDays,
    handleSlotClick,
    hoursRange,
    isAvailable}) => {
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

    const getDayName = (date) => {
        return date.toLocaleDateString("en-US", { weekday: "long" });
    };

    return (
        <div className="border border-light p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Button variant="light" onClick={goToPreviousWeek}>
                    &larr; Previous Week
                </Button>
                <h4 className="mb-0">
                    {weekDays.length > 0 &&
                        `${weekDays[0].toLocaleDateString()} - ${weekDays[6].toLocaleDateString()}`}
                </h4>
                <Button variant="light" onClick={goToNextWeek}>
                    Next Week &rarr;
                </Button>
            </div>

            <Table bordered responsive>
                <thead>
                    <tr>
                        <th>Hour</th>
                        {weekDays.map((day, idx) => (
                            <th key={idx}>
                                {getDayName(day)} <br /> {day.toLocaleDateString()}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {hoursRange.map((hour) => (
                        <tr key={hour}>
                            <td>{`${hour.toString().padStart(2, "0")}:00`}</td>
                            {weekDays.map((day, idx) => {
                                const available = isAvailable(day, hour); // ⬅️ Gün + Saat kontrolü
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
                                                day: day.toLocaleDateString(),
                                                hour: `${hour.toString().padStart(2, "0")}:00`,
                                                status: "Available",
                                                reservationInfo: {
                                                    name: "Not Reserved Yet",
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
