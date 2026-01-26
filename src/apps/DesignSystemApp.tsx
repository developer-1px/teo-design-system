import React from "react";
import { Book } from "lucide-react";

export function DesignSystemApp() {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            fontFamily: "sans-serif",
            color: "#666"
        }}>
            <Book size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
            <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>Legacy Design System Removed</h1>
            <p>The legacy design system documentation is no longer available.</p>
        </div>
    );
}
