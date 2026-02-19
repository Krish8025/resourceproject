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
        await prisma.$transaction(async (tx) => {
            // Update the resource status
            await tx.resource.update({
                where: { id: resourceId },
                data: { status },
            })

            if (status === "Maintenance") {
                // Create a maintenance record so it shows in the Maintenance page
                await tx.maintenance.create({
                    data: {
                        resourceId,
                        type: "General",
                        status: "Pending",
                        scheduledDate: new Date(),
                        notes: "Status set to Maintenance by admin",
                    },
                })
            } else {
                // If moving away from Maintenance, complete any pending/in-progress maintenance
                await tx.maintenance.updateMany({
                    where: {
                        resourceId,
                        status: { in: ["Pending", "Scheduled", "InProgress"] },
                    },
                    data: { status: "Completed" },
                })
            }
        })

        revalidatePath("/resources")
        revalidatePath("/maintenance")
        revalidatePath("/allocations")
        return { success: true }
    } catch (error) {
        console.error("Failed to update resource status:", error)
        return { success: false, error: "Failed to update resource status" }
    }
}
