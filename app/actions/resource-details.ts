'use server'

import { prisma } from '@/lib/prisma'

export async function getResourceDetails(id: number) {
    try {
        const resource = await prisma.resource.findUnique({
            where: { id },
            include: {
                type: true,
                building: true,
                facilities: true,
                cupboards: {
                    include: {
                        shelves: true
                    }
                }
            }
        })

        if (!resource) {
            return { success: false, error: 'Resource not found' }
        }

        return { success: true, data: resource }
    } catch (error) {
        console.error('Failed to fetch resource details:', error)
        return { success: false, error: 'Failed to fetch resource details' }
    }
}
