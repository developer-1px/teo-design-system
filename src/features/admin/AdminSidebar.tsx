import { Panel } from '../../components/layout/Panel';
import { LayoutDashboard, Users, Wrench, Settings } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export function AdminSidebar() {
    const location = useLocation();
    const pathname = location.pathname;

    const isActive = (path: string) => {
        if (path === '/admin' && pathname === '/admin') return true;
        if (path !== '/admin' && pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <Panel>
            <Panel.Header title="Fusion Admin" />
            <Panel.Body>
                <Panel.Section label="Overview">
                    <Panel.Item
                        as={Link}
                        to="/admin"
                        icon={LayoutDashboard}
                        active={isActive('/admin')}
                    >
                        Dashboard
                    </Panel.Item>
                </Panel.Section>

                <Panel.Section label="Management">
                    <Panel.Item
                        as={Link}
                        to="/admin/users"
                        icon={Users}
                        active={isActive('/admin/users')}
                    >
                        Users
                    </Panel.Item>
                    <Panel.Item
                        as={Link}
                        to="/admin/builder"
                        icon={Wrench}
                        active={isActive('/admin/builder')}
                    >
                        Builder
                    </Panel.Item>
                </Panel.Section>

                <Panel.Section label="System">
                    <Panel.Item
                        as={Link}
                        to="/admin/settings"
                        icon={Settings}
                        active={isActive('/admin/settings')}
                    >
                        Settings
                    </Panel.Item>
                </Panel.Section>
            </Panel.Body>
        </Panel>
    );
}
