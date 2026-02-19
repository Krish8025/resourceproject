'use client'

import { useState } from 'react'
import { LogOut, Sun, Moon, User as UserIcon, Mail, Shield, Info } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useTheme } from './ThemeProvider'

type SettingsClientProps = {
    user?: {
        name?: string | null
        email?: string | null
        role?: string
    }
}

export default function SettingsClient({ user }: SettingsClientProps) {
    const { theme, toggleTheme } = useTheme()
    const [signingOut, setSigningOut] = useState(false)

    const handleSignOut = async () => {
        setSigningOut(true)
        await signOut({ callbackUrl: '/login' })
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
                <p className="mt-2 text-muted-foreground">Manage your account and preferences.</p>
            </div>

            {/* Profile Section */}
            <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1d9bf0]/10 text-[#1d9bf0]">
                        <UserIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Profile</h3>
                        <p className="text-sm text-muted-foreground">Your personal information</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1d9bf0] text-white text-2xl font-bold shadow-lg shadow-[#1d9bf0]/25">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                            <UserIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</p>
                                <p className="text-sm font-semibold text-foreground">{user?.name || 'Unknown'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</p>
                                <p className="text-sm font-semibold text-foreground">{user?.email || 'Unknown'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Role</p>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user?.role === 'admin'
                                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/20'
                                        : user?.role === 'faculty'
                                            ? 'bg-[#1d9bf0]/10 text-[#1d9bf0] ring-1 ring-[#1d9bf0]/20'
                                            : 'bg-[var(--badge-bg)] text-muted-foreground ring-1 ring-border'
                                    }`}>
                                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Member'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Theme Preferences */}
            <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                        {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
                        <p className="text-sm text-muted-foreground">Customize how ResourceMgr looks</p>
                    </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-secondary p-4 border border-border">
                    <div>
                        <p className="text-sm font-medium text-foreground">Theme Mode</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Currently using <span className="font-semibold text-foreground">{theme === 'dark' ? 'Dark' : 'Light'}</span> mode
                        </p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="relative inline-flex h-10 w-20 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1d9bf0] focus:ring-offset-2 focus:ring-offset-background"
                        style={{ backgroundColor: theme === 'dark' ? '#1d9bf0' : '#cfd9de' }}
                    >
                        <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-11' : 'translate-x-1'
                                }`}
                        >
                            {theme === 'dark' ? (
                                <Moon className="h-4 w-4 text-[#1d9bf0]" />
                            ) : (
                                <Sun className="h-4 w-4 text-amber-500" />
                            )}
                        </span>
                    </button>
                </div>
            </div>

            {/* Sign Out Section */}
            <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                        <LogOut className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Session</h3>
                        <p className="text-sm text-muted-foreground">Manage your active session</p>
                    </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-secondary p-4 border border-border">
                    <div>
                        <p className="text-sm font-medium text-foreground">Sign out of your account</p>
                        <p className="text-xs text-muted-foreground mt-0.5">You will be redirected to the login page</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LogOut className="h-4 w-4" />
                        {signingOut ? 'Signing out...' : 'Sign Out'}
                    </button>
                </div>
            </div>

            {/* About Section */}
            <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                        <Info className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">About</h3>
                        <p className="text-sm text-muted-foreground">Application information</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-secondary p-3 border border-border">
                        <span className="text-sm text-muted-foreground">Application</span>
                        <span className="text-sm font-medium text-foreground">ResourceMgr</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-secondary p-3 border border-border">
                        <span className="text-sm text-muted-foreground">Version</span>
                        <span className="text-sm font-medium text-foreground">1.0.0</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-secondary p-3 border border-border">
                        <span className="text-sm text-muted-foreground">Framework</span>
                        <span className="text-sm font-medium text-foreground">Next.js 16</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
