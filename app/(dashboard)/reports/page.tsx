import { auth } from "@/auth";
import ReportsClient from "@/app/components/ReportsClient";
import { getReportData } from "@/app/actions/reports";

export default async function ReportsPage() {
    const session = await auth();
    const currentUser = session?.user;

    if (currentUser?.role !== 'admin') {
        const { redirect } = await import('next/navigation');
        redirect('/dashboard');
    }

    const { success, data } = await getReportData();
    const reportData = success && data ? data : null;

    return <ReportsClient reportData={reportData} currentUser={currentUser} />;
}
