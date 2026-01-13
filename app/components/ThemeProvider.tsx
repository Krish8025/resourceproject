'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light'

type ThemeContextType = {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Hardcode theme to light
    const theme: Theme = 'light'

    useEffect(() => {
        // Ensure dark mode class is removed
        document.documentElement.classList.remove('dark')
        // Clean up any local storage setting
        localStorage.removeItem('theme')
    }, [])

    const toggleTheme = () => {
        // No-op for now as we are enforcing light mode
        console.log('Theme toggle is currently disabled to enforce white theme')
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
