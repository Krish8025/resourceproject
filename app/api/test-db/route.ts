import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const userCount = await prisma.user.count()
        return NextResponse.json({ 
            success: true, 
            message: 'Database connected successfully',
            userCount 
        })
    } catch (error) {
        console.error('Database test failed:', error)
        return NextResponse.json({ 
            success: false, 
            error: 'Database connection failed',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
