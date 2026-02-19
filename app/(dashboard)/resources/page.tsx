import { getAllResources } from "@/app/actions/resources";
import { prisma } from "@/lib/prisma";
import ResourcesClient from "@/app/components/ResourcesClient";

import { auth } from "@/auth";

export default async function ResourcesPage() {
    const session = await auth();
    const currentUser = session?.user;

    let dbResources: any[] = [];
    let types: any[] = [];
    let buildings: any[] = [];
    let users: any[] = [];

    try {
        const result = await getAllResources();
        if (result?.success && Array.isArray(result.data)) {
            dbResources = result.data;
        }
    } catch (err) {
        console.error('Failed to fetch resources:', err);
    }

    try {
        const [t, b, u] = await Promise.all([
            prisma.resourceType.findMany(),
            prisma.building.findMany(),
            prisma.user.findMany({ select: { id: true, name: true } }),
        ]);
        types = t || [];
        buildings = b || [];
        users = u || [];
    } catch (err) {
        console.error('Failed to fetch form data:', err);
    }

    // Helper to determine status and assignee
    const getResourceStatus = (resource: any) => {
        if (!resource) return { status: 'Available', assignee: '-' };

        // 1. Check manual status overrides first
        if (resource.status === 'Maintenance') return { status: 'Maintenance', assignee: '-' };

        const now = new Date();
        const maintenanceList = Array.isArray(resource.maintenance) ? resource.maintenance : [];
        const bookingsList = Array.isArray(resource.bookings) ? resource.bookings : [];

        // 2. Check for active maintenance
        const activeMaintenance = maintenanceList.find((m: any) =>
            m.status === 'Pending' || m.status === 'InProgress'
        );
        if (activeMaintenance) return { status: 'Maintenance', assignee: '-' };

        // 3. Check for active booking
        const activeBooking = bookingsList.find((b: any) =>
            b.status === 'Approved' && new Date(b.startDateTime) <= now && new Date(b.endDateTime) >= now
        );

        if (activeBooking) {
            return {
                status: 'Allocated',
                assignee: activeBooking.user ? activeBooking.user.name : 'Unknown'
            };
        }

        return { status: resource.status || 'Available', assignee: '-' };
    };

    const resources = dbResources.map((r: any) => {
        const { status, assignee } = getResourceStatus(r);
        return {
            ...r,
            computedStatus: status,
            computedAssignee: assignee
        };
    });

    const serializedResources = JSON.parse(JSON.stringify(resources));

    return (
        <ResourcesClient
            initialResources={serializedResources}
            types={JSON.parse(JSON.stringify(types))}
            buildings={JSON.parse(JSON.stringify(buildings))}
            users={JSON.parse(JSON.stringify(users))}
            currentUser={currentUser}
        />
    );
}
