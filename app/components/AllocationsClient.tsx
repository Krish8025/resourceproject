'use client'

import { useState } from 'react'
import { Search, Plus, Calendar, User2, Box } from 'lucide-react'
import { updateBookingStatus } from '../actions/bookings'
import BookingForm from './BookingForm'

export default function AllocationsClient({ bookings: initialBookings, resources, users, currentUser }: { bookings: any[], resources: any[], users: any[], currentUser?: any }) {
    const [bookings, setBookings] = useState(initialBookings)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [showBookingForm, setShowBookingForm] = useState(false)

    const isAdmin = currentUser?.role === 'admin'

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.resource?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'All' || booking.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        if (confirm(`Change status to ${newStatus}?`)) {
            const result = await updateBookingStatus(id, newStatus)
            if (result.success) {
                setBookings(bookings.map(b =>
                    b.id === id ? { ...b, status: newStatus } : b
                ))
            }
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20'
            case 'Pending': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20'
            case 'Rejected': return 'bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20'
            default: return 'bg-[var(--badge-bg)] text-muted-foreground ring-1 ring-border'
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Allocations</h1>
                    <p className="mt-2 text-muted-foreground">Manage resource bookings and reservations.</p>
                </div>
                <button
                    onClick={() => setShowBookingForm(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1d9bf0] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#1d9bf0]/20 transition-all hover:scale-105 hover:shadow-[#1d9bf0]/30 hover:bg-[#1a8cd8]"
                >
                    <Plus className="h-4 w-4" />
                    New Allocation
                </button>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search bookings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#1d9bf0] focus:outline-none focus:ring-1 focus:ring-[#1d9bf0]"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === status
                                ? 'bg-[#1d9bf0] text-white'
                                : 'bg-card text-muted-foreground hover:bg-secondary border border-border'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredBookings.map((booking) => (
                    <div key={booking.id} className="glass-card group rounded-2xl p-5 transition-all hover:shadow-lg hover:shadow-primary/5">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1d9bf0]/10 text-[#1d9bf0]">
                                    <Box className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{booking.resource?.name}</h3>
                                    <p className="text-sm text-muted-foreground">{booking.resource?.type?.name}</p>
                                </div>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(booking.status)}`}>
                                <div className={`h-1.5 w-1.5 rounded-full ${booking.status === 'Approved' ? 'bg-emerald-500' :
                                    booking.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
                                    }`} />
                                {booking.status}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User2 className="h-4 w-4" />
                                <span>{booking.user?.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(booking.startDateTime).toLocaleDateString()} — {new Date(booking.endDateTime).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {isAdmin && booking.status === 'Pending' && (
                            <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                                <button
                                    onClick={() => handleStatusUpdate(booking.id, 'Approved')}
                                    className="flex-1 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(booking.id, 'Rejected')}
                                    className="flex-1 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No bookings found matching your criteria.</p>
                </div>
            )}

            {showBookingForm && (
                <BookingForm
                    resources={resources}
                    users={users}
                    currentUser={currentUser}
                    onClose={() => { setShowBookingForm(false); window.location.reload() }}
                />
            )}
        </div>
    )
}
