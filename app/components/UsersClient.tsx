'use client'

import { useState } from 'react'
import { Mail, Shield, User as UserIcon, Pencil, Trash2, Plus, X, AlertCircle, Check } from 'lucide-react'
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Users</h1>
                    <p className="mt-2 text-zinc-500 dark:text-zinc-400">Manage system access and roles.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-transform"
                >
                    <Plus className="h-4 w-4" />
                    Add User
                </button>
            </div>

            {/* Success Message */}
            {success && (
                <div className="flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400 animate-in fade-in slide-in-from-top-2">
                    <Check className="h-4 w-4 flex-shrink-0" />
                    <p>{success}</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Email</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Joined</th>
                                <th className="px-6 py-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-bold text-xs">
                                                {user.name[0].toUpperCase()}
                                            </div>
                                            <span className="font-medium text-zinc-900 dark:text-zinc-50">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-zinc-400" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            disabled={user.id === currentUserId || loading || user.role === 'admin'}
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize cursor-pointer border-0 ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 opacity-100 cursor-not-allowed'
                                                : user.role === 'faculty'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                    : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                                                } ${user.id === currentUserId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <option value="student">student</option>
                                            <option value="faculty">faculty</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user)
                                                    setIsEditModalOpen(true)
                                                }}
                                                className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 dark:hover:bg-blue-900/20 dark:text-blue-400 transition-colors"
                                                title="Edit user"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                disabled={user.id === currentUserId || loading}
                                                className="p-2 rounded-lg hover:bg-red-50 text-red-600 dark:hover:bg-red-900/20 dark:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title={user.id === currentUserId ? "Cannot delete yourself" : "Delete user"}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Create New User</h2>
                            <button
                                onClick={() => {
                                    setIsCreateModalOpen(false)
                                    setError(null)
                                }}
                                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Name
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    required
                                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                >
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Password
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateModalOpen(false)
                                        setError(null)
                                    }}
                                    className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Edit User</h2>
                            <button
                                onClick={() => {
                                    setIsEditModalOpen(false)
                                    setSelectedUser(null)
                                    setError(null)
                                }}
                                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Name
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    defaultValue={selectedUser.name}
                                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    defaultValue={selectedUser.email}
                                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    required
                                    disabled={selectedUser.role === 'admin'}
                                    className={`w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white ${selectedUser.role === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {selectedUser.role === 'admin' && (
                                    <input type="hidden" name="role" value="admin" />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Password (leave blank to keep current)
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    minLength={6}
                                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditModalOpen(false)
                                        setSelectedUser(null)
                                        setError(null)
                                    }}
                                    className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
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
