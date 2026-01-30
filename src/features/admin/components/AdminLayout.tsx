import { Outlet } from 'react-router-dom';
import { Shell } from '../../../components/layout/Shell';
import { TopBar } from '../../../components/layout/TopBar';
import { AdminSidebar } from './AdminSidebar';
import { Button } from '../../../components/primitives/Button'; // Assuming Button exists from previous tasks
import { Bell, Search, User } from 'lucide-react';
import { PanelGroup, Panel, PanelHandle } from '../../../components/ui/Resizable';

export function AdminLayout() {
    return (
        <Shell>
            {/* Navbar remains global */}
            <Shell.Navbar>
                <TopBar
                    left={<div style={{ fontWeight: 500 }}>Admin</div>} // Placeholder for Breadcrumbs
                    center={
                        <Button variant="outline" size="sm" leftIcon={<Search size={16} />} style={{ width: '300px', justifyContent: 'flex-start', color: '#888' }}>
                            Search...
                        </Button>
                    }
                    right={
                        <>
                            <Button variant="ghost" size="icon"><Bell size={18} /></Button>
                            <Button variant="ghost" size="icon"><User size={18} /></Button>
                        </>
                    }
                />
            </Shell.Navbar>

            {/* Split Main area into Sidebar + Content */}
            <Shell.Main>
                <PanelGroup direction="horizontal">
                    <Panel defaultSize={20} id="admin-sidebar">
                        <AdminSidebar />
                    </Panel>

                    <PanelHandle id="handle-0" />

                    <Panel defaultSize={80} id="admin-content">
                        <Outlet />
                    </Panel>
                </PanelGroup>
            </Shell.Main>
        </Shell>
    );
}
