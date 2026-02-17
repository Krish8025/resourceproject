import { getAllResources } from "@/app/actions/resources";
import { prisma } from "@/lib/prisma";
import ResourcesClient from "@/app/components/ResourcesClient";

import { auth } from "@/auth";

export default async function ResourcesPage() {
    const session = await auth();
    const currentUser = session?.user;

    const { success, data } = await getAllResources();
    const dbResources = success && data ? data : [];

    // Fetch types, buildings, and users for the form
    const [types, buildings, users] = await Promise.all([
        prisma.resourceType.findMany(),
        prisma.building.findMany(),
        prisma.user.findMany({ select: { id: true, name: true } }),
    ]);

    // Helper to determine status and assignee
    const getResourceStatus = (resource: any) => {
        // 1. Check manual status overrides first
        if (resource.status === 'Maintenance') return { status: 'Maintenance', assignee: '-' };

        const now = new Date();

        // 2. Check for active maintenance (legacy/scheduler check)
        const activeMaintenance = resource.maintenance.find((m: any) =>
            m.status === 'Pending' || m.status === 'InProgress'
        );
        if (activeMaintenance) return { status: 'Maintenance', assignee: '-' };

        // 3. Check for active booking
        const activeBooking = resource.bookings.find((b: any) =>
            b.status === 'Approved' && new Date(b.startDateTime) <= now && new Date(b.endDateTime) >= now
        );

        if (activeBooking) {
            return {
                status: 'Allocated',
                assignee: activeBooking.user ? activeBooking.user.name : 'Unknown'
            };
        }

        return { status: 'Available', assignee: '-' };
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

    return <ResourcesClient initialResources={serializedResources} types={types} buildings={buildings} users={users} currentUser={currentUser} />;
}
