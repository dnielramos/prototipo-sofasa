/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                sofasa: {
                    // Light Theme Colors (Extended)
                    50: '#f8fafc',   // Lightest background
                    100: '#f1f5f9',  // Card backgrounds
                    200: '#e2e8f0',  // Borders light
                    300: '#cbd5e1',  // Borders
                    400: '#94a3b8',  // Muted text
                    500: '#64748b',  // Secondary text
                    600: '#475569',  // Primary text
                    700: '#334155',  // Dark text
                    800: '#1e293b',  // Headings
                    900: '#0f172a',  // Darkest text

                    // Primary Blue Palette (Extended)
                    'blue-50': '#eff6ff',     // Very light blue
                    'blue-100': '#dbeafe',    // Light blue bg
                    'blue-200': '#bfdbfe',    // Blue borders
                    'blue-light': '#dbeafe',  // Alias
                    'blue': '#3b82f6',        // Primary blue
                    'blue-500': '#3b82f6',    // Primary blue
                    'blue-600': '#2563eb',    // Blue hover
                    'blue-dark': '#2563eb',   // Alias
                    'blue-700': '#1d4ed8',    // Blue active
                    'blue-darker': '#1d4ed8', // Alias
                    'blue-900': '#1e3a8a',    // Dark blue text

                    // Semantic Colors (Enhanced)
                    success: '#10b981',
                    'success-dark': '#059669',
                    'success-light': '#d1fae5',
                    warning: '#f59e0b',
                    'warning-dark': '#d97706',
                    'warning-light': '#fef3c7',
                    danger: '#ef4444',
                    'danger-dark': '#dc2626',
                    'danger-light': '#fee2e2',
                    info: '#3b82f6',
                    'info-light': '#dbeafe'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                // Standard shadows (enhanced)
                'sofasa-xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'sofasa-sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'sofasa': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'sofasa-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'sofasa-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                'sofasa-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                'sofasa-2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',

                // Colored shadows for premium hover effects
                'blue-glow': '0 8px 16px -4px rgba(59, 130, 246, 0.3)',
                'blue-glow-lg': '0 12px 24px -6px rgba(59, 130, 246, 0.35)',
                'green-glow': '0 8px 16px -4px rgba(16, 185, 129, 0.3)',
                'card-hover': '0 12px 24px -8px rgb(0 0 0 / 0.15), 0 4px 12px -4px rgb(0 0 0 / 0.1)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
