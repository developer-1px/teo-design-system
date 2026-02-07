export const overlayContainer = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none' as const,
    zIndex: 9999,
};

export const violationBox = {
    position: 'absolute' as const,
    border: '2px solid #ff0000',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    pointerEvents: 'auto' as const,
    cursor: 'help' as const,
};

export const violationLabel = {
    position: 'absolute' as const,
    top: '-24px',
    left: '-2px',
    backgroundColor: '#ff0000',
    color: '#fff',
    padding: '2px 6px',
    fontSize: '11px',
    fontWeight: 'bold' as const,
    borderRadius: '4px',
    whiteSpace: 'nowrap' as const,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
};

export const statusPanel = {
    position: 'fixed' as const,
    bottom: 12,
    right: 12,
    background: '#18181b',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
    pointerEvents: 'auto' as const,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    border: '1px solid #27272a',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: 'Inter, system-ui, sans-serif',
};

export const checkboxLabel = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    userSelect: 'none' as const,
};

export const checkboxInput = {
    cursor: 'pointer',
    accentColor: '#3b82f6',
};
