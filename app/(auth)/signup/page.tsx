'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { register } from '@/app/actions/auth'
import { Loader2, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function SignupButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            className="group relative mt-6 w-full overflow-hidden rounded-xl bg-[#1d9bf0] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1d9bf0]/20 transition-all hover:scale-[1.02] hover:bg-[#1a8cd8] hover:shadow-[#1d9bf0]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={pending}
        >
            <span className="relative flex items-center justify-center gap-2">
                {pending ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Creating account...</span>
                    </>
                ) : (
                    <>
                        <span>Create Account</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                )}
            </span>
        </button>
    )
}

export default function SignupPage() {
    const [errorMessage, dispatch] = useActionState(register, undefined)
    const router = useRouter()

    useEffect(() => {
        if (errorMessage === 'success') {
            router.push('/login')
        }
    }, [errorMessage, router])

    return (
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-2xl backdrop-blur-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#1d9bf0]">
                        Get Started
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Create your account to manage resources
                    </p>
                </div>

                <form action={dispatch} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Full Name
                        </label>
                        <input
                            className="w-full rounded-xl border border-border bg-[var(--input-bg)] px-4 py-3 text-sm text-foreground outline-none ring-2 ring-transparent transition-all placeholder:text-muted-foreground hover:border-[#1d9bf0]/40 focus:border-[#1d9bf0] focus:ring-[#1d9bf0]/20"
                            name="name"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Email Address
                        </label>
                        <input
                            className="w-full rounded-xl border border-border bg-[var(--input-bg)] px-4 py-3 text-sm text-foreground outline-none ring-2 ring-transparent transition-all placeholder:text-muted-foreground hover:border-[#1d9bf0]/40 focus:border-[#1d9bf0] focus:ring-[#1d9bf0]/20"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Password
                        </label>
                        <input
                            className="w-full rounded-xl border border-border bg-[var(--input-bg)] px-4 py-3 text-sm text-foreground outline-none ring-2 ring-transparent transition-all placeholder:text-muted-foreground hover:border-[#1d9bf0]/40 focus:border-[#1d9bf0] focus:ring-[#1d9bf0]/20"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <SignupButton />

                    {errorMessage && typeof errorMessage === 'string' && (
                        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <p>{errorMessage}</p>
                        </div>
                    )}
                </form>

                <div className="mt-6 border-t border-border pt-6 text-center text-sm">
                    <p className="text-muted-foreground">Already have an account?</p>
                    <Link href="/login" className="mt-1 inline-block font-semibold text-[#1d9bf0] hover:text-[#1a8cd8]">
                        Sign in
                    </Link>
                </div>
            </div>

            {/* Decorative background effects */}
            <div className="-z-10 absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#1d9bf0]/10 blur-3xl" />
            <div className="-z-10 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#1d9bf0]/5 blur-3xl" />
        </div>
    )
}
