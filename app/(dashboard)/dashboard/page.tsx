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
                <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                <p className="mt-2 text-zinc-400">Overview of your resource management system.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="glass-card group relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
                    >
                        <div className={`absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-${stat.color}-500/20 blur-2xl transition-all group-hover:bg-${stat.color}-500/30`} />

                        <dt className="flex items-center gap-3">
                            <div className={`rounded-xl bg-${stat.color}-500/10 p-2 ring-1 ring-${stat.color}-500/20`}>
                                <stat.icon className={`h-5 w-5 text-${stat.color}-400`} aria-hidden="true" />
                            </div>
                            <p className="text-sm font-medium text-zinc-400">{stat.name}</p>
                        </dt>
                        <dd className="mt-4 flex items-baseline justify-between md:block lg:flex">
                            <div className="flex items-baseline text-3xl font-bold text-white">
                                {stat.value}
                            </div>
                        </dd>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="glass-card col-span-2 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-indigo-400" />
                        Recent Allocations
                    </h2>
                    <div className="space-y-4">
                        {recentActivity && recentActivity.length > 0 ? (
                            recentActivity.map((booking: any) => (
                                <div key={booking.id} className="group flex items-center justify-between rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
                                            {booking.user?.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{booking.resource?.name}</p>
                                            <p className="text-sm text-zinc-400">Reserved by {booking.user?.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-1.5 text-xs text-zinc-500 mb-1.5">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(booking.startDateTime).toLocaleDateString()}
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${booking.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' :
                                            booking.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20' :
                                                'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'
                                            }`}>
                                            <div className={`h-1.5 w-1.5 rounded-full ${booking.status === 'Approved' ? 'bg-emerald-400' :
                                                booking.status === 'Pending' ? 'bg-amber-400' : 'bg-red-400'
                                                } shadow-[0_0_8px_currentColor]`} />
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

                <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <Users className="h-5 w-5 text-violet-400" />
                        Quick Actions
                    </h2>
                    <div className="grid gap-4">
                        <a href="/allocations" className="group flex items-center gap-4 rounded-xl bg-white/5 p-4 transition-all hover:bg-white/10 hover:shadow-lg hover:shadow-indigo-500/10 border border-white/5 hover:border-indigo-500/30">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20 transition-all group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/30">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <div>
                                <span className="block font-medium text-white group-hover:text-indigo-300 transition-colors">New Booking</span>
                                <span className="text-xs text-zinc-500">Schedule a resource</span>
                            </div>
                        </a>
                        <a href="/resources" className="group flex items-center gap-4 rounded-xl bg-white/5 p-4 transition-all hover:bg-white/10 hover:shadow-lg hover:shadow-violet-500/10 border border-white/5 hover:border-violet-500/30">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20 transition-all group-hover:bg-violet-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-violet-500/30">
                                <Box className="h-6 w-6" />
                            </div>
                            <div>
                                <span className="block font-medium text-white group-hover:text-violet-300 transition-colors">Add Resource</span>
                                <span className="text-xs text-zinc-500">Register new equipment</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
