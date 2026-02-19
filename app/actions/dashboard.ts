'use server'

import { prisma } from '@/lib/prisma'

export async function getDashboardStats() {
    try {
        const [totalResources, totalUsers, maintenanceCount, activeAllocations, bookingsByStatus, resourcesByType, maintenanceByStatus] = await Promise.all([
            prisma.resource.count(),
            prisma.user.count(),
            prisma.maintenance.count({
                where: {
                    status: {
                        in: ['Pending', 'Scheduled', 'InProgress']
                    }
                }
            }),
            prisma.booking.count({
                where: {
                    status: 'Approved',
                    endDateTime: {
                        gte: new Date()
                    },
                    startDateTime: {
                        lte: new Date()
                    }
                }
            }),
            prisma.booking.groupBy({
                by: ['status'],
                _count: { id: true }
            }),
            prisma.resource.groupBy({
                by: ['resourceTypeId'],
                _count: { id: true }
            }),
            prisma.maintenance.groupBy({
                by: ['status'],
                _count: { id: true }
            })
        ])

        // Enrich resource types with names
        const typeIds = resourcesByType.map(r => r.resourceTypeId)
        const types = typeIds.length > 0 ? await prisma.resourceType.findMany({
            where: { id: { in: typeIds } },
            select: { id: true, name: true }
        }) : []

        const resourceTypeData = resourcesByType.map(r => ({
            name: types.find(t => t.id === r.resourceTypeId)?.name || 'Unknown',
            value: r._count.id
        }))

        const bookingStatusData = bookingsByStatus.map(b => ({
            name: b.status,
            value: b._count.id
        }))

        const maintenanceStatusData = maintenanceByStatus.map(m => ({
            name: m.status,
            value: m._count.id
        }))

        return {
            success: true,
            data: {
                totalResources,
                totalUsers,
                maintenanceCount,
                activeAllocations,
                bookingStatusData,
                resourceTypeData,
                maintenanceStatusData
            }
        }
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
        return { success: false, error: 'Failed to fetch dashboard stats' }
    }
}

export async function getRecentActivity() {
    try {
        const recentBookings = await prisma.booking.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: true,
                resource: true
            }
        })

        return { success: true, data: recentBookings }
    } catch (error) {
        console.error('Failed to fetch recent activity:', error)
        return { success: false, error: 'Failed to fetch recent activity' }
    }
}
