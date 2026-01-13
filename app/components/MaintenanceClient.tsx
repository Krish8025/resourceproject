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
            case 'Completed': return 'bg-green-100 text-green-700'
            case 'InProgress': return 'bg-blue-100 text-blue-700'
            case 'Scheduled': return 'bg-yellow-100 text-yellow-700'
            default: return 'bg-zinc-100 text-zinc-700'
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Maintenance</h1>
                    <p className="mt-2 text-zinc-500 dark:text-zinc-400">Track cleaning, repairs, and servicing tasks.</p>
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search resources or tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {['All', 'Scheduled', 'InProgress', 'Completed', 'Pending'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-800'
                                }`}
                        >
                            {status === 'InProgress' ? 'In Progress' : status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredRecords.map((record) => (
                    <div key={record.id} className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-900/20`}>
                                    <Wrench className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{record.type}</h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{record.resource.name}</p>
                                </div>
                            </div>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(record.status)}`}>
                                {record.status}
                            </span>
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                                <Clock className="h-4 w-4" />
                                <span>Scheduled: <span className="font-medium text-zinc-900 dark:text-zinc-50">{new Date(record.scheduledDate).toLocaleDateString()}</span></span>
                            </div>
                            {record.notes && (
                                <div className="rounded-lg bg-zinc-50 p-3 text-sm text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400">
                                    {record.notes}
                                </div>
                            )}
                        </div>

                        {canManageMaintenance && record.status !== 'Completed' && (
                            <div className="mt-6 flex items-center gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                                {record.status === 'Scheduled' || record.status === 'Pending' ? (
                                    <button
                                        onClick={() => handleStatusUpdate(record.id, 'InProgress')}
                                        className="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                                    >
                                        Start Work
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleStatusUpdate(record.id, 'Completed')}
                                        className="flex-1 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
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
                    <p className="text-zinc-500 dark:text-zinc-400">No maintenance tasks found matching your criteria.</p>
                </div>
            )}
        </div>
    )
}
