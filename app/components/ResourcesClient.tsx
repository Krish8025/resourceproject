'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Trash2, Pencil, Eye } from 'lucide-react'
import ResourceForm from './ResourceForm'
import ResourceDetailsModal from './ResourceDetailsModal'
import { deleteResource } from '../actions/resources'
import { getResourceDetails } from '../actions/resource-details'

export default function ResourcesClient({ initialResources, types, buildings, users, currentUser }: { initialResources: any[], types: any[], buildings: any[], users: any[], currentUser?: any }) {
    const [resources, setResources] = useState(initialResources)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingResource, setEditingResource] = useState<any>(null)
    const [viewingResource, setViewingResource] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState('')

    // Client-side filtering
    const filteredResources = resources.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            await deleteResource(id)
            setResources(resources.filter(r => r.id !== id))
        }
    }

    const handleEdit = (resource: any) => {
        setEditingResource(resource)
        setIsFormOpen(true)
    }

    const handleAddNew = () => {
        setEditingResource(null)
        setIsFormOpen(true)
    }

    const handleViewDetails = async (id: number) => {
        const result = await getResourceDetails(id)
        if (result.success) {
            setViewingResource(result.data)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Resources</h1>
                    <p className="mt-2 text-zinc-400">Manage your inventory and assets.</p>
                </div>
                {currentUser?.role === 'admin' && (
                    <button
                        onClick={handleAddNew}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 hover:shadow-indigo-500/30"
                    >
                        <Plus className="h-4 w-4" />
                        Add Resource
                    </button>
                )}
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-1 glass backdrop-blur-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border-0 bg-transparent py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:ring-0 sm:leading-6"
                    />
                </div>
                <div className="h-6 w-px bg-white/10" />
                <button className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                    <Filter className="h-4 w-4" />
                    Filter
                </button>
            </div>

            <div className="glass-card overflow-hidden rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-white/5 uppercase tracking-wider text-xs font-medium text-zinc-500">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Assignee</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredResources.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Search className="h-8 w-8 text-zinc-600" />
                                            <p className="text-base font-medium text-white">No resources found</p>
                                            <p className="text-sm">Try adjusting your search or filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredResources.map((resource: any) => (
                                    <tr key={resource.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white text-base">{resource.name}</div>
                                            {(resource.building || resource.floorNumber) && (
                                                <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5">
                                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-700"></span>
                                                    {resource.building?.name} {resource.floorNumber ? `• Floor ${resource.floorNumber}` : ''}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-lg bg-zinc-800/50 px-2.5 py-1 text-xs font-medium text-zinc-300 ring-1 ring-white/10">
                                                {resource.type.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {currentUser?.role === 'admin' ? (
                                                <div className="relative inline-block">
                                                    <select
                                                        value={resource.status}
                                                        onChange={async (e) => {
                                                            const newStatus = e.target.value;
                                                            // Optimistic update
                                                            const updatedResources = resources.map((r: any) =>
                                                                r.id === resource.id ? { ...r, status: newStatus, computedStatus: newStatus } : r
                                                            );
                                                            setResources(updatedResources);

                                                            const { updateResourceStatus } = await import('@/app/actions/updateResourceStatus');
                                                            const result = await updateResourceStatus(resource.id, newStatus);

                                                            if (!result.success) {
                                                                // Revert on failure
                                                                alert('Failed to update status');
                                                            }
                                                        }}
                                                        className={`appearance-none rounded-full pl-3 pr-8 py-1 text-xs font-medium border-0 cursor-pointer transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 outline-none ${resource.status === "Available"
                                                                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 hover:bg-emerald-500/20 focus:ring-emerald-500/50"
                                                                : resource.status === "Allocated"
                                                                    ? "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20 hover:bg-blue-500/20 focus:ring-blue-500/50"
                                                                    : "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20 hover:bg-amber-500/20 focus:ring-amber-500/50"
                                                            }`}
                                                        style={{ backgroundImage: 'none' }}
                                                    >
                                                        <option value="Available" className="bg-zinc-900 text-zinc-300">Available</option>
                                                        <option value="Maintenance" className="bg-zinc-900 text-zinc-300">Maintenance</option>
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                                        <svg className={`h-3 w-3 ${resource.status === "Available" ? "text-emerald-500" :
                                                                resource.status === "Allocated" ? "text-blue-500" : "text-amber-500"
                                                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border-0 ${resource.computedStatus === "Available"
                                                            ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                                                            : resource.computedStatus === "Allocated"
                                                                ? "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20"
                                                                : "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20"
                                                        }`}
                                                >
                                                    <span className={`h-1.5 w-1.5 rounded-full ${resource.computedStatus === "Available" ? "bg-emerald-400" :
                                                            resource.computedStatus === "Allocated" ? "bg-blue-400" : "bg-amber-400"
                                                        } shadow-[0_0_8px_currentColor]`} />
                                                    {resource.computedStatus}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {resource.computedAssignee !== '-' ? (
                                                <div className="flex items-center gap-2 text-white font-medium">
                                                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[10px] text-white shadow-md">
                                                        {resource.computedAssignee[0]}
                                                    </div>
                                                    {resource.computedAssignee}
                                                </div>
                                            ) : (
                                                <span className="text-zinc-600">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleViewDetails(resource.id)}
                                                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                {currentUser?.role === 'admin' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(resource)}
                                                            className="p-2 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(resource.id)}
                                                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isFormOpen && (
                <ResourceForm
                    resource={editingResource}
                    types={types}
                    buildings={buildings}
                    users={users}
                    onClose={() => setIsFormOpen(false)}
                />
            )}

            {viewingResource && (
                <ResourceDetailsModal
                    resource={viewingResource}
                    onClose={() => setViewingResource(null)}
                />
            )}
        </div>
    )
}
