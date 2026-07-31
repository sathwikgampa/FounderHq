---
version: 1.0.0
name: BlockNest Design System
description: A futuristic Web3 landing page system featuring glass cards, depth effects, and neon-tinged lighting.
colors:
  background: '#05060E'
  surface: '#0B0C15'
  surface-glass: 'rgba(19, 20, 31, 0.7)'
  primary: '#9333EA'
  secondary: '#4F46E5'
  accent-pink: '#F472B6'
  accent-emerald: '#10B981'
  text-main: '#FFFFFF'
  text-muted: '#94A3B8'
  border-low: 'rgba(255, 255, 255, 0.08)'
  border-purple: 'rgba(168, 85, 247, 0.3)'
typography:
  family: "'Inter', sans-serif"
  h1:
    size: '4.5rem'
    weight: '600'
    lineHeight: '1.1'
    letterSpacing: '-0.025em'
  h2:
    size: '3.75rem'
    weight: '600'
    lineHeight: '1.1'
  body:
    size: '1.125rem'
    weight: '400'
    lineHeight: '1.625'
  caption:
    size: '0.75rem'
    weight: '500'
    letterSpacing: '0.05em'
spacing:
  xs: '4px'
  sm: '12px'
  md: '24px'
  lg: '40px'
  xl: '80px'
  section-gap: '128px'
rounded:
  sm: '8px'
  md: '12px'
  lg: '16px'
  xl: '24px'
  full: '999px'
components:
  nav:
    fixed: false
    padding: '24px'
    blur: 'none'
  glass-card:
    backdrop: 'blur(16px)'
    border: '1px solid rgba(255, 255, 255, 0.08)'
    shadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
  hero-button:
    rounding: '999px'
    gradient: 'from-purple-600 to-indigo-600'
    shadow: '0 0 20px rgba(147, 51, 234, 0.4)'
  stat-counter:
    text-gradient: 'from-purple-300 via-pink-400 to-indigo-400'
    font-size: '72px'
  swap-interface:
    nested-bg: '#0B0C15/50'
    overlap-z: '20'
motion:
  curve: 'cubic-bezier(0.16, 1, 0.3, 1)'
  duration: '1000ms'
  reveal-distance: '40px'
---

## Overview

BlockNest is a sophisticated visual language for the decentralized web. It focuses on the interplay between dark void space and vibrant, light-emitting components. The system uses a curved horizon motif to suggest scale and infinite potential.

## Colors

The palette is rooted in `#05060E` (Deep Space). It uses purple and indigo as the primary energy sources, with emerald and rose reserved for financial status indicators (up/down). Text uses slate-tinged whites to reduce high-contrast strain while maintaining readability.

## Typography

Relies exclusively on 'Inter'. Hierarchies are established through extreme scale shifts (e.g., 72px headings vs 12px captions). Tracking is tightened for headings (-0.025em) and loosened for uppercase labels (0.1em).

## Spacing

A generous spacing system that prioritizes negative space. Standard section vertical padding is 128px (32rem). Component gaps use a base-4 grid, primarily 24px and 40px.

## Layout

- **Curved Horizon**: A fixed-position decorative arc creates a pseudo-3D ground plane.
- **Masonry Grid**: Content cards use varied heights or offset positioning to feel organic.
- **Perspective Stacks**: Dashboard previews use `perspective-1000` to tilt elements towards the viewer.
- **Z-Index Strategy**: Background Spline (0) < Ambient Glows (5) < Curved Horizon (10) < Main Content (20) < Navigation (50).

## Elevation & Depth

Depth is achieved through `backdrop-filter: blur(16px)` and variable border opacities. Shadows are rarely black; they are tinted with the primary purple glow to simulate light scattering in a dark environment.

## Shapes

Cards use a large 24px radius (`rounded-3xl`). Buttons use a pill-shaped `rounded-full` style. Icon containers use a smaller 12px radius to provide structural contrast.

## Components

- **Glass Cards**: Semi-transparent containers with subtle top-weighted borders to simulate light catching the edge.
- **Stats**: Oversized numbers with text-shadow and linear gradients.
- **Swap Interface**: Layered inputs with absolute-positioned central icons for transaction flow.
- **Partner Strip**: Grayscale logos with a hover-transition to brand colors.

## Motion

- **Scroll Reveal**: Elements use a combination of opacity and translation (up, right, or bottom-right).
- **Staggering**: Sequential delays of 100ms units (delay-100 to delay-500) guide the user's eye.
- **Interactive Hover**: Hovering over cards triggers a subtle -4px Y-axis lift and border color intensification.

## Do's and Don'ts

- **Do**: Use text gradients for secondary headers and major stats.
- **Do**: Apply glassmorphism to all floating interface elements.
- **Don't**: Use solid white backgrounds; always use semi-transparent dark fills.
- **Don't**: Use sharp 90-degree corners on primary UI containers.

## Accessibility

- Focus states must be indicated with a purple glow rather than a standard outline.
- High-importance text must maintain a contrast ratio against the dark background by using Slate-200 or lighter.
- Interactive zones (buttons/links) should have a minimum height of 44px.
