/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			'onyx-bg': 'hsl(var(--onyx-bg))',
  			'charcoal-surface': 'hsl(var(--charcoal-surface))',
  			'slate-interactive': 'hsl(var(--slate-interactive))',
  			'graphite-border': 'hsl(var(--graphite-border))',
  			'dark-walnut': 'hsl(var(--dark-walnut))',
  			'natural-oak': 'hsl(var(--natural-oak))',
  			'birch-highlight': 'hsl(var(--birch-highlight))',
  			'ivory-paper': 'hsl(var(--ivory-paper))',
  			'parchment-card': 'hsl(var(--parchment-card))',
  			'alabaster-hover': 'hsl(var(--alabaster-hover))',
  			'stone-border-light': 'hsl(var(--stone-border-light))',
  			'willow-green-primary': 'hsl(var(--willow-green-primary))',
  			'dusty-blue-secondary': 'hsl(var(--dusty-blue-secondary))',
  			'powder-peach-accent': 'hsl(var(--powder-peach-accent))',
  			'lavender-frost-info': 'hsl(var(--lavender-frost-info))',
  			'text-primary-on-dark': 'hsl(var(--text-primary-on-dark))',
  			'text-secondary-on-dark': 'hsl(var(--text-secondary-on-dark))',
  			'text-primary-on-light': 'hsl(var(--text-primary-on-light))',
  			'text-secondary-on-light': 'hsl(var(--text-secondary-on-light))',
  			'text-on-accent': 'hsl(var(--text-on-accent))',
  			'success-green': 'hsl(var(--success-green))',
  			'warning-amber': 'hsl(var(--warning-amber))',
  			'error-rose': 'hsl(var(--error-rose))',
  			'info-blue': 'hsl(var(--info-blue))',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: 0
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: 0
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} 