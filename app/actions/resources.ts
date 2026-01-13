'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getAllResources() {
    try {
        const resources = await prisma.resource.findMany({
            include: {
                type: true,
                building: true,
                facilities: true,
                maintenance: true,
                cupboards: true,
                bookings: { include: { user: true } },
            },
            orderBy: {
                id: 'asc',
            },
        })
        return { success: true, data: resources }
    } catch (error) {
        console.error('Failed to fetch resources:', error)
        return { success: false, error: 'Failed to fetch resources' }
    }
}

export async function createResource(data: any) {
    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Resource
            const resource = await tx.resource.create({
                data: {
                    name: data.name,
                    resourceTypeId: parseInt(data.resourceTypeId),
                    buildingId: data.buildingId ? parseInt(data.buildingId) : null,
                    floorNumber: data.floorNumber ? parseInt(data.floorNumber) : null,
                    description: data.description,
                    facilities: {
                        create: data.facilities?.map((f: any) => ({
                            name: f.name,
                            details: f.details
                        }))
                    }
                },
            })

            // 2. Create Allocation if requested
            if (data.allocationUserId && data.allocationStart && data.allocationEnd) {
                await tx.booking.create({
                    data: {
                        resourceId: resource.id,
                        userId: parseInt(data.allocationUserId),
                        startDateTime: new Date(data.allocationStart),
                        endDateTime: new Date(data.allocationEnd),
                        status: 'Approved', // Auto-approve admin created allocations
                        approverId: 1, // System/Admin approver (should ideally be current user id)
                    }
                })
            }

            return resource
        })

        revalidatePath('/resources')
        revalidatePath('/allocations')
        return { success: true, data: result }
    } catch (error) {
        console.error('Failed to create resource:', error)
        return { success: false, error: 'Failed to create resource' }
    }
}

export async function updateResource(id: number, data: any) {
    try {
        const result = await prisma.$transaction(async (tx) => {
            // Update basic details
            const resource = await tx.resource.update({
                where: { id },
                data: {
                    name: data.name,
                    resourceTypeId: parseInt(data.resourceTypeId),
                    buildingId: data.buildingId ? parseInt(data.buildingId) : null,
                    floorNumber: data.floorNumber ? parseInt(data.floorNumber) : null,
                    description: data.description,
                },
            })

            // Update facilities (Delete all and recreate)
            if (data.facilities) {
                await tx.facility.deleteMany({
                    where: { resourceId: id }
                })

                if (data.facilities.length > 0) {
                    await tx.facility.createMany({
                        data: data.facilities.map((f: any) => ({
                            resourceId: id,
                            name: f.name,
                            details: f.details
                        }))
                    })
                }
            }

            return resource
        })

        revalidatePath('/resources')
        return { success: true, data: result }
    } catch (error) {
        console.error('Failed to update resource:', error)
        return { success: false, error: 'Failed to update resource' }
    }
}

export async function deleteResource(id: number) {
    try {
        await prisma.resource.delete({
            where: { id },
        })
        revalidatePath('/resources')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete resource:', error)
        return { success: false, error: 'Failed to delete resource' }
    }
}
