'use client'

import { useState } from 'react'
import { createResource, updateResource } from '../actions/resources'
import { Loader2, X, Plus, Trash2 } from 'lucide-react'

type ResourceFormProps = {
    resource?: any
    types: any[]
    buildings: any[]
    users: any[]
    onClose: () => void
}

export default function ResourceForm({ resource, types, buildings, users, onClose }: ResourceFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [facilities, setFacilities] = useState<{ name: string, details: string }[]>(
        resource?.facilities?.map((f: any) => ({ name: f.name, details: f.details || '' })) || []
    )

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError('')

        const data = {
            name: formData.get('name'),
            resourceTypeId: formData.get('resourceTypeId'),
            buildingId: formData.get('buildingId'),
            floorNumber: formData.get('floorNumber'),
            description: formData.get('description'),
            // Facilities data
            facilities: facilities,
            // Allocation data (only for create)
            allocationUserId: formData.get('allocationUserId'),
            allocationStart: formData.get('allocationStart'),
            allocationEnd: formData.get('allocationEnd'),
        }

        try {
            let result
            if (resource) {
                result = await updateResource(resource.id, data)
            } else {
                result = await createResource(data)
            }

            if (result.success) {
                onClose()
            } else {
                setError(result.error || 'Something went wrong')
            }
        } catch (e) {
            setError('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                        {resource ? 'Edit Resource' : 'Add New Resource'}
                    </h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={resource?.name}
                            required
                            className="mt-1 block w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:ring-0 dark:border-zinc-800 dark:text-zinc-50"
                            placeholder="e.g. Dell XPS 15"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Type</label>
                        <select
                            name="resourceTypeId"
                            defaultValue={resource?.resourceTypeId}
                            required
                            className="mt-1 block w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-0 dark:border-zinc-800 dark:text-zinc-50 [&>option]:text-black"
                        >
                            <option value="">Select a type</option>
                            {types.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Building</label>
                            <select
                                name="buildingId"
                                defaultValue={resource?.buildingId}
                                className="mt-1 block w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-0 dark:border-zinc-800 dark:text-zinc-50 [&>option]:text-black"
                            >
                                <option value="">None</option>
                                {buildings.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Floor</label>
                            <input
                                type="number"
                                name="floorNumber"
                                defaultValue={resource?.floorNumber}
                                className="mt-1 block w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-0 dark:border-zinc-800 dark:text-zinc-50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                        <textarea
                            name="description"
                            defaultValue={resource?.description}
                            rows={3}
                            className="mt-1 block w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:ring-0 dark:border-zinc-800 dark:text-zinc-50"
                        />
                    </div>

                    {/* Facilities Section */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Facilities</label>
                            <button
                                type="button"
                                onClick={() => setFacilities([...facilities, { name: '', details: '' }])}
                                className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-500 dark:text-blue-400"
                            >
                                <Plus className="h-3 w-3" />
                                Add Facility
                            </button>
                        </div>
                        <div className="space-y-3">
                            {facilities.map((facility, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Facility Name (e.g. Projector)"
                                            value={facility.name}
                                            onChange={(e) => {
                                                const newFacilities = [...facilities]
                                                newFacilities[index].name = e.target.value
                                                setFacilities(newFacilities)
                                            }}
                                            className="block w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-1.5 text-sm text-zinc-900 focus:border-blue-500 focus:ring-0 dark:border-zinc-800 dark:text-zinc-50"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Details (Optional)"
                                            value={facility.details}
                                            onChange={(e) => {
                                                const newFacilities = [...facilities]
                                                newFacilities[index].details = e.target.value
                                                setFacilities(newFacilities)
                                            }}
                                            className="block w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-1.5 text-xs text-zinc-900 focus:border-blue-500 focus:ring-0 dark:border-zinc-800 dark:text-zinc-50"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newFacilities = facilities.filter((_, i) => i !== index)
                                            setFacilities(newFacilities)
                                        }}
                                        className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            {facilities.length === 0 && (
                                <p className="text-xs text-zinc-500 italic">No facilities added.</p>
                            )}
                        </div>
                    </div>

                    {!resource && (
                        <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                            <h3 className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-50">Initial Allocation (Optional)</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">Assign to User</label>
                                    <select
                                        name="allocationUserId"
                                        className="mt-1 block w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-0 dark:border-zinc-800 dark:text-zinc-50 [&>option]:text-black"
                                    >
                                        <option value="">Do not allocate</option>
                                        {users?.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">Start Date</label>
                                        <input
                                            type="datetime-local"
                                            name="allocationStart"
                                            className="mt-1 block w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-0 dark:border-zinc-800 dark:text-zinc-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">End Date</label>
                                        <input
                                            type="datetime-local"
                                            name="allocationEnd"
                                            className="mt-1 block w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-0 dark:border-zinc-800 dark:text-zinc-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                        >
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {resource ? 'Save Changes' : 'Create Resource'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
