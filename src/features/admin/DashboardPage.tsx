import { Users, DollarSign, Activity, ShoppingCart } from 'lucide-react';
import * as styles from './Dashboard.css';
import { DataTable } from './DataTable'; // Reusing our "Pro" table

export function DashboardPage() {
    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.dashboardHeader}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Overview</h1>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>Welcome back, Administrator</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Actions can go here */}
                </div>
            </header>

            {/* 1. Key Metrics Row */}
            <div className={styles.statsGrid}>
                <StatCard
                    label="Total Revenue"
                    value="$48,290.00"
                    trend="+12.5%"
                    isPositive={true}
                    icon={DollarSign}
                />
                <StatCard
                    label="Active Users"
                    value="2,401"
                    trend="+4.2%"
                    isPositive={true}
                    icon={Users}
                />
                <StatCard
                    label="Bounce Rate"
                    value="42.3%"
                    trend="-2.1%"
                    isPositive={true}
                    icon={Activity}
                />
                <StatCard
                    label="Pending Orders"
                    value="14"
                    trend="-12%"
                    isPositive={false}
                    icon={ShoppingCart}
                />
            </div>

            {/* 2. Main Data Section */}
            <div className={styles.contentSection}>
                <div className={styles.sectionTitle}>Recent Transactions</div>
                {/* 
                  Reusing the 'DataTable' we made earlier but in a "Card" context 
                  to show modularity.
                */}
                <DataTable onRowClick={() => { }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div className={styles.contentSection}>
                    <div className={styles.sectionTitle}>User Growth</div>
                    <div style={{ height: '200px', background: '#fafafa', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '13px' }}>
                        [ Line Chart Placeholder ]
                    </div>
                </div>
                <div className={styles.contentSection}>
                    <div className={styles.sectionTitle}>System Status</div>
                    <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <StatusItem label="Database (Postgres)" status="Operational" />
                        <StatusItem label="Redis Cache" status="Operational" />
                        <StatusItem label="Email Service" status="Degraded" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, trend, isPositive, icon: Icon }: any) {
    return (
        <div className={styles.statCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className={styles.statLabel}>{label}</span>
                <Icon size={16} color="#888" />
            </div>
            <div className={styles.statValue}>{value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className={styles.statTrend} style={{
                    backgroundColor: isPositive ? '#ecfdf5' : '#fef2f2',
                    color: isPositive ? '#059669' : '#dc2626'
                }}>
                    {trend}
                </span>
                <span style={{ fontSize: '11px', color: '#888' }}>vs last month</span>
            </div>
        </div>
    );
}

function StatusItem({ label, status }: { label: string, status: string }) {
    const color = status === 'Operational' ? '#10B981' : '#F59E0B';
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: color }} />
                <span style={{ fontWeight: 500, color: status === 'Operational' ? '#374151' : '#B45309' }}>{status}</span>
            </div>
        </div>
    )
}
