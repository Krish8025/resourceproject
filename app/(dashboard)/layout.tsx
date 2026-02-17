
import { auth } from "@/auth";
import { redirect } from 'next/navigation'
import { Sidebar } from "../components/Sidebar";


export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let session = null

    try {
        session = await auth()
    } catch (err) {
        console.error('Error fetching session in DashboardLayout:', err)
        // If auth fails, redirect to login
        redirect('/login')
    }

    if (!session?.user) {
        // Not authenticated - send to login
        redirect('/login')
    }

    return (
        <div className="flex h-full">
            <Sidebar user={session?.user} />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="mx-auto max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
