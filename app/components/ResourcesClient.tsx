'use client'

import { useState } from 'react'
import { Search, Eye, Pencil, Trash2, Plus, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react'
import { deleteResource } from '../actions/resources'
import { updateResourceStatus } from '../actions/updateResourceStatus'
import ResourceForm from './ResourceForm'
import ResourceDetailsModal from './ResourceDetailsModal'

const RESOURCE_STATUSES = ['Available', 'Allocated', 'Maintenance', 'Unavailable']

export default function ResourcesClient({ initialResources, types, buildings, users, currentUser }: { initialResources: any[], types: any[], buildings: any[], users: any[], currentUser?: any }) {
    const [resources, setResources] = useState(initialResources)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortField, setSortField] = useState('name')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [showForm, setShowForm] = useState(false)
    const [editResource, setEditResource] = useState<any>(null)
    const [viewResource, setViewResource] = useState<any>(null)
    const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null)

    const isAdmin = currentUser?.role === 'admin'

    const filteredResources = resources
        .filter(resource =>
            resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.type?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.building?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            let aVal = '', bVal = ''
            if (sortField === 'name') { aVal = a.name; bVal = b.name }
            else if (sortField === 'type') { aVal = a.type?.name || ''; bVal = b.type?.name || '' }
            else if (sortField === 'building') { aVal = a.building?.name || ''; bVal = b.building?.name || '' }
            else if (sortField === 'status') { aVal = a.computedStatus || a.status || ''; bVal = b.computedStatus || b.status || '' }
            return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        })

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            const result = await deleteResource(id)
            if (result.success) {
                setResources(resources.filter(r => r.id !== id))
            }
        }
    }

    const handleStatusChange = async (resourceId: number, newStatus: string) => {
        setUpdatingStatusId(resourceId)
        const result = await updateResourceStatus(resourceId, newStatus)
        if (result.success) {
            setResources(prev => prev.map(r =>
                r.id === resourceId ? { ...r, status: newStatus, computedStatus: newStatus } : r
            ))
        }
        setUpdatingStatusId(null)
    }

    const SortIcon = ({ field }: { field: string }) => {
        if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
        return sortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Available': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20'
            case 'Allocated':
            case 'In Use': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20'
            case 'Maintenance': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20'
            case 'Unavailable': return 'bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20'
            default: return 'bg-[var(--badge-bg)] text-muted-foreground ring-1 ring-border'
        }
    }

    const getDropdownBorderColor = (status: string) => {
        switch (status) {
            case 'Available': return 'border-emerald-500/30 focus:ring-emerald-500/30'
            case 'Allocated':
            case 'In Use': return 'border-blue-500/30 focus:ring-blue-500/30'
            case 'Maintenance': return 'border-amber-500/30 focus:ring-amber-500/30'
            case 'Unavailable': return 'border-red-500/30 focus:ring-red-500/30'
            default: return 'border-border focus:ring-primary/30'
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Resources</h1>
                    <p className="mt-2 text-muted-foreground">Manage equipment, rooms, and facilities.</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => { setEditResource(null); setShowForm(true) }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1d9bf0] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#1d9bf0]/20 transition-all hover:scale-105 hover:shadow-[#1d9bf0]/30 hover:bg-[#1a8cd8]"
                    >
                        <Plus className="h-4 w-4" />
                        Add Resource
                    </button>
                )}
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-1">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border-0 bg-transparent py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-0 sm:leading-6"
                    />
                </div>
            </div>

            <div className="glass-card overflow-hidden rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[var(--table-header-bg)] uppercase tracking-wider text-xs font-medium text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('name')}>
                                    <span className="flex items-center gap-1.5">Name <SortIcon field="name" /></span>
                                </th>
                                <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('type')}>
                                    <span className="flex items-center gap-1.5">Type <SortIcon field="type" /></span>
                                </th>
                                <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('building')}>
                                    <span className="flex items-center gap-1.5">Building <SortIcon field="building" /></span>
                                </th>
                                <th className="px-6 py-4">Floor</th>
                                <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('status')}>
                                    <span className="flex items-center gap-1.5">Status <SortIcon field="status" /></span>
                                </th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredResources.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Search className="h-8 w-8 text-muted-foreground/50" />
                                            <p className="text-base font-medium text-foreground">No resources found</p>
                                            <p className="text-sm">Try adjusting your search</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredResources.map(resource => {
                                    const displayStatus = resource.computedStatus || resource.status || 'Available'
                                    return (
                                        <tr key={resource.id} className="group hover:bg-[var(--hover)] transition-colors">
                                            <td className="px-6 py-4 font-medium text-foreground">{resource.name}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{resource.type?.name}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{resource.building?.name}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{resource.floorNumber ?? '-'}</td>
                                            <td className="px-6 py-4">
                                                {isAdmin ? (
                                                    <select
                                                        value={displayStatus}
                                                        onChange={(e) => handleStatusChange(resource.id, e.target.value)}
                                                        disabled={updatingStatusId === resource.id}
                                                        className={`rounded-full px-3 py-1.5 text-xs font-medium border cursor-pointer transition-all focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-wait ${getStatusColor(displayStatus)} ${getDropdownBorderColor(displayStatus)} bg-transparent appearance-none pr-7`}
                                                        style={{
                                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                                            backgroundPosition: 'right 0.25rem center',
                                                            backgroundRepeat: 'no-repeat',
                                                            backgroundSize: '1.25em 1.25em'
                                                        }}
                                                    >
                                                        {RESOURCE_STATUSES.map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(displayStatus)}`}>
                                                        {displayStatus}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => setViewResource(resource)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-[#1d9bf0] transition-colors" title="View details">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    {isAdmin && (
                                                        <>
                                                            <button onClick={() => { setEditResource(resource); setShowForm(true) }} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-amber-500 transition-colors" title="Edit">
                                                                <Pencil className="h-4 w-4" />
                                                            </button>
                                                            <button onClick={() => handleDelete(resource.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <ResourceForm
                    resource={editResource}
                    types={types}
                    buildings={buildings}
                    users={users}
                    onClose={() => { setShowForm(false); setEditResource(null); window.location.reload() }}
                />
            )}

            {viewResource && (
                <ResourceDetailsModal
                    resource={viewResource}
                    onClose={() => setViewResource(null)}
                />
            )}
        </div>
    )
}
