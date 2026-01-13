'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const userSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    role: z.enum(['student', 'faculty', 'admin'], {
        errorMap: () => ({ message: 'Role must be student, faculty, or admin' })
    }),
    password: z.string().min(6, 'Password must be at least 6 characters').optional()
})

// Check if user is admin
async function requireAdmin() {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required')
    }
    return session
}

export async function getUsers() {
    try {
        await requireAdmin()
        
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return { success: true, users }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function createUser(formData: FormData) {
    try {
        await requireAdmin()

        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const role = formData.get('role') as string
        const password = formData.get('password') as string

        const validatedFields = userSchema.safeParse({ name, email, role, password })
        
        if (!validatedFields.success) {
            return { success: false, error: validatedFields.error.errors[0].message }
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedFields.data.email }
        })

        if (existingUser) {
            return { success: false, error: 'User with this email already exists' }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedFields.data.password!, 10)

        // Create user
        await prisma.user.create({
            data: {
                name: validatedFields.data.name,
                email: validatedFields.data.email,
                role: validatedFields.data.role,
                password: hashedPassword
            }
        })

        revalidatePath('/users')
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function updateUser(userId: number, formData: FormData) {
    try {
        await requireAdmin()

        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const role = formData.get('role') as string
        const password = formData.get('password') as string

        const validatedFields = userSchema.safeParse({ 
            name, 
            email, 
            role, 
            password: password || undefined 
        })
        
        if (!validatedFields.success) {
            return { success: false, error: validatedFields.error.errors[0].message }
        }

        // Check if email is taken by another user
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedFields.data.email }
        })

        if (existingUser && existingUser.id !== userId) {
            return { success: false, error: 'Email is already taken by another user' }
        }

        // Prepare update data
        const updateData: any = {
            name: validatedFields.data.name,
            email: validatedFields.data.email,
            role: validatedFields.data.role
        }

        // Only update password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        await prisma.user.update({
            where: { id: userId },
            data: updateData
        })

        revalidatePath('/users')
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteUser(userId: number) {
    try {
        const session = await requireAdmin()

        // Prevent deleting self
        if (session.user.id === userId) {
            return { success: false, error: 'Cannot delete your own account' }
        }

        await prisma.user.delete({
            where: { id: userId }
        })

        revalidatePath('/users')
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function updateUserRole(userId: number, newRole: string) {
    try {
        const session = await requireAdmin()

        // Validate role
        if (!['student', 'faculty', 'admin'].includes(newRole)) {
            return { success: false, error: 'Invalid role' }
        }

        // Prevent changing own role
        if (session.user.id === userId) {
            return { success: false, error: 'Cannot change your own role' }
        }

        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole }
        })

        revalidatePath('/users')
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
