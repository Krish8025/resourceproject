'use client'

import { motion } from 'framer-motion'
import {
    Box, Briefcase, Users, AlertCircle, Calendar, TrendingUp,
    ArrowUpRight, Activity, Zap
} from 'lucide-react'
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, Legend, CartesianGrid
} from 'recharts'

type DashboardClientProps = {
    stats: {
        totalResources: number
        activeAllocations: number
        totalUsers: number
        maintenanceCount: number
        bookingStatusData: { name: string; value: number }[]
        resourceTypeData: { name: string; value: number }[]
        maintenanceStatusData: { name: string; value: number }[]
    }
    recentActivity: any[]
}

const CHART_COLORS = ['#1d9bf0', '#1da1f2', '#794bc4', '#f91880', '#00ba7c', '#ff7a00', '#ffd400']
const STATUS_COLORS: Record<string, string> = {
    Approved: '#00ba7c',
    Pending: '#ffd400',
    Rejected: '#f4212e',
    Completed: '#1d9bf0',
    InProgress: '#794bc4',
    Scheduled: '#ff7a00',
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const statCards = [
    {
        key: 'totalResources',
        label: 'Total Resources',
        icon: Box,
        gradient: 'from-blue-500 to-cyan-400',
        shadowColor: 'shadow-blue-500/25',
        bgGlow: 'bg-blue-500',
        iconBg: 'bg-blue-500/10',
        textColor: 'text-blue-500',
    },
    {
        key: 'activeAllocations',
        label: 'Active Allocations',
        icon: Briefcase,
        gradient: 'from-emerald-500 to-teal-400',
        shadowColor: 'shadow-emerald-500/25',
        bgGlow: 'bg-emerald-500',
        iconBg: 'bg-emerald-500/10',
        textColor: 'text-emerald-500',
    },
    {
        key: 'totalUsers',
        label: 'Total Users',
        icon: Users,
        gradient: 'from-purple-500 to-pink-400',
        shadowColor: 'shadow-purple-500/25',
        bgGlow: 'bg-purple-500',
        iconBg: 'bg-purple-500/10',
        textColor: 'text-purple-500',
    },
    {
        key: 'maintenanceCount',
        label: 'Maintenance',
        icon: AlertCircle,
        gradient: 'from-orange-500 to-amber-400',
        shadowColor: 'shadow-orange-500/25',
        bgGlow: 'bg-orange-500',
        iconBg: 'bg-orange-500/10',
        textColor: 'text-orange-500',
    },
]

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl border border-border bg-card p-3 shadow-xl">
            <p className="text-xs font-medium text-muted-foreground mb-1">{label || payload[0]?.name}</p>
            <p className="text-sm font-bold text-foreground">{payload[0]?.value}</p>
        </div>
    )
}

