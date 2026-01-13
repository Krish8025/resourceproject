'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
})

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['student', 'faculty', 'admin'])
})

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        console.log('Login attempt for:', email)

        // Validate input
        const validatedFields = loginSchema.safeParse({ email, password })
        
        if (!validatedFields.success) {
            console.log('Validation failed:', validatedFields.error.errors)
            return validatedFields.error.errors[0].message
        }

        // Attempt sign in with NextAuth
        await signIn('credentials', { 
            email, 
            password,
            redirectTo: '/dashboard'
        })

        return null
    } catch (error) {
        console.error('Authentication error:', error)
        
        if (error instanceof AuthError) {
            console.log('AuthError type:', error.type)
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid email or password'
                default:
                    return 'Something went wrong. Please try again.'
            }
        }
        // Re-throw to allow NextAuth to handle redirects
        throw error
    }
}

export async function register(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const role = (formData.get('role') as string) || 'student'

        // Validate input
        const validatedFields = registerSchema.safeParse({ name, email, password, role })
        
        if (!validatedFields.success) {
            return validatedFields.error.errors[0].message
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedFields.data.email }
        })

        if (existingUser) {
            return 'An account with this email already exists'
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10)

        // Create user
        await prisma.user.create({
            data: {
                name: validatedFields.data.name,
                email: validatedFields.data.email,
                password: hashedPassword,
                role: validatedFields.data.role
            }
        })

        return 'success'
    } catch (error) {
        console.error('Registration error:', error)
        
        if (error instanceof AuthError) {
            return 'Account created but login failed. Please login manually.'
        }
        
        // Re-throw to allow NextAuth to handle redirects
        throw error
    }
}
