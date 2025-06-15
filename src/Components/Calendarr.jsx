    import React, { useMemo } from "react";
    import { Table, Button } from "react-bootstrap";

    /* ---------- Yardımcılar ---------- */
    const WEEK_DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    ];

    const toWeekIndex = (dow) =>
    typeof dow === "number"
        ? dow
        : WEEK_DAYS.findIndex((d) => d.toLowerCase() === String(dow).toLowerCase());

    /* Hücre rengi */
    const cellClass = (status) =>
    status === "Boş"
        ? "bg-success  text-white"
        : status === "Dolu"
        ? "bg-danger  text-white"
        : status === "Kapalı"
        ? "bg-secondary text-white"
        : "bg-warning text-dark"; // Geçmiş

    export default function Calendar({
    weekDays, // [Date, …]  (7 gün)
    hoursRange, // [7, 8, …, 23]
    field, // seçili saha
    reservations, // isteğe bağlı: [{ slotStart:"2025-06-14T18:00:00Z", …}]
    onSlotClick,
    changeWeek,
    }) {
    /* ---------- slot durumunu hesapla ---------- */
    const slots = useMemo(() => {
        if (!field) return {};

        /* Ön işlem – exceptions & weeklyOpenings’ı haritalara çevir */
        const excMap = {}; // "2025-06-15" → isOpen
        (field.exceptions ?? []).forEach((ex) => {
        excMap[ex.date.slice(0, 10)] = !!ex.isOpen; // true = açık, false = kapalı
        });

        const weekly = {}; // 0-6 → [[s,e],…]
        (field.weeklyOpenings ?? []).forEach((w) => {
        const idx = toWeekIndex(w.dayOfWeek);
        if (idx === -1) return;
        const s = +w.startTime.slice(0, 2);             // 07
        let   e = +w.endTime.slice(0, 2);               // 00 → 0
        if (e === 0 || e <= s) e = 24;                  // gece yarısı = 24
        (weekly[idx] ??= []).push([s, e]);
        });

        /* Rezerve saatler */
        const reserved = new Set(
        (reservations ?? [])
            .map((r) => r.slotStart)
            .filter(Boolean)
            .map((iso) => iso.slice(0, 13)) // "YYYY-MM-DDTHH"
        );

        /* Grid üret */
        const now = new Date();
        const obj = {};

        weekDays.forEach((d) => {
        const isoDate = d.toISOString().slice(0, 10);
        const weekday = d.getDay();
        const isExc = isoDate in excMap;
        const isClosedByExc = isExc && excMap[isoDate] === false;
        const isForcedOpen = isExc && excMap[isoDate] === true;
        const dayKey = isoDate;
        obj[dayKey] = {};

        hoursRange.forEach((h) => {
            let status;
            /* 1 → saha kapalı ise: */
            if (!field.isAvailable || isClosedByExc) {
            status = "Kapalı";
            } else {
            /* 2 → çalışma saatlerinde mi? */
            let openHour = false;
            if (isForcedOpen) {
                openHour = true;
            } else {
                (weekly[weekday] ?? []).forEach(([s, e]) => {
                if (h >= s && h < e) openHour = true;
                });
            }

            if (!openHour) {
                status = "Kapalı";
            } else {
                /* 3 → rezerve mi? */
                const key = `${isoDate}T${String(h).padStart(2, "0")}`;
                if (reserved.has(key)) status = "Dolu";
                else {
                /* 4 → geçmiş mi? */
                const slotDate = new Date(isoDate);
                slotDate.setHours(h, 0, 0, 0);
                if (slotDate < now) status = "Geçmiş";
                else status = "Boş";
                }
            }
            }
            obj[dayKey][h] = status;
        });
        });
        return obj; // { "2025-06-14": {7:"Kapalı", 8:"Boş", …}, … }
    }, [field, reservations, weekDays, hoursRange]);

    /* ------ HEADER: hafta gezinti ------ */
    const rangeLabel = `${weekDays[0].toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "short",
    })}
    - ${weekDays[6].toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    })}`;

    /* ---------- render ---------- */
    return (
        <>
        {/*  GEZİNTİ DÜĞMELERİ  */}
        <div className="d-flex justify-content-between align-items-center">
            <Button variant="light" size="sm" onClick={() => changeWeek(-1)}>
            ‹ Önceki
            </Button>
            <strong>{rangeLabel}</strong>
            <Button variant="light" size="sm" onClick={() => changeWeek(+1)}>
            Sonraki ›
            </Button>
        </div>

        {/*  TAKVİM TABLOSU  */}
        <Table bordered responsive className="mt-2 text-center align-middle">
            <thead>
            <tr>
                <th style={{ width: 70 }}></th>
                {weekDays.map((d) => (
                <th key={d}>
                    {d.toLocaleDateString("tr-TR", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    })}
                </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {hoursRange.map((h) => (
                <tr key={h}>
                <th className="text-end pe-2">
                    {`${String(h).padStart(2, "0")}:00`}
                </th>
                {weekDays.map((d) => {
                    const iso = d.toISOString().slice(0, 10);
                    const status = slots?.[iso]?.[h] ?? "Kapalı";
                    return (
                    <td
                        key={iso + h}
                        className={cellClass(status)}
                        style={{ cursor: status === "Boş" ? "pointer" : "default" }}
                        onClick={
                        status === "Boş"
                            ? () => onSlotClick({ day: iso, hour: h })
                            : undefined
                        }
                    >
                        {status === "Boş"
                        ? "Boş"
                        : status === "Dolu"
                        ? "Rezerve"
                        : status === "Kapalı"
                        ? "Kapalı"
                        : "Geçmiş"}
                    </td>
                    );
                })}
                </tr>
            ))}
            </tbody>
        </Table>
        </>
    );
    }
