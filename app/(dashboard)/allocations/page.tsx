import { getAllBookings } from "@/app/actions/bookings";
import { prisma } from "@/lib/prisma";
import AllocationsClient from "@/app/components/AllocationsClient";

import { auth } from "@/auth";

export default async function AllocationsPage() {
    const session = await auth();
    const currentUser = session?.user;

    const { success, data } = await getAllBookings();
    const bookings = success && data ? data : [];

    const where: any = {};
    where.maintenance = {
        none: {
            status: { in: ['Scheduled', 'InProgress', 'Pending'] }
        }
    };

    const resources = await prisma.resource.findMany({
        where,
        include: {
            type: true,
            facilities: true,
            cupboards: true
        }
    });
    const users = await prisma.user.findMany();

    const serializedBookings = JSON.parse(JSON.stringify(bookings));

    return (
        <AllocationsClient
            bookings={serializedBookings}
            resources={resources}
            users={users}
            currentUser={currentUser}
        />
    );
}
