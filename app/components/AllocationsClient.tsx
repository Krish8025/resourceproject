'use client'

import { useState } from 'react'
import { Plus, Check, X, Clock, Calendar } from 'lucide-react'
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
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Allocations</h1>
                    <p className="mt-2 text-zinc-400">Track and manage resource assignments.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 hover:shadow-blue-500/30"
                >
                    <Plus className="h-4 w-4" />
                    New Allocation
                </button>
            </div>

            <div className="grid gap-4">
                {bookings.length === 0 ? (
                    <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-12 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/50 ring-1 ring-white/10 mb-4">
                            <Calendar className="h-8 w-8 text-zinc-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">No allocations found</h3>
                        <p className="mt-2 text-sm text-zinc-400 max-w-sm mx-auto">
                            There are no active or past allocations to display. Get started by creating a new one.
                        </p>
                    </div>
                ) : (
                    bookings.map((booking) => (
                        <div key={booking.id} className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/10 hover:shadow-lg">
                            <div className="flex items-center gap-5">
                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-inner ${booking.status === 'Approved' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' :
                                        booking.status === 'Pending' ? 'border-amber-500/20 bg-amber-500/10 text-amber-400' :
                                            'border-red-500/20 bg-red-500/10 text-red-400'
                                    }`}>
                                    {booking.status === 'Approved' ? <Check className="h-6 w-6" /> :
                                        booking.status === 'Pending' ? <Clock className="h-6 w-6" /> :
                                            <X className="h-6 w-6" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-lg text-white">{booking.resource.name}</h3>
                                        <span className="text-zinc-600">/</span>
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-300 ring-1 ring-indigo-500/30">
                                                {booking.user.name[0]}
                                            </div>
                                            <span className="text-sm font-medium text-zinc-300">{booking.user.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                                        <div className="flex items-center gap-1.5 bg-zinc-800/50 px-2 py-1 rounded-md ring-1 ring-white/5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span className="tabular-nums">
                                                {new Date(booking.startDateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <span className="text-zinc-600">&rarr;</span>
                                        <div className="flex items-center gap-1.5 bg-zinc-800/50 px-2 py-1 rounded-md ring-1 ring-white/5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span className="tabular-nums">
                                                {new Date(booking.endDateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pl-16 sm:pl-0">
                                {booking.status === 'Pending' && currentUser?.role === 'admin' ? (
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleStatusUpdate(booking.id, 'Approved')}
                                            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600/20 border border-emerald-600/30 rounded-lg hover:bg-emerald-600 hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-600/20 transition-all duration-300"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(booking.id, 'Rejected')}
                                            className="px-4 py-2 text-xs font-semibold text-zinc-400 bg-zinc-800/50 border border-zinc-700/50 rounded-lg hover:bg-zinc-800 hover:text-white transition-all duration-300"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                ) : (
                                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border shadow-sm ${booking.status === 'Approved' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' :
                                            booking.status === 'Pending' ? 'border-amber-500/20 bg-amber-500/10 text-amber-400' :
                                                'border-red-500/20 bg-red-500/10 text-red-400'
                                        }`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${booking.status === 'Approved' ? 'bg-emerald-400' :
                                                booking.status === 'Pending' ? 'bg-amber-400' : 'bg-red-400'
                                            } shadow-[0_0_8px_currentColor]`} />
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
                    currentUser={currentUser}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
}
