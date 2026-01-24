import React from "react";
import { useHeadlessCalendar } from "../design-system/hooks/data/useHeadlessCalendar";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarApp() {
    const { state, actions, gridProps } = useHeadlessCalendar([
        { id: "1", title: "Meeting", day: 1, hour: 10, duration: 1 }
    ]);

    const { cursor, selection, appointments } = state;
    const { setCursor } = actions;

    return (
        <Frame
            override={{
                p: Space.n20
            }}
            style={{
                width: "100%",
                height: "100%",
                display: "grid",
                gridTemplateColumns: "60px repeat(7, 1fr)",
                gridTemplateRows: "40px repeat(24, 60px)",
                gap: "1px",
                background: "#eee",
                overflow: "auto"
            }}
            {...gridProps}
        >
            {/* Header */}
            <Frame style={{ background: "white" }} />
            {DAYS.map((day) => (
                <Frame
                    key={day}
                    style={{
                        background: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold"
                    }}
                >
                    {day}
                </Frame>
            ))}

            {/* Grid */}
            {HOURS.map((hour) => (
                <React.Fragment key={hour}>
                    {/* Time Label */}
                    <Frame
                        style={{
                            background: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            color: "#888"
                        }}
                    >
                        {hour}:00
                    </Frame>

                    {/* Day Categories */}
                    {DAYS.map((_, dayIndex) => {
                        const isCursor = cursor.row === hour && cursor.col === dayIndex;
                        const isSelected = selection
                            ? dayIndex >= Math.min(selection.start.col, selection.end.col) &&
                            dayIndex <= Math.max(selection.start.col, selection.end.col) &&
                            hour >= Math.min(selection.start.row, selection.end.row) &&
                            hour <= Math.max(selection.start.row, selection.end.row)
                            : false;

                        // Find appointment
                        const appt = appointments.find(a => a.day === dayIndex && a.hour === hour);

                        return (
                            <Frame
                                key={`${dayIndex}-${hour}`}
                                onClick={() => setCursor(hour, dayIndex)}
                                style={{
                                    background: appt ? "#e3f2fd" : (isSelected ? "#e6f7ff" : "white"),
                                    border: isCursor ? "2px solid blue" : "none",
                                    position: "relative",
                                    outline: "none",
                                    cursor: "pointer"
                                }}
                            >
                                {appt && (
                                    <Frame
                                        style={{
                                            position: "absolute",
                                            inset: 2,
                                            background: "#2196f3",
                                            color: "white",
                                            borderRadius: 4,
                                            padding: 4,
                                            fontSize: 12
                                        }}
                                    >
                                        {appt.title}
                                    </Frame>
                                )}
                            </Frame>
                        );
                    })}
                </React.Fragment>
            ))}
        </Frame>
    );
}
