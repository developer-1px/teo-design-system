import { Outlet } from 'react-router-dom';
import { Shell } from '../../components/layout/Shell';
import { TopBar } from '../../components/layout/TopBar';
import { AdminSidebar } from './AdminSidebar';
import { Button } from '../../components/ui/Button'; // Assuming Button exists from previous tasks
import { Bell, Search, User } from 'lucide-react';

export function AdminLayout() {
    return (
        <Shell>
            <Shell.Sidebar>
                <AdminSidebar />
            </Shell.Sidebar>

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

            <Shell.Main>
                <Outlet />
            </Shell.Main>
        </Shell>
    );
}
