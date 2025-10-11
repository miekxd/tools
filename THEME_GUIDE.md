# Theme Guide - Soft Purple with Light/Dark Mode

## ✅ Complete Theme System Implemented

Your entire application now has a beautiful **soft purple theme** with **light/dark mode support**!

## 🎨 Color Palette

### Light Mode (White Purple)
- **Background Primary**: `#FFFFFF` (pure white)
- **Background Secondary**: `#F8F5FF` (soft purple tint)
- **Background Tertiary**: `#F3F0FF` (lighter purple)
- **Purple Primary**: `#8B5CF6` (violet-500)
- **Purple Secondary**: `#A78BFA` (violet-400)
- **Text Primary**: `#1F2937` (dark gray)
- **Text Secondary**: `#6B7280` (medium gray)

### Dark Mode (Dark Purple)
- **Background Primary**: `#1E1B2E` (deep purple-black)
- **Background Secondary**: `#2D2640` (dark purple)
- **Background Tertiary**: `#3A3350` (medium purple)
- **Purple Primary**: `#A78BFA` (violet-400)
- **Purple Secondary**: `#C4B5FD` (violet-300)
- **Text Primary**: `#F3F4F6` (light gray)
- **Text Secondary**: `#D1D5DB` (medium light gray)

## 🔄 Theme Toggle

Users can switch between light and dark mode by clicking the theme toggle button in the sidebar:
- **Light Mode**: Shows moon icon with "Dark Mode" text
- **Dark Mode**: Shows sun icon with "Light Mode" text
- **Persistence**: Theme preference is saved to localStorage
- **Smooth Transitions**: All colors animate smoothly when switching themes

## 📱 Updated Pages

### ✅ Task Manager (ClickUp Style)
- **Layout**: Add task input on the left side (ClickUp-inspired)
- **Features**: 
  - Clean, minimal task list
  - Inline checkboxes
  - Hover actions (delete button appears on hover)
  - Stats in header (Total, Active, Completed)
  - Filter tabs in toolbar
- **Theme**: Full soft purple theme with light/dark mode

### ✅ Proposal Writer
- Soft purple accents
- Themed cards and borders
- Light/dark mode support
- All form inputs use theme variables

### ✅ CSV Processor
- Soft purple accents
- Themed cards and borders
- Light/dark mode support
- All form inputs use theme variables

### ✅ Landing Page
- Soft purple hero section
- Themed feature cards
- Light/dark mode support
- Purple CTA buttons

### ✅ Auth Pages (Sign In / Sign Up)
- Clean, modern design
- Soft purple accents
- Themed forms
- Light/dark mode support

### ✅ Sidebar
- Themed navigation
- Purple selected state
- User profile section
- Theme toggle button
- Sign out button

## 🎯 Using the Theme System

### In Your Components

Use CSS variables for dynamic theming:

```tsx
// Background
<div style={{ backgroundColor: 'var(--bg-primary)' }}>

// Text
<p style={{ color: 'var(--text-primary)' }}>

// Purple accent
<h1 className="text-purple">

// Borders
<div style={{ borderColor: 'var(--border-primary)' }}>

// Cards (includes background, border, shadow)
<div className="card p-6">
```

### Theme Classes

Pre-defined utility classes:
- `.text-purple` - Purple text color
- `.bg-purple` - Purple background
- `.bg-secondary` - Secondary background
- `.bg-tertiary` - Tertiary background
- `.card` - Themed card with border and shadow
- `.btn-primary` - Purple button
- `.btn-secondary` - Secondary button
- `.form-input` - Themed input field
- `.form-textarea` - Themed textarea
- `.form-select` - Themed select dropdown

## 🔧 Key Features

### 1. Automatic Theme Detection
The theme system automatically:
- Loads saved theme from localStorage
- Applies theme on mount
- Prevents flash of unstyled content

### 2. Smooth Transitions
All theme changes animate smoothly with CSS transitions

### 3. Accessible
- Focus states styled with purple
- High contrast in both modes
- Keyboard navigation support

### 4. Consistent
Every page follows the same theme system for a cohesive experience

## 📐 ClickUp-Style Task Manager

The Task Manager now features a **ClickUp-inspired** layout:

```
┌─────────────────────────────────────┐
│ Tasks                    Stats      │
├─────────────────────────────────────┤
│ All | Active | Completed            │
├─────────────────────────────────────┤
│ ○ + Add a task...                   │
│                                      │
│ ○ Task 1                          ⋮ │
│ ○ Task 2                          ⋮ │
│ ☑ Task 3 (completed)              ⋮ │
└─────────────────────────────────────┘
```

**Features:**
- Add task at the top (ClickUp style)
- Minimal, clean design
- Hover to reveal actions
- Stats in header
- Filter tabs
- Soft purple theme

## 🚀 Next Steps

### To Use the Theme
1. No setup needed - theme is already active!
2. Click the theme toggle in the sidebar to switch modes
3. Your preference is automatically saved

### To Add New Pages
Use the same theme variables for consistency:
```tsx
<div style={{ backgroundColor: 'var(--bg-primary)' }}>
  <h1 style={{ color: 'var(--text-primary)' }}>Title</h1>
  <p style={{ color: 'var(--text-secondary)' }}>Description</p>
  <button className="btn-primary">Click Me</button>
</div>
```

## 💡 Tips

1. **Always use theme variables** instead of hardcoded colors
2. **Test in both light and dark mode** before deploying
3. **Use utility classes** (`.card`, `.btn-primary`) for common patterns
4. **Check contrast** - ensure text is readable in both modes

## 🎉 Your App Now Has

- ✅ Beautiful soft purple theme
- ✅ Light/dark mode toggle
- ✅ ClickUp-style Task Manager
- ✅ Consistent theming across all pages
- ✅ Smooth transitions
- ✅ Accessible design
- ✅ User preference persistence

Enjoy your beautifully themed tools website!

