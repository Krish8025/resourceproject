'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { authenticate } from '@/app/actions/auth'
import { Loader2, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'

function LoginButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            className="group relative mt-6 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={pending}
        >
            <span className="relative flex items-center justify-center gap-2">
                {pending ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Signing in...</span>
                    </>
                ) : (
                    <>
                        <span>Sign In</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                )}
            </span>
        </button>
    )
}

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined)

    return (
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/50 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="mb-8 text-center">
                    <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        Sign in to continue to ResourceMgr
                    </p>
                </div>

                <form action={dispatch} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Email Address
                        </label>
                        <input
                            className="w-full rounded-xl border-zinc-200 bg-white/50 px-4 py-3 text-sm outline-none ring-2 ring-transparent transition-all placeholder:text-zinc-400 hover:border-blue-400 focus:border-blue-500 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:hover:border-blue-500"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Password
                        </label>
                        <input
                            className="w-full rounded-xl border-zinc-200 bg-white/50 px-4 py-3 text-sm outline-none ring-2 ring-transparent transition-all placeholder:text-zinc-400 hover:border-blue-400 focus:border-blue-500 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:hover:border-blue-500"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <LoginButton />

                    {errorMessage && (
                        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <p>{errorMessage}</p>
                        </div>
                    )}
                </form>

                <div className="mt-6 border-t border-zinc-200 pt-6 text-center text-sm dark:border-zinc-800">
                    <p className="text-zinc-500">Don't have an account?</p>
                    <Link href="/signup" className="mt-1 inline-block font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        Create an account
                    </Link>
                </div>
            </div>

            {/* Decorative background effects */}
            <div className="-z-10 absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="-z-10 absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>
    )
}
