'use client'

import { useState } from 'react'
import { Search, Filter, Wrench, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { updateMaintenanceStatus } from '../actions/maintenance'

export default function MaintenanceClient({ initialRecords, currentUser }: { initialRecords: any[], currentUser?: any }) {
    const [records, setRecords] = useState(initialRecords)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')

    const filteredRecords = records.filter(record => {
        const matchesSearch =
            record.resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.notes?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'All' || record.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        if (confirm(`Change status to ${newStatus}?`)) {
            const result = await updateMaintenanceStatus(id, newStatus)
            if (result.success) {
                setRecords(records.map(r =>
                    r.id === id ? { ...r, status: newStatus } : r
                ))
            }
        }
    }

    const canManageMaintenance = currentUser?.role === 'admin' || currentUser?.role === 'maintenance'

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            case 'InProgress': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
            case 'Scheduled': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            default: return 'bg-[var(--badge-bg)] text-muted-foreground'
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Maintenance</h1>
                    <p className="mt-2 text-muted-foreground">Track cleaning, repairs, and servicing tasks.</p>
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search resources or tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#1d9bf0] focus:outline-none focus:ring-1 focus:ring-[#1d9bf0]"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {['All', 'Scheduled', 'InProgress', 'Completed', 'Pending'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === status
                                ? 'bg-[#1d9bf0] text-white'
                                : 'bg-card text-muted-foreground hover:bg-secondary border border-border'
                                }`}
                        >
                            {status === 'InProgress' ? 'In Progress' : status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredRecords.map((record) => (
                    <div key={record.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                                    <Wrench className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{record.type}</h3>
                                    <p className="text-sm text-muted-foreground">{record.resource.name}</p>
                                </div>
                            </div>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(record.status)}`}>
                                {record.status}
                            </span>
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>Scheduled: <span className="font-medium text-foreground">{new Date(record.scheduledDate).toLocaleDateString()}</span></span>
                            </div>
                            {record.notes && (
                                <div className="rounded-lg bg-secondary p-3 text-sm text-muted-foreground">
                                    {record.notes}
                                </div>
                            )}
                        </div>

                        {canManageMaintenance && record.status !== 'Completed' && (
                            <div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
                                {record.status === 'Scheduled' || record.status === 'Pending' ? (
                                    <button
                                        onClick={() => handleStatusUpdate(record.id, 'InProgress')}
                                        className="flex-1 rounded-lg bg-[#1d9bf0]/10 px-3 py-2 text-sm font-medium text-[#1d9bf0] hover:bg-[#1d9bf0]/20 transition-colors"
                                    >
                                        Start Work
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleStatusUpdate(record.id, 'Completed')}
                                        className="flex-1 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                    >
                                        Mark Complete
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredRecords.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No maintenance tasks found matching your criteria.</p>
                </div>
            )}
        </div>
    )
}
