'use client'

import { X, Building2, Layers, Wifi, Box } from 'lucide-react'

export default function ResourceDetailsModal({ resource, onClose }: { resource: any, onClose: () => void }) {
    if (!resource) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 overflow-hidden max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{resource.name}</h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{resource.type.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-8 pr-2">
                    {/* Location Info */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                            <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                                <Building2 className="h-4 w-4" />
                                <span className="text-sm font-semibold">Building</span>
                            </div>
                            <p className="font-medium text-zinc-900 dark:text-zinc-50">{resource.building.name} ({resource.building.buildingNumber})</p>
                        </div>
                        <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                            <div className="flex items-center gap-2 mb-2 text-green-600 dark:text-green-400">
                                <Layers className="h-4 w-4" />
                                <span className="text-sm font-semibold">Floor</span>
                            </div>
                            <p className="font-medium text-zinc-900 dark:text-zinc-50">
                                {resource.floorNumber === 0 ? 'Ground Floor' : `Level ${resource.floorNumber}`}
                            </p>
                        </div>
                    </div>

                    {/* Facilities */}
                    {resource.facilities.length > 0 && (
                        <div>
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                <Wifi className="h-4 w-4" />
                                Facilities
                            </h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {resource.facilities.map((facility: any) => (
                                    <div key={facility.id} className="flex items-start gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                                        <div className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
                                        <div>
                                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{facility.name}</p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{facility.details}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Storage / Cupboards */}
                    {resource.cupboards.length > 0 && (
                        <div>
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                <Box className="h-4 w-4" />
                                Storage Units
                            </h3>
                            <div className="space-y-4">
                                {resource.cupboards.map((cupboard: any) => (
                                    <div key={cupboard.id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                                        <div className="bg-zinc-50 p-3 flex justify-between items-center border-b border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800">
                                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{cupboard.name}</span>
                                            <span className="text-xs text-zinc-500">{cupboard.totalShelves} Shelves</span>
                                        </div>
                                        <div className="p-3 grid gap-2">
                                            {cupboard.shelves.map((shelf: any) => (
                                                <div key={shelf.id} className="flex items-center justify-between text-sm py-1">
                                                    <span className="text-zinc-600 dark:text-zinc-400">Shelf {shelf.shelfNumber}</span>
                                                    <div className="text-right">
                                                        <span className="text-zinc-900 dark:text-zinc-50 font-medium">{shelf.description}</span>
                                                        <span className="text-zinc-400 text-xs ml-2">(Cap: {shelf.capacity})</span>
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
                        <div className="py-8 text-center text-zinc-500 text-sm italic border border-dashed border-zinc-200 rounded-xl dark:border-zinc-800">
                            No additional facilities or storage details available.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
