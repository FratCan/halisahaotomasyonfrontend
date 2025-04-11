    // src/Components/Calendar.js
    import React from 'react';
    import { Table, Button } from 'react-bootstrap';

    const Calendar = ({ currentDate, setCurrentDate, weekDays, handleSlotClick, hoursRange }) => {
    return (
        <div className="border border-light">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <Button variant="light" onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}>&larr; Previous Week</Button>
            <h4 className="mb-0">
            {weekDays.length > 0 && `${weekDays[0].toLocaleDateString()} - ${weekDays[6].toLocaleDateString()}`}
            </h4>
            <Button variant="light" onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}>Next Week &rarr;</Button>
        </div>

        <Table bordered responsive>
            <thead>
            <tr>
                <th></th>
                {weekDays.map((day, idx) => (
                <th key={idx}>{day.toLocaleDateString()}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {hoursRange.map((hour) => (
                <tr key={hour}>
                <td>{`${hour.toString().padStart(2, "0")}:00`}</td>
                {weekDays.map((day, idx) => (
                    <td
                    key={idx}
                    style={{
                        backgroundColor: "#d4edda", // Available
                        cursor: "pointer",
                        textAlign: "center",
                    }}
                    onClick={() =>
                        handleSlotClick({
                        day: day.toLocaleDateString(),
                        hour: `${hour.toString().padStart(2, "0")}:00`,
                        status: "Available",
                        reservationInfo: {
                            name: "Not Reserved Yet",
                            phone: "-",
                            email: "-",
                        },
                        })
                    }
                    >
                    Müsait
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </Table>
        </div>
    );
    };

    export default Calendar;
