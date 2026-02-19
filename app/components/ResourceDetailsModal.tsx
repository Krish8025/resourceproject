'use client'

import { X, Building2, Layers, Wifi, Box } from 'lucide-react'

export default function ResourceDetailsModal({ resource, onClose }: { resource: any, onClose: () => void }) {
    if (!resource) return null

    const facilities = Array.isArray(resource.facilities) ? resource.facilities : []
    const cupboards = Array.isArray(resource.cupboards) ? resource.cupboards : []

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-2xl transform rounded-2xl bg-[var(--modal-bg)] shadow-2xl transition-all border border-border my-8" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border p-6">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">{resource.name}</h2>
                            <p className="mt-1 text-sm text-muted-foreground font-medium">{resource.type?.name || 'Unknown Type'}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-8">
                        {/* Location Grid */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Building Card */}
                            <div className="group rounded-xl bg-secondary p-4 transition-colors hover:bg-[var(--hover)]">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-[#1d9bf0]/10 text-[#1d9bf0] rounded-lg">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-semibold text-muted-foreground">Building</span>
                                </div>
                                <p className="text-lg font-bold text-foreground pl-1">{resource.building?.name || 'Not assigned'}</p>
                                {resource.building?.buildingNumber && (
                                    <p className="text-xs text-muted-foreground pl-1 mt-0.5 font-medium">{resource.building.buildingNumber}</p>
                                )}
                            </div>

                            {/* Floor Card */}
                            <div className="group rounded-xl bg-secondary p-4 transition-colors hover:bg-[var(--hover)]">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                                        <Layers className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-semibold text-muted-foreground">Floor</span>
                                </div>
                                <p className="text-lg font-bold text-foreground pl-1">
                                    {resource.floorNumber === 0 ? 'Ground Floor' : resource.floorNumber != null ? `Level ${resource.floorNumber}` : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        {resource.description && (
                            <div className="rounded-xl bg-secondary p-4">
                                <p className="text-sm text-muted-foreground font-medium mb-2">Description</p>
                                <p className="text-foreground text-sm leading-relaxed">{resource.description}</p>
                            </div>
                        )}

                        {/* Facilities */}
                        {facilities.length > 0 && (
                            <div>
                                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    <Wifi className="h-4 w-4" />
                                    Available Facilities
                                </h3>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {facilities.map((facility: any) => (
                                        <div key={facility.id} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 shadow-sm hover:border-[#1d9bf0]/30 transition-colors">
                                            <div className="h-2 w-2 mt-2 rounded-full bg-emerald-500 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                            <div>
                                                <p className="font-semibold text-foreground">{facility.name}</p>
                                                {facility.details && (
                                                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{facility.details}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Storage */}
                        {cupboards.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-4 border-t border-border pt-8">
                                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                        <Box className="h-4 w-4" />
                                        Storage Configuration
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {cupboards.map((cupboard: any) => {
                                        const shelves = Array.isArray(cupboard.shelves) ? cupboard.shelves : []
                                        return (
                                            <div key={cupboard.id} className="rounded-xl border border-border bg-secondary overflow-hidden">
                                                <div className="bg-card px-4 py-3 flex justify-between items-center border-b border-border">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-1 bg-[#1d9bf0] rounded-full" />
                                                        <span className="font-semibold text-foreground">{cupboard.name}</span>
                                                    </div>
                                                    <span className="text-xs font-medium px-2 py-1 bg-secondary text-muted-foreground rounded-md">{cupboard.totalShelves || shelves.length} Shelves</span>
                                                </div>
                                                {shelves.length > 0 && (
                                                    <div className="p-4 grid gap-3">
                                                        {shelves.map((shelf: any) => (
                                                            <div key={shelf.id} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-card transition-colors">
                                                                <span className="text-muted-foreground font-medium">Shelf {shelf.shelfNumber}</span>
                                                                <div className="text-right flex items-center gap-3">
                                                                    <span className="text-foreground font-semibold">{shelf.description}</span>
                                                                    <span className="text-xs px-1.5 py-0.5 bg-[var(--badge-bg)] text-muted-foreground rounded font-medium">Cap: {shelf.capacity}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {facilities.length === 0 && cupboards.length === 0 && (
                            <div className="py-12 text-center rounded-xl bg-secondary border border-border">
                                <p className="text-muted-foreground text-sm font-medium">
                                    No additional facilities configured.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
