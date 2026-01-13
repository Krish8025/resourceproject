import { Box, Briefcase, Users, AlertCircle, Calendar } from "lucide-react";
import { getDashboardStats, getRecentActivity } from "@/app/actions/dashboard";

export default async function Dashboard() {
    const statsData = await getDashboardStats();
    const activityData = await getRecentActivity();

    const stats = [
        {
            name: "Total Resources",
            value: statsData.success ? statsData.data?.totalResources : "-",
            icon: Box,
            color: "blue"
        },
        {
            name: "Active Allocations",
            value: statsData.success ? statsData.data?.activeAllocations : "-",
            icon: Briefcase,
            color: "green"
        },
        {
            name: "Total Users",
            value: statsData.success ? statsData.data?.totalUsers : "-",
            icon: Users,
            color: "purple"
        },
        {
            name: "Maintenance Needed",
            value: statsData.success ? statsData.data?.maintenanceCount : "-",
            icon: AlertCircle,
            color: "orange"
        },
    ];

    const recentActivity = activityData.success ? activityData.data : [];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">Overview of your resource management system.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                    >
                        <div className={`absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-${stat.color}-500/10 blur-2xl transition-all group-hover:bg-${stat.color}-500/20`} />

                        <dt className="flex items-center gap-3">
                            <div className={`rounded-lg bg-${stat.color}-50 p-2 dark:bg-${stat.color}-900/30`}>
                                <stat.icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} aria-hidden="true" />
                            </div>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.name}</p>
                        </dt>
                        <dd className="mt-4 flex items-baseline justify-between md:block lg:flex">
                            <div className="flex items-baseline text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                {stat.value}
                            </div>
                        </dd>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
                    <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-4">Recent Allocations</h2>
                    <div className="space-y-4">
                        {recentActivity && recentActivity.length > 0 ? (
                            recentActivity.map((booking: any) => (
                                <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                            {booking.user?.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-zinc-900 dark:text-zinc-50">{booking.resource?.name}</p>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Reserved by {booking.user?.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(booking.startDateTime).toLocaleDateString()}
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${booking.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-500 text-center py-8">No recent activity found.</p>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
                    <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <a href="/allocations" className="flex flex-col items-center justify-center p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                            <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                            <span className="font-medium text-zinc-900 dark:text-zinc-50">New Booking</span>
                        </a>
                        <a href="/resources" className="flex flex-col items-center justify-center p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                            <Box className="h-8 w-8 text-purple-500 mb-2" />
                            <span className="font-medium text-zinc-900 dark:text-zinc-50">Add Resource</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
