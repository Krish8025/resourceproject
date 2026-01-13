"use client";

import { handleSignOut } from "@/app/actions/signout";
import { LogOut, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Settings</h2>
            </div>

            <div className="grid gap-6">
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            <LogOut className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Account</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your account settings and session.</p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <form action={handleSignOut}>
                            <button className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900">
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 opacity-60 pointer-events-none grayscale">
                    <div className="flex items-center gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                            <SettingsIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">General</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">More settings coming soon...</p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Additional configuration options will be available here in future updates.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