export default function DashboardClient({ stats, recentActivity }: DashboardClientProps) {
    const bookingData = stats.bookingStatusData?.length > 0
        ? stats.bookingStatusData.map(d => ({ ...d, fill: STATUS_COLORS[d.name] || '#1d9bf0' }))
        : [{ name: 'No Data', value: 1, fill: '#38444d' }]

    const totalBookings = stats.bookingStatusData?.reduce((sum, d) => sum + d.value, 0) || 0

    return (
        <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1d9bf0] to-[#794bc4] shadow-lg shadow-[#1d9bf0]/25">
                            <Activity className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    </div>
                    <p className="mt-1 text-muted-foreground ml-[52px]">Real-time overview of your resource management system</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 ring-1 ring-emerald-500/20">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#00ba7c]" />
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">System Online</span>
                </div>
            </motion.div>

            {/* Stat Cards */}
            <motion.div variants={itemVariants} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card, i) => {
                    const Icon = card.icon
                    const value = stats[card.key as keyof typeof stats]
                    return (
                        <motion.div
                            key={card.key}
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-xl ${card.shadowColor}`}
                        >
                            {/* Glow */}
                            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${card.bgGlow} opacity-10 blur-2xl transition-all group-hover:opacity-20`} />
                            <div className={`absolute -right-3 -top-3 h-12 w-12 rounded-full ${card.bgGlow} opacity-5 blur-xl`} />

                            <div className="relative z-10 flex items-center justify-between">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg} ring-1 ring-current/10 ${card.textColor}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="relative z-10 mt-4">
                                <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                                <p className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
                                    {typeof value === 'number' ? value : '-'}
                                </p>
                            </div>

                            {/* Bottom accent line */}
                            <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                        </motion.div>
                    )
                })}
            </motion.div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Booking Status Pie Chart */}
                <motion.div variants={itemVariants} className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1d9bf0]/10">
                                <Briefcase className="h-4 w-4 text-[#1d9bf0]" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-foreground">Booking Status</h3>
                                <p className="text-xs text-muted-foreground">{totalBookings} total bookings</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={bookingData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={95}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {bookingData.map((entry, index) => (
                                        <Cell key={index} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value: string) => (
                                        <span className="text-xs text-muted-foreground ml-1">{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Resource Type Bar Chart */}
                <motion.div variants={itemVariants} className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
                                <TrendingUp className="h-4 w-4 text-purple-500" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-foreground">Resources by Type</h3>
                                <p className="text-xs text-muted-foreground">{stats.totalResources} total resources</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.resourceTypeData} barCategoryGap="20%">
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                                    axisLine={{ stroke: 'var(--border)' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--hover)', radius: 8 }} />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                    {stats.resourceTypeData?.map((_, i) => (
                                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Section: Recent Activity + Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Activity */}
                <motion.div variants={itemVariants} className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1d9bf0]/10">
                                <Calendar className="h-4 w-4 text-[#1d9bf0]" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
                                <p className="text-xs text-muted-foreground">Latest booking updates</p>
                            </div>
                        </div>
                        <a href="/allocations" className="text-xs font-medium text-[#1d9bf0] hover:underline">View all →</a>
                    </div>
                    <div className="space-y-3">
                        {recentActivity && recentActivity.length > 0 ? (
                            recentActivity.map((booking: any, index: number) => (
                                <motion.div
                                    key={booking.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group flex items-center justify-between rounded-xl p-4 transition-all hover:bg-secondary/50 border border-transparent hover:border-border"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1d9bf0] to-[#794bc4] text-sm font-bold text-white shadow-lg shadow-[#1d9bf0]/20">
                                                {booking.user?.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${booking.status === 'Approved' ? 'bg-emerald-500' : booking.status === 'Pending' ? 'bg-amber-400' : 'bg-red-500'}`} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground text-sm">{booking.resource?.name}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">by {booking.user?.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1.5">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${booking.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                                booking.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                                    'bg-red-500/10 text-red-600 dark:text-red-400'
                                            }`}>
                                            <div className={`h-1.5 w-1.5 rounded-full ${booking.status === 'Approved' ? 'bg-emerald-500' :
                                                    booking.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
                                                }`} />
                                            {booking.status}
                                        </span>
                                        <span className="text-[11px] text-muted-foreground">
                                            {new Date(booking.startDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Calendar className="h-10 w-10 text-muted-foreground/40 mb-3" />
                                <p className="text-sm text-muted-foreground">No recent activity</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Quick Actions + Maintenance Overview */}
                <motion.div variants={itemVariants} className="space-y-6">
                    {/* Quick Actions */}
                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                                <Zap className="h-4 w-4 text-amber-500" />
                            </div>
                            <h3 className="text-base font-semibold text-foreground">Quick Actions</h3>
                        </div>
                        <div className="space-y-3">
                            <a href="/allocations" className="group flex items-center gap-4 rounded-xl p-4 transition-all bg-gradient-to-r from-[#1d9bf0]/5 to-transparent border border-[#1d9bf0]/10 hover:border-[#1d9bf0]/30 hover:from-[#1d9bf0]/10 hover:shadow-lg hover:shadow-[#1d9bf0]/10">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1d9bf0] text-white shadow-lg shadow-[#1d9bf0]/25 group-hover:scale-110 transition-transform">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="block text-sm font-medium text-foreground">New Booking</span>
                                    <span className="text-[11px] text-muted-foreground">Schedule a resource</span>
                                </div>
                            </a>
                            <a href="/resources" className="group flex items-center gap-4 rounded-xl p-4 transition-all bg-gradient-to-r from-purple-500/5 to-transparent border border-purple-500/10 hover:border-purple-500/30 hover:from-purple-500/10 hover:shadow-lg hover:shadow-purple-500/10">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500 text-white shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
                                    <Box className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="block text-sm font-medium text-foreground">Add Resource</span>
                                    <span className="text-[11px] text-muted-foreground">Register equipment</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Maintenance Mini Overview */}
                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
                                <AlertCircle className="h-4 w-4 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-foreground">Maintenance</h3>
                                <p className="text-xs text-muted-foreground">Current status</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {stats.maintenanceStatusData?.length > 0 ? (
                                stats.maintenanceStatusData.map((item, i) => {
                                    const total = stats.maintenanceStatusData.reduce((s, d) => s + d.value, 0)
                                    const pct = total > 0 ? Math.round((item.value / total) * 100) : 0
                                    const color = STATUS_COLORS[item.name] || CHART_COLORS[i]
                                    return (
                                        <div key={item.name} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground font-medium">{item.name}</span>
                                                <span className="font-bold text-foreground">{item.value}</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                                <motion.div
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: color }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No maintenance records</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
