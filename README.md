# HavTalk - Telegram Bot SaaS Landing Page

A modern, unique SaaS landing page for a Telegram bot built with Next.js 14, TypeScript, and shadcn/ui components.

## Features

This landing page features a Neo-Brutalist design style with:

- **Responsive Design**: Mobile-first approach with breakpoints for all device sizes
- **Modern Design Elements**:
  - Bold typography and geometric shapes
  - Gradient color scheme that transitions on scroll
  - Custom cursor effect that interacts with UI elements
  - Subtle parallax scrolling effects
  - Micro-interactions and animations throughout

### Core Components

- **Header** with animated logo transition, navigation, and CTA button
- **Hero Section** with 3D mockup of the Telegram bot
- **Features Section** with interactive cards that reveal details on hover
- **Pricing Tiers** with toggle between monthly/yearly billing
- **Testimonials Carousel** with confetti animation on scroll
- **FAQ Accordion** with custom animations
- **Call-to-Action Section** with floating elements
- **Footer** with links, social media, and newsletter signup

### Technical Implementation

- **Theming**: Dark and light mode support with shadcn/ui
- **Custom Animations**: Implemented with CSS variables and keyframes
- **Performance Optimized**: Next.js Image component and code splitting
- **Type Safety**: TypeScript interfaces for all component props
- **Custom Hooks**: Animation and theme management
- **Atomic Design**: Structured component hierarchy

### Extras

- **Chat Demo Widget**: Mimics the Telegram bot functionality
- **Easter Egg**: Trigger a special animation by typing "havtalk"
- **Custom Cursor**: Unique cursor that reacts to interactive elements

## Getting Started

### Prerequisites

- Node.js (version 14.x or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/havtalk.git
cd havtalk
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/             # Next.js App Router
├── components/      # React components
│   ├── ui/          # UI components from shadcn/ui
│   └── ...          # Custom components
├── lib/             # Utility functions
└── ...
```

## Customization

### Colors

The color scheme is defined in `src/app/globals.css` with CSS variables. You can modify the Neo-Brutalist color palette there.

### Typography

The project uses the following fonts:
- **Rubik**: For display text (headings)
- **Jost**: For body text
- **Geist Sans**: For UI elements
- **Geist Mono**: For monospace text

### Animations

Custom animations are defined in `src/app/globals.css` and used throughout the components.

## Easter Egg

Type "havtalk" anywhere on the page to trigger a special animation.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
