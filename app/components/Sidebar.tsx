"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { LayoutDashboard, Box, Users, Settings, LogOut, Briefcase, Moon, Sun, PenTool as Tool, BarChart } from "lucide-react";
import { handleSignOut } from "@/app/actions/signout";


const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Resources", href: "/resources", icon: Box },
    { name: "Allocations", href: "/allocations", icon: Briefcase },
    { name: "Maintenance", href: "/maintenance", icon: Tool, adminOnly: true },
    { name: "Reports", href: "/reports", icon: BarChart, adminOnly: true },
    { name: "Users", href: "/users", icon: Users, adminOnly: true },
];

export function Sidebar({ user }: { user?: any }) {
    const pathname = usePathname();

    return (
        <aside className="relative flex h-full w-72 flex-col overflow-y-auto border-r border-white/5 bg-zinc-900/50 backdrop-blur-xl transition-all">
            {/* Logo Section */}
            <div className="flex h-20 items-center gap-3 px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
                    <span className="text-lg font-bold text-white">R</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-base font-bold tracking-tight text-white">ResourceMgr</span>
                    <span className="text-xs font-medium text-zinc-500">Workspace</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-4 py-4">
                {navigation.map((item) => {
                    if (item.adminOnly && user?.role !== 'admin') return null;

                    const isActive = pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-white/10 text-white shadow-inner"
                                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 transition-colors",
                                isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-indigo-400"
                            )} />
                            {item.name}
                            {isActive && (
                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="border-t border-white/5 p-4">
                <div className="group relative overflow-hidden rounded-2xl bg-white/5 p-4 transition-all hover:bg-white/10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-600 text-sm font-bold text-white shadow-inner">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
                            <p className="truncate text-xs text-zinc-500 capitalize">{user?.role}</p>
                        </div>
                    </div>

                    <form action={handleSignOut} className="mt-4">
                        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300">
                            <LogOut className="h-3.5 w-3.5" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    );
}
