import { getDashboardStats, getRecentActivity } from "@/app/actions/dashboard";
import DashboardClient from "@/app/components/DashboardClient";

export default async function Dashboard() {
    const [statsData, activityData] = await Promise.all([
        getDashboardStats(),
        getRecentActivity()
    ]);

    const stats = statsData.success && statsData.data ? {
        totalResources: statsData.data.totalResources,
        activeAllocations: statsData.data.activeAllocations,
        totalUsers: statsData.data.totalUsers,
        maintenanceCount: statsData.data.maintenanceCount,
        bookingStatusData: statsData.data.bookingStatusData || [],
        resourceTypeData: statsData.data.resourceTypeData || [],
        maintenanceStatusData: statsData.data.maintenanceStatusData || [],
    } : {
        totalResources: 0,
        activeAllocations: 0,
        totalUsers: 0,
        maintenanceCount: 0,
        bookingStatusData: [],
        resourceTypeData: [],
        maintenanceStatusData: [],
    };

    const recentActivity = activityData.success ? activityData.data || [] : [];

    return <DashboardClient stats={stats} recentActivity={recentActivity} />;
}
