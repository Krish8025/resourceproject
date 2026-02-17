import { getAllMaintenance } from "@/app/actions/maintenance";
import MaintenanceClient from "@/app/components/MaintenanceClient";
import { auth } from "@/auth";

export default async function MaintenancePage() {
    const session = await auth();
    const currentUser = session?.user;

    if (currentUser?.role !== 'admin') {
        const { redirect } = await import('next/navigation');
        redirect('/dashboard');
    }

    const { success, data } = await getAllMaintenance();
    const maintenanceRecords = success && data ? data : [];

    const serializedRecords = JSON.parse(JSON.stringify(maintenanceRecords));

    return (
        <MaintenanceClient
            initialRecords={serializedRecords}
            currentUser={currentUser}
        />
    );
}
