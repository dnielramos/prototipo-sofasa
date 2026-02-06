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
                    // Light Theme Colors
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

                    // Primary Blue Palette
                    'blue-light': '#dbeafe',  // Blue background
                    'blue': '#3b82f6',        // Primary blue
                    'blue-dark': '#2563eb',   // Blue hover
                    'blue-darker': '#1d4ed8', // Blue active

                    // Semantic Colors
                    success: '#10b981',
                    'success-light': '#d1fae5',
                    warning: '#f59e0b',
                    'warning-light': '#fef3c7',
                    danger: '#ef4444',
                    'danger-light': '#fee2e2'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'sofasa-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'sofasa': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'sofasa-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'sofasa-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            }
        },
    },
    plugins: [],
}
