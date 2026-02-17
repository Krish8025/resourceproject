'use client'

import { X, Building2, Layers, Wifi, Box } from 'lucide-react'

export default function ResourceDetailsModal({ resource, onClose }: { resource: any, onClose: () => void }) {
    if (!resource) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-2xl transform rounded-2xl bg-white shadow-2xl transition-all dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 my-8">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-zinc-100 p-6 dark:border-zinc-800">
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{resource.name}</h2>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 font-medium">{resource.type.name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 dark:hover:bg-zinc-800 transition-all"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-8">
                        {/* Location Grid */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Building Card */}
                            <div className="group rounded-xl bg-zinc-50 p-4 transition-colors hover:bg-zinc-100/80 dark:bg-zinc-800/50 dark:hover:bg-zinc-800">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-500/10 dark:text-blue-400">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Building</span>
                                </div>
                                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50 pl-1">{resource.building.name}</p>
                                <p className="text-xs text-zinc-500 pl-1 mt-0.5 font-medium">{resource.building.buildingNumber}</p>
                            </div>

                            {/* Floor Card */}
                            <div className="group rounded-xl bg-zinc-50 p-4 transition-colors hover:bg-zinc-100/80 dark:bg-zinc-800/50 dark:hover:bg-zinc-800">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg dark:bg-green-500/10 dark:text-green-400">
                                        <Layers className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Floor</span>
                                </div>
                                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50 pl-1">
                                    {resource.floorNumber === 0 ? 'Ground Floor' : `Level ${resource.floorNumber}`}
                                </p>
                            </div>
                        </div>

                        {/* Facilities */}
                        {resource.facilities.length > 0 && (
                            <div>
                                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                    <Wifi className="h-4 w-4" />
                                    Available Facilities
                                </h3>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {resource.facilities.map((facility: any) => (
                                        <div key={facility.id} className="flex items-start gap-4 rounded-xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                                            <div className="h-2 w-2 mt-2 rounded-full bg-emerald-500 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                            <div>
                                                <p className="font-semibold text-zinc-900 dark:text-zinc-50">{facility.name}</p>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{facility.details}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Storage */}
                        {resource.cupboards.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-4 border-t border-zinc-100 pt-8 dark:border-zinc-800">
                                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                        <Box className="h-4 w-4" />
                                        Storage Configuration
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {resource.cupboards.map((cupboard: any) => (
                                        <div key={cupboard.id} className="rounded-xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50 overflow-hidden">
                                            <div className="bg-white px-4 py-3 flex justify-between items-center border-b border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700/50">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-1 bg-blue-500 rounded-full" />
                                                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">{cupboard.name}</span>
                                                </div>
                                                <span className="text-xs font-medium px-2 py-1 bg-zinc-100 text-zinc-600 rounded-md dark:bg-zinc-700 dark:text-zinc-300">{cupboard.totalShelves} Shelves</span>
                                            </div>
                                            <div className="p-4 grid gap-3">
                                                {cupboard.shelves.map((shelf: any) => (
                                                    <div key={shelf.id} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors">
                                                        <span className="text-zinc-500 font-medium dark:text-zinc-400">Shelf {shelf.shelfNumber}</span>
                                                        <div className="text-right flex items-center gap-3">
                                                            <span className="text-zinc-900 dark:text-zinc-50 font-semibold">{shelf.description}</span>
                                                            <span className="text-xs px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded font-medium">Cap: {shelf.capacity}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {resource.facilities.length === 0 && resource.cupboards.length === 0 && (
                            <div className="py-12 text-center rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                                <p className="text-zinc-500 text-sm font-medium">
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
