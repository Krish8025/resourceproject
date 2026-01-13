"use client";

import Link from "next/link";
import { cn } from "@/app/lib/utils";
import { LayoutDashboard, Box, Users, Settings, LogOut, Briefcase, Moon, Sun, PenTool as Tool, BarChart } from "lucide-react";
import { handleSignOut } from "@/app/actions/signout";


const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Resources", href: "/resources", icon: Box },
    { name: "Allocations", href: "/allocations", icon: Briefcase },
    { name: "Maintenance", href: "/maintenance", icon: Tool },
    { name: "Reports", href: "/reports", icon: BarChart },
    { name: "Users", href: "/users", icon: Users, adminOnly: true },
];

export function Sidebar({ user }: { user?: any }) {

    return (
        <div className="flex h-screen w-64 flex-col justify-between border-r border-zinc-800 bg-zinc-900 p-4 transition-all">
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/20">
                            R
                        </div>
                        <div>
                            <span className="block text-lg font-bold tracking-tight text-white leading-none">
                                ResourceMgr
                            </span>
                            <span className="text-xs text-zinc-500 font-medium">Panel</span>
                        </div>
                    </div>
                </div>

                <nav className="space-y-1">
                    {navigation.map((item) => {
                        if (item.adminOnly && user?.role !== 'admin') return null;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    // Active state
                                    "hover:bg-zinc-800 hover:text-white",
                                    // Text colors
                                    "text-zinc-400"
                                )}
                            >
                                <div className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                                    "bg-zinc-800 group-hover:bg-blue-600 group-hover:text-white border border-zinc-700"
                                )}>
                                    <item.icon className="h-4 w-4" />
                                </div>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-zinc-800 pt-4">
                <div className="mb-4 flex items-center gap-3 rounded-xl bg-zinc-800/50 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900/30 text-blue-400 font-bold text-xs">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="truncate text-sm font-medium text-zinc-200">{user?.name}</p>
                        <p className="truncate text-xs text-zinc-500 capitalize">{user?.role}</p>
                    </div>
                </div>
                <form action={handleSignOut}>
                    <button className="group flex w-full items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-400 shadow-sm transition-all hover:bg-zinc-800 hover:text-red-400 hover:border-red-900/30">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    );
}
