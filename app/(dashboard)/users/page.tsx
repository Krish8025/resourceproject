import { getUsers } from '@/app/actions/users'
import { UsersClient } from '@/app/components/UsersClient'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function UsersPage() {
    const session = await auth()
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'admin') {
        redirect('/dashboard')
    }

    const result = await getUsers()

    if (!result.success) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">{result.error}</p>
                </div>
            </div>
        )
    }

    return <UsersClient users={result.users || []} currentUserId={session.user.id} />
}
