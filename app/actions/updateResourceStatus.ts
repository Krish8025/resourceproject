"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function updateResourceStatus(resourceId: number, status: string) {
    const session = await auth()

    if (session?.user?.role !== "admin") {
        return { success: false, error: "Unauthorized" }
    }

    try {
        await prisma.resource.update({
            where: { id: resourceId },
            data: { status },
        })

        revalidatePath("/resources")
        return { success: true }
    } catch (error) {
        console.error("Failed to update resource status:", error)
        return { success: false, error: "Failed to update resource status" }
    }
}
