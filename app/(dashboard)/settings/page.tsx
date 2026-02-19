import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import SettingsClient from '../../components/SettingsClient'

export default async function SettingsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/login')
    }

    return (
        <SettingsClient
            user={{
                name: session.user.name,
                email: session.user.email,
                role: (session.user as any).role,
            }}
        />
    )
}
