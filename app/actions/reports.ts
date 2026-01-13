'use server'

import { prisma } from '@/lib/prisma'

export async function getReportData() {
    try {
        const [
            bookingsByStatus,
            maintenanceByStatus,
            resourceUsage
        ] = await Promise.all([
            // 1. Bookings Status
            prisma.booking.groupBy({
                by: ['status'],
                _count: { id: true }
            }),
            // 2. Maintenance Status
            prisma.maintenance.groupBy({
                by: ['status'],
                _count: { id: true }
            }),
            // 3. Most booked resources (Top 5)
            prisma.booking.groupBy({
                by: ['resourceId'],
                _count: { id: true },
                orderBy: {
                    _count: { id: 'desc' }
                },
                take: 5
            })
        ])

        // Enrich resource usage with names
        const resourceDetails = await prisma.resource.findMany({
            where: {
                id: { in: resourceUsage.map(r => r.resourceId) }
            },
            select: { id: true, name: true }
        })

        const detailedResourceUsage = resourceUsage.map(usage => ({
            name: resourceDetails.find(r => r.id === usage.resourceId)?.name || 'Unknown',
            count: usage._count.id
        }))

        return {
            success: true,
            data: {
                bookingsByStatus,
                maintenanceByStatus,
                resourceUsage: detailedResourceUsage
            }
        }
    } catch (error) {
        console.error('Failed to fetch report data:', error)
        return { success: false, error: 'Failed to fetch report data' }
    }
}
