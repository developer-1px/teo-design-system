import { useState } from 'react';
import { Overlay, OverlayTrigger, OverlayContent } from '../../components/overlay/Overlay';
import { Drawer } from '../../components/overlay/Drawer';


// 1. Popover Demo
export function PopoverDemo() {
    return (
        <div style={{ padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
            <Overlay>
                <OverlayTrigger>
                    <button style={{
                        padding: '8px 16px',
                        background: 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer'
                    }}>
                        Click me (Popover)
                    </button>
                </OverlayTrigger>
                <OverlayContent side="bottom" align="start" sideOffset={8}>
                    <div style={{
                        background: 'white',
                        padding: 16,
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: '1px solid #eee',
                        minWidth: 200
                    }}>
                        <h4 style={{ margin: '0 0 8px' }}>Dimensions</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label>Width: <input placeholder="100%" /></label>
                            <label>Height: <input placeholder="Auto" /></label>
                        </div>
                    </div>
                </OverlayContent>
            </Overlay>
        </div>
    );
}

// 2. Drawer Demo
export function DrawerDemo() {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ padding: 20, border: '1px solid #eee', borderRadius: 8, marginTop: 20 }}>
            <button
                onClick={() => setOpen(true)}
                style={{
                    padding: '8px 16px',
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: 6,
                    cursor: 'pointer'
                }}
            >
                Open Drawer (Modal)
            </button>

            <Drawer isOpen={open} onClose={() => setOpen(false)} title="Settings">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <p>This is a modal drawer using the Overlay Portal system.</p>
                    <p>It blocks the background and focuses on this content.</p>
                    <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
                    <button>Option 1</button>
                    <button>Option 2</button>
                    <button>Option 3</button>
                </div>
            </Drawer>
        </div>
    );
}

// 3. Modal Demo
import { Modal } from '../../components/overlay/Modal';

export function ModalDemo() {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ padding: 20, border: '1px solid #eee', borderRadius: 8, marginTop: 20 }}>
            <button
                onClick={() => setOpen(true)}
                style={{
                    padding: '8px 16px',
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: 6,
                    cursor: 'pointer'
                }}
            >
                Open Modal (Dialog)
            </button>

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Confirm Action"
                footer={
                    <>
                        <button onClick={() => setOpen(false)} style={{ padding: '8px 16px', border: 'none', background: '#eee', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
                        <button onClick={() => setOpen(false)} style={{ padding: '8px 16px', border: 'none', background: 'red', color: 'white', borderRadius: 6, cursor: 'pointer' }}>Delete</button>
                    </>
                }
            >
                <p>Are you sure you want to delete this item?</p>
                <p style={{ fontSize: '0.9em', color: '#666' }}>This action cannot be undone.</p>
            </Modal>
        </div>
    );
}
