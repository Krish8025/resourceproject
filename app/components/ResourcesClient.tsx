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
    const filteredResources = initialResources.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            await deleteResource(id)
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Resources</h1>
                    <p className="mt-2 text-zinc-500 dark:text-zinc-400">Manage your inventory and assets.</p>
                </div>
                {currentUser?.role === 'admin' && (
                    <button
                        onClick={handleAddNew}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 shadow-sm hover:shadow-md"
                    >
                        <Plus className="h-4 w-4" />
                        Add Resource
                    </button>
                )}
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border-0 bg-transparent py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:ring-0 dark:text-zinc-50 sm:leading-6"
                    />
                </div>
                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
                <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
                    <Filter className="h-4 w-4" />
                    Filter
                </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                        <thead className="border-b border-zinc-200 bg-zinc-50/50 uppercase tracking-wider text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Assignee</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                            {filteredResources.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Search className="h-8 w-8 text-zinc-300" />
                                            <p className="text-base font-medium text-zinc-900 dark:text-zinc-50">No resources found</p>
                                            <p className="text-sm">Try adjusting your search or filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredResources.map((resource: any) => (
                                    <tr key={resource.id} className="hover:bg-zinc-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-zinc-900 dark:text-zinc-50">{resource.name}</div>
                                            {(resource.building || resource.floorNumber) && (
                                                <div className="text-xs text-zinc-500 mt-1">
                                                    {resource.building?.name} {resource.floorNumber ? `• Floor ${resource.floorNumber}` : ''}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                {resource.type.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {currentUser?.role === 'admin' ? (
                                                <select
                                                    value={resource.status} // Use raw status from DB
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
                                                            // You might want to trigger a refresh here or revert logic
                                                        }
                                                    }}
                                                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium border cursor-pointer appearance-none pr-6 bg-[length:12px] bg-[right_0.5rem_center] bg-no-repeat ${resource.status === "Available"
                                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-400"
                                                            : resource.status === "Allocated"
                                                                ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/10 dark:text-blue-400"
                                                                : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-400"
                                                        }`}
                                                    style={{ backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>')` }}
                                                >
                                                    <option value="Available">Available</option>
                                                    <option value="Maintenance">Maintenance</option>
                                                </select>
                                            ) : (
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${resource.computedStatus === "Available"
                                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-400"
                                                            : resource.computedStatus === "Allocated"
                                                                ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/10 dark:text-blue-400"
                                                                : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-400"
                                                        }`}
                                                >
                                                    {resource.computedStatus}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {resource.computedAssignee !== '-' ? (
                                                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50 font-medium">
                                                    <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] text-zinc-600 border border-zinc-200">
                                                        {resource.computedAssignee[0]}
                                                    </div>
                                                    {resource.computedAssignee}
                                                </div>
                                            ) : (
                                                <span className="text-zinc-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3 text-zinc-400">
                                                <button
                                                    onClick={() => handleViewDetails(resource.id)}
                                                    className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                {currentUser?.role === 'admin' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(resource)}
                                                            className="hover:text-indigo-600 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(resource.id)}
                                                            className="hover:text-red-600 transition-colors"
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
