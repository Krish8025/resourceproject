'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getAllMaintenance() {
    try {
        const maintenance = await prisma.maintenance.findMany({
            include: {
                resource: {
                    select: {
                        name: true,
                        building: true
                    }
                }
            },
            orderBy: {
                scheduledDate: 'asc'
            }
        })
        return { success: true, data: maintenance }
    } catch (error) {
        console.error('Failed to fetch maintenance records:', error)
        return { success: false, error: 'Failed to fetch maintenance records' }
    }
}

export async function updateMaintenanceStatus(id: number, status: string) {
    try {
        // Get the maintenance record to find the resourceId
        const record = await prisma.maintenance.findUnique({
            where: { id },
            select: { resourceId: true }
        })

        await prisma.maintenance.update({
            where: { id },
            data: { status }
        })

        // When maintenance is completed/cancelled, set resource back to Available
        if (record && (status === 'Completed' || status === 'Cancelled')) {
            // Check if there are any OTHER pending/in-progress maintenance for this resource
            const otherActive = await prisma.maintenance.count({
                where: {
                    resourceId: record.resourceId,
                    id: { not: id },
                    status: { in: ['Pending', 'Scheduled', 'InProgress'] }
                }
            })

            // Only set to Available if no other active maintenance exists
            if (otherActive === 0) {
                await prisma.resource.update({
                    where: { id: record.resourceId },
                    data: { status: 'Available' }
                })
            }
        }

        revalidatePath('/maintenance')
        revalidatePath('/resources')
        revalidatePath('/allocations')
        return { success: true }
    } catch (error) {
        console.error('Failed to update maintenance status:', error)
        return { success: false, error: 'Failed to update maintenance status' }
    }
}
