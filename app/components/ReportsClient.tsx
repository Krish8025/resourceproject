'use client'

import { PieChart, BarChart, FileText } from 'lucide-react'

export default function ReportsClient({ reportData, currentUser }: { reportData: any, currentUser?: any }) {
    if (!reportData) {
        return <div className="p-8 text-center text-muted-foreground">Failed to load reports.</div>
    }

    const { bookingsByStatus, maintenanceByStatus, resourceUsage } = reportData

    // Calculate totals for percentages
    const totalBookings = bookingsByStatus.reduce((acc: number, curr: any) => acc + curr._count.id, 0)
    const totalMaintenance = maintenanceByStatus.reduce((acc: number, curr: any) => acc + curr._count.id, 0)
    const maxUsage = Math.max(...resourceUsage.map((r: any) => r.count))

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports</h1>
                <p className="mt-2 text-muted-foreground">System usage and performance analytics.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Booking Status Report */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1d9bf0]/10 text-[#1d9bf0]">
                            <PieChart className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Booking Status</h3>
                            <p className="text-sm text-muted-foreground">Distribution of requests</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {bookingsByStatus.map((item: any) => {
                            const percentage = Math.round((item._count.id / totalBookings) * 100) || 0
                            return (
                                <div key={item.status}>
                                    <div className="mb-1 flex justify-between text-sm">
                                        <span className="font-medium text-foreground">{item.status}</span>
                                        <span className="text-muted-foreground">{item._count.id} ({percentage}%)</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                        <div
                                            className={`h-full rounded-full transition-all ${item.status === 'Approved' ? 'bg-emerald-500' :
                                                item.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                        {bookingsByStatus.length === 0 && <p className="text-sm text-muted-foreground italic">No booking data available.</p>}
                    </div>
                </div>

                {/* Maintenance Status Report */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                            <BarChart className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Maintenance Overview</h3>
                            <p className="text-sm text-muted-foreground">Task completion status</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {maintenanceByStatus.map((item: any) => {
                            const percentage = Math.round((item._count.id / totalMaintenance) * 100) || 0
                            return (
                                <div key={item.status}>
                                    <div className="mb-1 flex justify-between text-sm">
                                        <span className="font-medium text-foreground">{item.status}</span>
                                        <span className="text-muted-foreground">{item._count.id} ({percentage}%)</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                        <div
                                            className={`h-full rounded-full transition-all ${item.status === 'Completed' ? 'bg-[#1d9bf0]' :
                                                item.status === 'InProgress' ? 'bg-[#1d9bf0]/60' : 'bg-[#1d9bf0]/30'
                                                }`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                        {maintenanceByStatus.length === 0 && <p className="text-sm text-muted-foreground italic">No maintenance data available.</p>}
                    </div>
                </div>

                {/* Top Resources Report */}
                <div className="col-span-1 md:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Top Utilized Resources</h3>
                            <p className="text-sm text-muted-foreground">Most frequently booked items</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {resourceUsage.map((item: any) => {
                            const percentage = Math.round((item.count / maxUsage) * 100) || 0
                            return (
                                <div key={item.name} className="flex items-center gap-4">
                                    <div className="w-48 shrink-0 text-sm font-medium text-foreground truncate">
                                        {item.name}
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-8 w-full overflow-hidden rounded-lg bg-secondary relative">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-purple-500/20 rounded-lg transition-all"
                                                style={{ width: `${percentage}%` }}
                                            />
                                            <div className="absolute inset-0 flex items-center px-3 text-xs font-semibold text-purple-600 dark:text-purple-400">
                                                {item.count} bookings
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        {resourceUsage.length === 0 && <p className="text-sm text-muted-foreground italic">No usage data available.</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}
