'use client'

import { useState } from 'react'
import { Plus, Check, X, Clock } from 'lucide-react'
import { updateBookingStatus } from '../actions/bookings'
import BookingForm from './BookingForm'

export default function AllocationsClient({ bookings, resources, users, currentUser }: { bookings: any[], resources: any[], users: any[], currentUser?: any }) {
    const [isFormOpen, setIsFormOpen] = useState(false)

    const handleStatusUpdate = async (id: number, status: string) => {
        if (!currentUser?.id) return;
        if (confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) {
            await updateBookingStatus(id, status, Number(currentUser.id))
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Allocations</h1>
                    <p className="mt-2 text-zinc-500 dark:text-zinc-400">Track current resource assignments.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 shadow-sm hover:shadow-md"
                >
                    <Plus className="h-4 w-4" />
                    New Allocation
                </button>
            </div>

            <div className="grid gap-4">
                {bookings.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                        <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">No allocations found</h3>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Get started by creating a new allocation.</p>
                    </div>
                ) : (
                    bookings.map((booking) => (
                        <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-lg border border-zinc-200 bg-white hover:border-zinc-300 transition-all dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-center gap-4">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${booking.status === 'Approved' ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-900/20' :
                                    booking.status === 'Pending' ? 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900 dark:bg-amber-900/20' :
                                        'border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-900/20'
                                    }`}>
                                    {booking.status === 'Approved' ? <Check className="h-5 w-5" /> :
                                        booking.status === 'Pending' ? <Clock className="h-5 w-5" /> :
                                            <X className="h-5 w-5" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{booking.resource.name}</h3>
                                        <span className="text-zinc-300 dark:text-zinc-600">/</span>
                                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{booking.user.name}</span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                                        <span className="font-medium tabular-nums">
                                            {new Date(booking.startDateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span>&rarr;</span>
                                        <span className="font-medium tabular-nums">
                                            {new Date(booking.endDateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {booking.status === 'Pending' && currentUser?.role === 'admin' ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleStatusUpdate(booking.id, 'Approved')}
                                            className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 shadow-sm transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(booking.id, 'Rejected')}
                                            className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                ) : (
                                    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium border ${booking.status === 'Approved' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-400' :
                                        booking.status === 'Pending' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-400' :
                                            'border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400'
                                        }`}>
                                        {booking.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isFormOpen && (
                <BookingForm
                    resources={resources}
                    users={users}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
}
