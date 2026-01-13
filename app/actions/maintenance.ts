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
        await prisma.maintenance.update({
            where: { id },
            data: { status }
        })
        revalidatePath('/maintenance')
        return { success: true }
    } catch (error) {
        console.error('Failed to update maintenance status:', error)
        return { success: false, error: 'Failed to update maintenance status' }
    }
}
