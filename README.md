# Limex Landing Page

A modern, responsive landing page built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- **Modern Design**: Clean, minimalist interface inspired by OpenAI's design
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Component Library**: Built with shadcn/ui components for consistency
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Interactive Search**: Functional search with modal authorization
- **Professional Footer**: Complete footer with company information and social links

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   └── ui/           # shadcn/ui components
├── lib/
│   └── utils.ts      # Utility functions
├── App.tsx           # Main application component
├── main.tsx          # Application entry point
└── index.css         # Global styles and Tailwind imports
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Lucide React** - Icons
- **Radix UI** - Accessible primitives

## Components

The landing page includes:

- **Brand** - Logo and company name
- **Topbar** - Search and login buttons
- **Sidebar** - Navigation menu (desktop only)
- **CenterSearch** - Main search interface with chips and modal
- **FeaturedGrid** - Product showcase cards
- **Footer** - Complete footer with links and social media
- **AuthModal** - Authorization modal with filter options

## Key Features

- **Interactive Search**: Users can type queries and get authorization prompts
- **Modal Authorization**: Professional modal with filter options
- **Responsive Design**: Works on all device sizes
- **Modern UI**: Clean design with hover effects and transitions
- **Social Integration**: Links to all Limex social media platforms

## Customization

You can easily customize:

- Colors and themes in `tailwind.config.js`
- Component styles in individual component files
- Content by modifying the data arrays in `App.tsx`
- Layout by adjusting Tailwind classes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
