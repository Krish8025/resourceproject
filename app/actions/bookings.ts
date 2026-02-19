'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getAllBookings() {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                resource: true,
                user: true,
                approver: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return { success: true, data: bookings }
    } catch (error) {
        console.error('Failed to fetch bookings:', error)
        return { success: false, error: 'Failed to fetch bookings' }
    }
}

export async function createBooking(data: any) {
    try {
        // Basic validation
        if (!data.resourceId || !data.userId || !data.startDateTime || !data.endDateTime) {
            return { success: false, error: 'Missing required fields' }
        }

        const booking = await prisma.booking.create({
            data: {
                resourceId: parseInt(data.resourceId),
                userId: parseInt(data.userId),
                startDateTime: new Date(data.startDateTime),
                endDateTime: new Date(data.endDateTime),
                status: 'Pending', // Default status
            }
        })
        revalidatePath('/allocations')
        return { success: true, data: booking }
    } catch (error) {
        console.error('Failed to create booking:', error)
        return { success: false, error: 'Failed to create booking' }
    }
}

export async function updateBookingStatus(id: number, status: string, approverId?: number) {
    try {
        const booking = await prisma.booking.update({
            where: { id },
            data: {
                status,
                ...(approverId !== undefined && { approverId })
            }
        })
        revalidatePath('/allocations')
        revalidatePath('/resources') // Allocation status affects resources page
        return { success: true, data: booking }
    } catch (error) {
        console.error('Failed to update booking status:', error)
        return { success: false, error: 'Failed to update booking status' }
    }
}
