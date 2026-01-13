'use server'

import { prisma } from '@/lib/prisma'

export async function getDashboardStats() {
    try {
        const [totalResources, totalUsers, maintenanceCount, activeAllocations] = await Promise.all([
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
            })
        ])

        return {
            success: true,
            data: {
                totalResources,
                totalUsers,
                maintenanceCount,
                activeAllocations
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
