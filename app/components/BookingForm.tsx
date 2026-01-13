'use client'

import { useState } from 'react'
import { createBooking } from '../actions/bookings'
import { Loader2, X } from 'lucide-react'

type BookingFormProps = {
    resources: any[]
    users: any[]
    onClose: () => void
}

export default function BookingForm({ resources, users, onClose }: BookingFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [selectedResourceId, setSelectedResourceId] = useState('')

    const selectedResource = resources.find(r => r.id.toString() === selectedResourceId)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError('')

        const data = {
            resourceId: formData.get('resourceId'),
            userId: formData.get('userId'),
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
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">New Allocation</h2>
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
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Resource</label>
                        <select
                            name="resourceId"
                            required
                            value={selectedResourceId}
                            onChange={(e) => setSelectedResourceId(e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-0 dark:border-zinc-800 dark:text-zinc-50 [&>option]:text-black"
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
                        <div className="rounded-lg bg-zinc-50 p-3 text-sm dark:bg-zinc-800/50">
                            <h4 className="font-medium text-zinc-900 dark:text-zinc-50 mb-2">Includes:</h4>
                            <div className="space-y-1 text-zinc-600 dark:text-zinc-400">
                                {selectedResource.facilities?.map((f: any, i: number) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        <span>{f.name} {f.details && <span className="text-xs opacity-75">({f.details})</span>}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Selected Resource Details */}
                    {(() => {
                        // Removing my previous placeholder comment block
                        return null;
                    })()}

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">User</label>
                        <select
                            name="userId"
                            required
                            className="mt-1 block w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-0 dark:border-zinc-800 dark:text-zinc-50 [&>option]:text-black"
                        >
                            <option value="">Select a user</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name} ({u.role})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                required
                                className="mt-1 block w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-0 dark:border-zinc-800 dark:text-zinc-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Start Time</label>
                            <input
                                type="time"
                                name="startTime"
                                required
                                className="mt-1 block w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-0 dark:border-zinc-800 dark:text-zinc-50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                required
                                className="mt-1 block w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-0 dark:border-zinc-800 dark:text-zinc-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">End Time</label>
                            <input
                                type="time"
                                name="endTime"
                                required
                                className="mt-1 block w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-0 dark:border-zinc-800 dark:text-zinc-50"
                            />
                        </div>
                    </div>

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
                            Create Allocation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
