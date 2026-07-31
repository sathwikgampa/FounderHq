---
version: 1.0.0
name: Fluxora Design System
description: A sophisticated, dark-mode aesthetic for high-tech AI products, featuring deep neutrals and vibrant blue accents.
colors:
  background: '#0a0a0a'
  foreground: '#ffffff'
  neutral-950: '#0a0a0a'
  neutral-900: '#171717'
  neutral-300: '#d4d4d4'
  blue-400: '#60a5fa'
  blue-300: '#93c5fd'
  emerald-400: '#34d399'
  rose-400: '#fb7185'
  white-5: 'rgba(255, 255, 255, 0.05)'
  white-10: 'rgba(255, 255, 255, 0.1)'
typography:
  family: 'Inter, system-ui, sans-serif'
  h1:
    size: '72px'
    weight: '700'
    tracking: '-0.05em'
  h2:
    size: '48px'
    weight: '600'
    tracking: '-0.025em'
  body:
    size: '16px'
    weight: '400'
    lineHeight: '1.6'
  caption:
    size: '11px'
    weight: '500'
    tracking: '0.05em'
spacing:
  xs: '4px'
  sm: '8px'
  md: '16px'
  lg: '24px'
  xl: '32px'
  section: '96px'
rounded:
  sm: '4px'
  md: '8px'
  lg: '12px'
  xl: '16px'
  card: '24px'
  full: '9999px'
components:
  bento_grid:
    gap: '24px'
    item_bg: 'linear-gradient(225deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.0) 100%)'
  buttons:
    primary_bg: '#ffffff'
    primary_text: '#171717'
    glass_bg: 'rgba(255, 255, 255, 0.05)'
  borders:
    gradient: 'linear-gradient(225deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)'
motion:
  standard_ease: 'ease-out'
  duration: '0.8s'
  fade_slide_y: '30px'
---

## Overview

Fluxora is a high-contrast dark system designed for technical depth and clarity. It utilizes a grid-based architecture (bento grid) to organize complex data visualizations and technical content.

## Colors

The palette is rooted in `neutral-950` with high-opacity white overlays for depth. Primary action colors are `blue-400` for primary status and `emerald-400` for success. Warning and error states utilize `rose-400`.

## Typography

Relies exclusively on **Inter**. Headings use extreme negative tracking and bold weights to imply precision. Small technical labels (10-11px) are used for metadata and status indicators.

## Spacing

A strict 4px/8px scale. Large sections are separated by 96px to 128px of vertical padding to maintain a premium feel.

## Layout

- **Bento Grid**: Multi-column layouts that collapse from 12 columns to 1 column on mobile.
- **Z-Index Layers**: Background (Grid Pattern) -> Midground (Bento Cards) -> Foreground (Sticky Nav & Modals).
- **Layer Stacks**: Utilizes `backdrop-blur` (8px to 12px) on cards and navigation to create a sense of glass transparency over background patterns.

## Elevation & Depth

Depth is achieved through `border-gradient` techniques (1px stroke) and subtle inner shadows rather than heavy drop shadows. Backgrounds feature a fixed grid SVG pattern at 3% opacity.

## Shapes

Cards and large containers use a specific `24px` (3xl) or `28px` corner radius. Buttons and pills use a fully rounded `9999px` profile. Inner components within cards (like code blocks) use `12px` or `16px` radii.

## Components

- **Nav**: Sticky or fixed top with backdrop-blur and a subtle bottom border.
- **Bento Cards**: Feature a custom `::before` pseudo-element for 1px gradient borders.
- **Pills**: Small status badges with low-opacity backgrounds (e.g., `bg-blue-400/20`).
- **Data Visualizations**: Bar and line charts use solid blue or emerald fills with rounded ends.

## Motion

- **Entry**: Global `fadeSlideIn` animation applying a 30px Y-offset and 8px blur transition.
- **Hover**: Subtle vertical translation (`-translate-y-0.5`) and background opacity shifts.
- **Marquee**: Continuous horizontal translation for social proof (testimonials).

## Do's and Don'ts

- **Do**: Use high-contrast primary buttons for main CTAs.
- **Do**: Apply `backdrop-blur` whenever content overlaps background gradients.
- **Don't**: Use solid borders; prefer the 1px gradient stroke for cards.
- **Don't**: Use vibrant background colors; keep the canvas `neutral-950`.

## Accessibility

- Minimum contrast is maintained via white text on neutral-950.
- Interactive elements feature a minimum touch target of 40px.
- Reduced motion is respected via `@media (prefers-reduced-motion)` which disables the marquee and entry animations.
