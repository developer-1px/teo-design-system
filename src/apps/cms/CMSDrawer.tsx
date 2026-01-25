import { ChevronRight, X } from "lucide-react";
import "./CMSApp.legacy.css";

export function CMSDrawer({ onClose }: { onClose: () => void }) {
  return (
    <>
      {/* Drawer Overlay/Container */}
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100vh',
          zIndex: 301,
          animation: 'slideInRight 0.3s ease-out',
          display: 'flex'
        }}
      >
        <div style={{
          width: 512,
          height: '100%',
          backgroundColor: 'var(--surface-base)',
          borderLeft: '1px solid var(--border-color)',
          boxShadow: 'var(--elevation-n5)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            height: 48,
            padding: '0 16px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Options
            </span>
            <button className="icon-btn" onClick={onClose}>
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <InspectorSection title="General Settings">
              <PropertyRow
                label="Auto-Save"
                value="On"
                type="toggle"
                badge="success"
              />
              <PropertyRow label="Dark Mode" value="System" />
            </InspectorSection>
            <InspectorSection title="Advanced">
              <PropertyRow label="Debug Mode" value="Off" />
              <PropertyRow label="API Key" value="sk-..." />
            </InspectorSection>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}
      </style>
    </>
  );
}

// Reuse Inspector Components (In a real app, these would be shared)
function InspectorSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ borderBottom: '1px solid var(--border-color)' }}>
      <div style={{
        padding: 12, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none'
      }}>
        <span style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7 }}>
          {title}
        </span>
        <ChevronRight size={12} style={{ opacity: 0.5, transform: "rotate(90deg)" }} />
      </div>
      <div style={{ padding: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>{children}</div>
    </div>
  );
}

function PropertyRow({ label, value, badge, multiline }: any) {
  return (
    <div style={{
      padding: 8,
      minHeight: multiline ? 'auto' : 32,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }}>
      <span style={{ width: 120, fontSize: 13, color: "var(--text-secondary)" }}>
        {label}
      </span>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        {badge ? (
          <div style={{
            padding: '2px 6px',
            borderRadius: 4,
            background: "var(--color-success-dim)",
            color: "var(--color-success)",
            fontSize: 11,
            fontWeight: 'bold'
          }}
          >
            {value}
          </div>
        ) : (
          <span style={{ fontSize: 13, color: "var(--text-primary)", textAlign: "right" }}>
            {value}
          </span>
        )}
      </div>
    </div>
  );
}
