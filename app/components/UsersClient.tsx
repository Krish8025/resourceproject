'use client'

import { useState } from 'react'
import { Mail, Shield, User as UserIcon, Pencil, Trash2, Plus, X, AlertCircle, Check, Search } from 'lucide-react'
import { createUser, updateUser, deleteUser, updateUserRole } from '@/app/actions/users'

type User = {
    id: number
    name: string
    email: string
    role: string
    createdAt: Date
}

type UsersClientProps = {
    users: User[]
    currentUserId: number
}

export function UsersClient({ users: initialUsers, currentUserId }: UsersClientProps) {
    const [users, setUsers] = useState(initialUsers)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Filter users based on search
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const refreshUsers = async () => {
        window.location.reload()
    }

    const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await createUser(formData)

        if (result.success) {
            setSuccess('User created successfully')
            setIsCreateModalOpen(false)
            setTimeout(() => setSuccess(null), 3000)
            refreshUsers()
        } else {
            setError(result.error || 'Failed to create user')
        }
        setLoading(false)
    }

    const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!selectedUser) return

        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await updateUser(selectedUser.id, formData)

        if (result.success) {
            setSuccess('User updated successfully')
            setIsEditModalOpen(false)
            setSelectedUser(null)
            setTimeout(() => setSuccess(null), 3000)
            refreshUsers()
        } else {
            setError(result.error || 'Failed to update user')
        }
        setLoading(false)
    }

    const handleDeleteUser = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return
        }

        setLoading(true)
        setError(null)

        const result = await deleteUser(userId)

        if (result.success) {
            setSuccess('User deleted successfully')
            setTimeout(() => setSuccess(null), 3000)
            refreshUsers()
        } else {
            setError(result.error || 'Failed to delete user')
        }
        setLoading(false)
    }

    const handleRoleChange = async (userId: number, newRole: string) => {
        setLoading(true)
        setError(null)

        const result = await updateUserRole(userId, newRole)

        if (result.success) {
            setSuccess('Role updated successfully')
            setTimeout(() => setSuccess(null), 3000)
            refreshUsers()
        } else {
            setError(result.error || 'Failed to update role')
        }
        setLoading(false)
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Users</h1>
                    <p className="mt-2 text-zinc-400">Manage system access and roles.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 hover:shadow-blue-500/30"
                >
                    <Plus className="h-4 w-4" />
                    Add User
                </button>
            </div>

            {/* Success Message */}
            {success && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-400 animate-in fade-in slide-in-from-top-2">
                    <Check className="h-4 w-4 flex-shrink-0" />
                    <p>{success}</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-1 glass backdrop-blur-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search users by name, email or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border-0 bg-transparent py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:ring-0 sm:leading-6"
                    />
                </div>
            </div>

            <div className="glass-card overflow-hidden rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 uppercase tracking-wider text-xs font-medium text-zinc-500">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Search className="h-8 w-8 text-zinc-600" />
                                            <p className="text-base font-medium text-white">No users found</p>
                                            <p className="text-sm">Try adjusting your search</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20">
                                                    {user.name[0].toUpperCase()}
                                                </div>
                                                <span className="font-medium text-white shadow-sm">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-3.5 w-3.5 text-zinc-500" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    disabled={user.id === currentUserId || loading || user.role === 'admin'}
                                                    className={`appearance-none rounded-full pl-3 pr-8 py-1 text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 outline-none ${user.role === 'admin'
                                                            ? 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20'
                                                            : user.role === 'faculty'
                                                                ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20'
                                                                : 'bg-zinc-800 text-zinc-400 ring-1 ring-white/10'
                                                        } ${user.id === currentUserId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    style={{ backgroundImage: 'none' }}
                                                >
                                                    <option value="student" className="bg-zinc-900">Student</option>
                                                    <option value="faculty" className="bg-zinc-900">Faculty</option>
                                                    <option value="admin" className="bg-zinc-900">Admin</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                                    <svg className="h-3 w-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user)
                                                        setIsEditModalOpen(true)
                                                    }}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                                                    title="Edit user"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    disabled={user.id === currentUserId || loading}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title={user.id === currentUserId ? "Cannot delete yourself" : "Delete user"}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
                    <div className="glass-card w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Create New User</h2>
                            <button
                                onClick={() => {
                                    setIsCreateModalOpen(false)
                                    setError(null)
                                }}
                                className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                                    Name
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                                    Role
                                </label>
                                <div className="relative">
                                    <select
                                        name="role"
                                        required
                                        className="w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                    >
                                        <option value="student" className="bg-zinc-900">Student</option>
                                        <option value="faculty" className="bg-zinc-900">Faculty</option>
                                        <option value="admin" className="bg-zinc-900">Admin</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                                    Password
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateModalOpen(false)
                                        setError(null)
                                    }}
                                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
                    <div className="glass-card w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Edit User</h2>
                            <button
                                onClick={() => {
                                    setIsEditModalOpen(false)
                                    setSelectedUser(null)
                                    setError(null)
                                }}
                                className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                                    Name
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    defaultValue={selectedUser.name}
                                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    defaultValue={selectedUser.email}
                                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                                    Role
                                </label>
                                <div className="relative">
                                    <select
                                        name="role"
                                        required
                                        disabled={selectedUser.role === 'admin'}
                                        className={`w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all ${selectedUser.role === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <option value="student" className="bg-zinc-900">Student</option>
                                        <option value="faculty" className="bg-zinc-900">Faculty</option>
                                        <option value="admin" className="bg-zinc-900">Admin</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                                {selectedUser.role === 'admin' && (
                                    <input type="hidden" name="role" value="admin" />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                                    Password (leave blank to keep current)
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    minLength={6}
                                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditModalOpen(false)
                                        setSelectedUser(null)
                                        setError(null)
                                    }}
                                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
