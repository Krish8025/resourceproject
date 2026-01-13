import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            role: string
        } & DefaultSession["user"]
    }
    interface User {
        role: string
    }
}


import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        // @ts-expect-error - types are correct but NextAuth beta types are tricky
        authorized({ auth, request: { nextUrl } }) {
            try {
                const isLoggedIn = !!auth?.user;
                const pathname = nextUrl.pathname;
                const isOnDashboard = pathname.startsWith('/dashboard') ||
                    pathname.startsWith('/resources') ||
                    pathname.startsWith('/allocations');

                if (isOnDashboard) {
                    return isLoggedIn;
                }

                if (isLoggedIn && (pathname === '/login' || pathname === '/signup')) {
                    // Prefer returning a redirect Response when available
                    try {
                        return Response.redirect(new URL('/dashboard', nextUrl));
                    } catch (err) {
                        console.error('Failed to create redirect Response in auth.authorized:', err);
                        // Fall through to allow default behavior
                        return true;
                    }
                }

                return true;
            } catch (err) {
                console.error('Error in auth.authorized callback:', err);
                // On unexpected error, disallow access to protected routes
                return false;
            }
        },
        async session({ session, token }: { session: any, token: any }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                session.user.role = token.role as string;
            }
            return session;
        },
        async jwt({ token, user }: { token: any, user: any }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        }
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
