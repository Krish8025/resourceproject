'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Box,
    Briefcase,
    Wrench,
    BarChart,
    Users,
    LogOut,
    Sun,
    Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Resources", href: "/resources", icon: Box },
    { name: "Allocations", href: "/allocations", icon: Briefcase },
    { name: "Maintenance", href: "/maintenance", icon: Wrench, adminOnly: true },
    { name: "Reports", href: "/reports", icon: BarChart, adminOnly: true },
    { name: "Users", href: "/users", icon: Users, adminOnly: true },
];

export function Sidebar({ user }: { user?: any }) {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    return (
        <aside className="relative flex h-full w-72 flex-col overflow-y-auto border-r border-border bg-[var(--sidebar-bg)] transition-all">
            {/* Logo Section */}
            <div className="flex h-20 items-center gap-3 px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1d9bf0] shadow-lg shadow-[#1d9bf0]/20">
                    <Box className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-foreground tracking-tight">ResourceMgr</h1>
                    <p className="text-xs text-muted-foreground">Management System</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-4 py-4">
                {navigation.map((item) => {
                    if (item.adminOnly && user?.role !== "admin") return null;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-[var(--sidebar-active)] text-[#1d9bf0] shadow-sm"
                                    : "text-muted-foreground hover:bg-[var(--sidebar-hover)] hover:text-foreground"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "h-5 w-5 transition-colors",
                                    isActive ? "text-[#1d9bf0]" : "text-muted-foreground group-hover:text-foreground"
                                )}
                            />
                            {item.name}
                            {isActive && (
                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#1d9bf0]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Theme Toggle */}
            <div className="px-4 py-2">
                <button
                    onClick={toggleTheme}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-[var(--sidebar-hover)] hover:text-foreground"
                >
                    {theme === 'dark' ? (
                        <Sun className="h-5 w-5" />
                    ) : (
                        <Moon className="h-5 w-5" />
                    )}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>

            {/* User Profile */}
            <div className="border-t border-border p-4">
                <div className="flex items-center gap-3 rounded-xl p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1d9bf0] text-white font-bold text-sm shadow-lg shadow-[#1d9bf0]/20">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                            {user?.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {user?.role || "member"}
                        </p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Sign out"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
