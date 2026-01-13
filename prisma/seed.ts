import { PrismaClient } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'
import * as dotenv from 'dotenv'

dotenv.config()

neonConfig.webSocketConstructor = ws
const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    // 1. Users
    await prisma.user.createMany({
        data: [
            { id: 1, name: 'Admin User', email: 'admin@rms.com', role: 'admin', password: 'admin123' },
            { id: 2, name: 'Faculty One', email: 'faculty1@rms.com', role: 'faculty', password: 'faculty123' },
            { id: 3, name: 'Faculty Two', email: 'faculty2@rms.com', role: 'faculty', password: 'faculty123' },
            { id: 4, name: 'Student One', email: 'student1@rms.com', role: 'student', password: 'student123' },
            { id: 5, name: 'Maintenance Staff', email: 'maint@rms.com', role: 'maintenance', password: 'maint123' },
        ],
        skipDuplicates: true,
    })

    // 2. Resource Types
    await prisma.resourceType.createMany({
        data: [
            { id: 1, name: 'Classroom' },
            { id: 2, name: 'Computer Lab' },
            { id: 3, name: 'Auditorium' },
            { id: 4, name: 'Meeting Room' },
        ],
        skipDuplicates: true,
    })

    // 3. Buildings
    await prisma.building.createMany({
        data: [
            { id: 1, name: 'Main Block', buildingNumber: 'B1', totalFloors: 5 },
            { id: 2, name: 'Science Block', buildingNumber: 'B2', totalFloors: 4 },
            { id: 3, name: 'Admin Block', buildingNumber: 'B3', totalFloors: 3 },
        ],
        skipDuplicates: true,
    })

    // 4. Resources
    await prisma.resource.createMany({
        data: [
            { id: 1, name: 'Classroom 101', resourceTypeId: 1, buildingId: 1, floorNumber: 1, description: 'Large classroom with projector' },
            { id: 2, name: 'Classroom 102', resourceTypeId: 1, buildingId: 1, floorNumber: 1, description: 'Medium classroom' },
            { id: 3, name: 'Computer Lab A', resourceTypeId: 2, buildingId: 2, floorNumber: 2, description: 'Lab with 40 computers' },
            { id: 4, name: 'Auditorium Hall', resourceTypeId: 3, buildingId: 1, floorNumber: 0, description: 'Main auditorium' },
            { id: 5, name: 'Meeting Room 1', resourceTypeId: 4, buildingId: 3, floorNumber: 1, description: 'Conference room' },
        ],
        skipDuplicates: true,
    })

    // 5. Facilities
    await prisma.facility.createMany({
        data: [
            { resourceId: 1, name: 'Projector', details: 'HD projector' },
            { resourceId: 1, name: 'Air Conditioner', details: 'Central AC' },
            { resourceId: 3, name: 'Computers', details: '40 desktop systems' },
            { resourceId: 4, name: 'Sound System', details: 'Dolby sound' },
            { resourceId: 5, name: 'Video Conferencing', details: 'Zoom setup' },
        ],
        skipDuplicates: true,
    })

    // 6. Maintenance
    await prisma.maintenance.createMany({
        data: [
            { resourceId: 1, type: 'Cleaning', scheduledDate: new Date('2026-01-10'), status: 'Scheduled', notes: 'Regular cleaning' },
            { resourceId: 3, type: 'System Check', scheduledDate: new Date('2026-01-15'), status: 'Pending', notes: 'Check all PCs' },
            { resourceId: 4, type: 'Sound Test', scheduledDate: new Date('2026-01-20'), status: 'Completed', notes: 'All systems OK' },
        ],
        skipDuplicates: true,
    })

    // 7. Bookings
    await prisma.booking.createMany({
        data: [
            { resourceId: 1, userId: 2, startDateTime: new Date('2026-01-05T10:00:00'), endDateTime: new Date('2026-01-05T12:00:00'), status: 'Approved', approverId: 1 },
            { resourceId: 3, userId: 3, startDateTime: new Date('2026-01-06T09:00:00'), endDateTime: new Date('2026-01-06T11:00:00'), status: 'Pending', approverId: 1 },
            { resourceId: 4, userId: 2, startDateTime: new Date('2026-01-07T14:00:00'), endDateTime: new Date('2026-01-07T17:00:00'), status: 'Approved', approverId: 1 },
            { resourceId: 5, userId: 4, startDateTime: new Date('2026-01-08T11:00:00'), endDateTime: new Date('2026-01-08T12:00:00'), status: 'Rejected', approverId: 1 },
        ],
        skipDuplicates: true,
    })

    // 8. Cupboards
    await prisma.cupboard.createMany({
        data: [
            { id: 1, resourceId: 1, name: 'Classroom 101 Storage', totalShelves: 5 },
            { id: 2, resourceId: 3, name: 'Lab A Storage', totalShelves: 8 },
            { id: 3, resourceId: 4, name: 'Auditorium Storage', totalShelves: 6 },
        ],
        skipDuplicates: true,
    })

    // 9. Shelves
    await prisma.shelf.createMany({
        data: [
            { cupboardId: 1, shelfNumber: 1, capacity: 20, description: 'Books' },
            { cupboardId: 1, shelfNumber: 2, capacity: 15, description: 'Stationery' },
            { cupboardId: 2, shelfNumber: 1, capacity: 30, description: 'Computer Parts' },
            { cupboardId: 2, shelfNumber: 2, capacity: 25, description: 'Cables' },
            { cupboardId: 3, shelfNumber: 1, capacity: 10, description: 'Audio Equipment' },
        ],
        skipDuplicates: true,
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
