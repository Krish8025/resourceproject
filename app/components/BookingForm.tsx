'use client'

import { useState } from 'react'
import { createBooking } from '../actions/bookings'
import { Loader2, X } from 'lucide-react'

type BookingFormProps = {
    resources: any[]
    users: any[]
    currentUser?: any
    onClose: () => void
}

export default function BookingForm({ resources, users, currentUser, onClose }: BookingFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [selectedResourceId, setSelectedResourceId] = useState('')

    const selectedResource = resources.find(r => r.id.toString() === selectedResourceId)

    const isNonAdmin = currentUser?.role && currentUser.role !== 'admin';

    // Set initial user ID for non-admins
    const [selectedUserId, setSelectedUserId] = useState(isNonAdmin ? currentUser.id : '')

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError('')

        const data = {
            resourceId: formData.get('resourceId'),
            userId: formData.get('userId') || selectedUserId, // Use state if field is hidden
            startDateTime: `${formData.get('startDate')}T${formData.get('startTime')}:00`,
            endDateTime: `${formData.get('endDate')}T${formData.get('endTime')}:00`,
        }

        try {
            const result = await createBooking(data)
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
            <div className="w-full max-w-md rounded-2xl bg-[var(--modal-bg)] p-6 shadow-xl ring-1 ring-border">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">New Allocation</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground">Resource</label>
                        <select
                            name="resourceId"
                            required
                            value={selectedResourceId}
                            onChange={(e) => setSelectedResourceId(e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-foreground focus:border-[#1d9bf0] focus:ring-0 [&>option]:text-foreground [&>option]:bg-card"
                        >
                            <option value="">Select a resource</option>
                            {resources.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name} ({r.type.name})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedResource && (selectedResource.facilities?.length > 0 || selectedResource.cupboards?.length > 0) && (
                        <div className="rounded-lg bg-secondary p-3 text-sm">
                            <h4 className="font-medium text-foreground mb-2">Includes:</h4>
                            <div className="space-y-1 text-muted-foreground">
                                {selectedResource.facilities?.map((f: any, i: number) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#1d9bf0]" />
                                        <span>{f.name} {f.details && <span className="text-xs opacity-75">({f.details})</span>}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Selected Resource Details */}
                    {(() => {
                        return null;
                    })()}

                    {currentUser?.role === 'admin' ? (
                        <div>
                            <label className="block text-sm font-medium text-foreground">User</label>
                            <select
                                name="userId"
                                required
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-foreground focus:border-[#1d9bf0] focus:ring-0 [&>option]:text-foreground [&>option]:bg-card"
                            >
                                <option value="">Select a user</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} ({u.role})
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-foreground">User</label>
                            <div className="mt-1 block w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground">
                                {currentUser?.name}
                            </div>
                            <input type="hidden" name="userId" value={currentUser?.id || ''} />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                required
                                className="mt-1 block w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-foreground focus:border-[#1d9bf0] focus:ring-0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground">Start Time</label>
                            <input
                                type="time"
                                name="startTime"
                                required
                                className="mt-1 block w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-foreground focus:border-[#1d9bf0] focus:ring-0"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                required
                                className="mt-1 block w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-foreground focus:border-[#1d9bf0] focus:ring-0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground">End Time</label>
                            <input
                                type="time"
                                name="endTime"
                                required
                                className="mt-1 block w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-foreground focus:border-[#1d9bf0] focus:ring-0"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1d9bf0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a8cd8] disabled:opacity-50"
                        >
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Create Allocation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
