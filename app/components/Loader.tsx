'use client'

import { Loader2 } from 'lucide-react'

interface LoaderProps {
    className?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    text?: string
}

export default function Loader({ className = "", size = 'lg', text = "Loading..." }: LoaderProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16"
    }

    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20 dark:bg-blue-400/20 duration-1000" />
                <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/10 dark:bg-blue-400/10 delay-75" />
                <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 dark:text-blue-500 relative z-10`} />
            </div>
            {text && (
                <p className="animate-pulse text-sm font-medium text-zinc-500 dark:text-zinc-400 tracking-wide">
                    {text}
                </p>
            )}
        </div>
    )
}
