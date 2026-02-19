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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl bg-[var(--modal-bg)] border border-border p-6 shadow-2xl animate-in zoom-in-95 duration-200 sticky max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-transparent z-10">
                    <h2 className="text-xl font-bold text-foreground">
                        {resource ? 'Edit Resource' : 'Add New Resource'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">Name</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={resource?.name}
                            required
                            className="w-full rounded-xl border border-border bg-[var(--input-bg)] px-4 py-2.5 text-sm text-foreground outline-none focus:border-[#1d9bf0]/50 focus:ring-1 focus:ring-[#1d9bf0]/50 transition-all placeholder:text-muted-foreground"
                            placeholder="e.g. Dell XPS 15"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">Type</label>
                        <div className="relative">
                            <select
                                name="resourceTypeId"
                                defaultValue={resource?.resourceTypeId}
                                required
                                className="w-full appearance-none rounded-xl border border-border bg-[var(--input-bg)] px-4 py-2.5 text-sm text-foreground outline-none focus:border-[#1d9bf0]/50 focus:ring-1 focus:ring-[#1d9bf0]/50 transition-all"
                            >
                                <option value="" className="bg-card text-muted-foreground">Select a type</option>
                                {types.map((type) => (
                                    <option key={type.id} value={type.id} className="bg-card text-foreground">
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Building</label>
                            <div className="relative">
                                <select
                                    name="buildingId"
                                    defaultValue={resource?.buildingId}
                                    className="w-full appearance-none rounded-xl border border-border bg-[var(--input-bg)] px-4 py-2.5 text-sm text-foreground outline-none focus:border-[#1d9bf0]/50 focus:ring-1 focus:ring-[#1d9bf0]/50 transition-all"
                                >
                                    <option value="" className="bg-card text-muted-foreground">None</option>
                                    {buildings.map((b) => (
                                        <option key={b.id} value={b.id} className="bg-card text-foreground">
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Floor</label>
                            <input
                                type="number"
                                name="floorNumber"
                                defaultValue={resource?.floorNumber}
                                className="w-full rounded-xl border border-border bg-[var(--input-bg)] px-4 py-2.5 text-sm text-foreground outline-none focus:border-[#1d9bf0]/50 focus:ring-1 focus:ring-[#1d9bf0]/50 transition-all placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">Description</label>
                        <textarea
                            name="description"
                            defaultValue={resource?.description}
                            rows={3}
                            className="w-full rounded-xl border border-border bg-[var(--input-bg)] px-4 py-2.5 text-sm text-foreground outline-none focus:border-[#1d9bf0]/50 focus:ring-1 focus:ring-[#1d9bf0]/50 transition-all placeholder:text-muted-foreground"
                        />
                    </div>

                    {/* Facilities Section */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-muted-foreground">Facilities</label>
                            <button
                                type="button"
                                onClick={() => setFacilities([...facilities, { name: '', details: '' }])}
                                className="text-xs flex items-center gap-1.5 text-[#1d9bf0] hover:text-[#1a8cd8] transition-colors bg-[#1d9bf0]/10 px-2.5 py-1.5 rounded-lg hover:bg-[#1d9bf0]/20"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Add Facility
                            </button>
                        </div>
                        <div className="space-y-3">
                            {facilities.map((facility, index) => (
                                <div key={index} className="flex gap-3 items-start p-3 rounded-xl bg-secondary border border-border">
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Facility Name"
                                            value={facility.name}
                                            onChange={(e) => {
                                                const newFacilities = [...facilities]
                                                newFacilities[index].name = e.target.value
                                                setFacilities(newFacilities)
                                            }}
                                            className="w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-1.5 text-sm text-foreground outline-none focus:border-[#1d9bf0]/50 focus:ring-1 focus:ring-[#1d9bf0]/50 placeholder:text-muted-foreground"
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
                                            className="w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-1.5 text-xs text-muted-foreground outline-none focus:border-[#1d9bf0]/50 focus:ring-1 focus:ring-[#1d9bf0]/50 placeholder:text-muted-foreground"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newFacilities = facilities.filter((_, i) => i !== index)
                                            setFacilities(newFacilities)
                                        }}
                                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            {facilities.length === 0 && (
                                <div className="text-center py-4 border border-dashed border-border rounded-xl">
                                    <p className="text-xs text-muted-foreground">No facilities added yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {!resource && (
                        <div className="rounded-xl border border-border bg-secondary p-4 mt-4">
                            <h3 className="mb-3 text-sm font-medium text-[#1d9bf0]">Initial Allocation (Optional)</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Assign to User</label>
                                    <div className="relative">
                                        <select
                                            name="allocationUserId"
                                            className="w-full appearance-none rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-foreground outline-none focus:border-[#1d9bf0]/50 focus:ring-1 focus:ring-[#1d9bf0]/50 transition-all"
                                        >
                                            <option value="" className="bg-card text-muted-foreground">Do not allocate</option>
                                            {users?.map((user) => (
                                                <option key={user.id} value={user.id} className="bg-card text-foreground">
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Start Date</label>
                                        <input
                                            type="datetime-local"
                                            name="allocationStart"
                                            className="w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-foreground outline-none focus:border-[#1d9bf0]/50 focus:ring-1 focus:ring-[#1d9bf0]/50 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">End Date</label>
                                        <input
                                            type="datetime-local"
                                            name="allocationEnd"
                                            className="w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-foreground outline-none focus:border-[#1d9bf0]/50 focus:ring-1 focus:ring-[#1d9bf0]/50 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3 pt-6 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-foreground hover:bg-[var(--hover)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1d9bf0] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#1d9bf0]/20 hover:bg-[#1a8cd8] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
