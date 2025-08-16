# StatCard Component Documentation

## 🎯 Overview

The `StatCard` component is a beautiful, animated card designed to display statistics with an icon on top, bold title, and centered layout. It matches the onboarding card style and includes smooth Framer Motion animations.

## ✨ Features

- **🎨 Icon on Top**: Large, colorful icon container at the top
- **📊 Bold Values**: Prominent display of numerical values
- **🏷️ Clear Labels**: Descriptive titles for each statistic
- **📝 Optional Descriptions**: Additional context below the label
- **🎭 Smooth Animations**: Framer Motion fade/scale animations
- **🎨 Customizable Colors**: Full color scheme customization
- **📱 Responsive Design**: Works on all screen sizes
- **🖱️ Interactive Hover**: Hover effects and tap feedback

## 🚀 Basic Usage

```tsx
import StatCard from '@/components/StatCard';
import { Users } from 'lucide-react';

<StatCard
  icon={<Users className="w-8 h-8" />}
  value="247"
  label="Total Volunteers"
  description="Active community members"
/>
```

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `React.ReactNode` | - | **Required**. Icon element to display |
| `value` | `string \| number` | - | **Required**. The main value to display |
| `label` | `string` | - | **Required**. The title/label for the stat |
| `description` | `string` | - | Optional description text |
| `className` | `string` | `""` | Additional CSS classes |
| `color` | `string` | `"text-cyan-400"` | Icon and accent color |
| `bgColor` | `string` | `"bg-cyan-500/10"` | Icon background color |
| `borderColor` | `string` | `"border-cyan-400/50"` | Card border color |
| `delay` | `number` | `0` | Animation delay in seconds |

## 🎨 Color Schemes

### Default Color Palette

```tsx
// Cyan (Default)
color="text-cyan-400"
bgColor="bg-cyan-500/10"
borderColor="border-cyan-400/50"

// Emerald
color="text-emerald-400"
bgColor="bg-emerald-500/10"
borderColor="border-emerald-400/50"

// Violet
color="text-violet-400"
bgColor="bg-violet-500/10"
borderColor="border-violet-400/50"

// Amber
color="text-amber-400"
bgColor="bg-amber-500/10"
borderColor="border-amber-400/50"

// Rose
color="text-rose-400"
bgColor="bg-rose-500/10"
borderColor="border-rose-400/50"

// Orange
color="text-orange-400"
bgColor="bg-orange-500/10"
borderColor="border-orange-400/50"

// Yellow
color="text-yellow-400"
bgColor="bg-yellow-500/10"
borderColor="border-yellow-400/50"

// Blue
color="text-blue-400"
bgColor="bg-blue-500/10"
borderColor="border-blue-400/50"
```

## 📱 Responsive Grid Layout

### Grid Configuration

```tsx
// 4 cards per row on desktop, 2 on tablet, 1 on mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {stats.map((stat, index) => (
    <StatCard
      key={stat.id}
      {...stat}
      delay={index * 0.08} // Staggered animation
    />
  ))}
</div>
```

## 🎭 Animation Features

### Entrance Animation
- **Fade In**: `opacity: 0 → 1`
- **Scale Up**: `scale: 0.8 → 1`
- **Slide Up**: `y: 30 → 0`
- **Duration**: `0.6s`
- **Easing**: Custom cubic-bezier `[0.25, 0.46, 0.45, 0.94]`

### Hover Effects
- **Lift**: `y: 0 → -8`
- **Scale**: `scale: 1 → 1.02`
- **Icon Rotation**: `rotate: 0 → 5`
- **Icon Scale**: `scale: 1 → 1.15`

### Tap Feedback
- **Scale Down**: `scale: 1 → 0.98`
- **Duration**: `0.1s`

## 📊 Usage Examples

### 1. Basic Stat Card

```tsx
<StatCard
  icon={<Users className="w-8 h-8" />}
  value="247"
  label="Total Volunteers"
  description="Active community members"
/>
```

### 2. With Custom Colors

```tsx
<StatCard
  icon={<DollarSign className="w-8 h-8" />}
  value="$15,420"
  label="Donations Received"
  description="Financial contributions"
  color="text-amber-400"
  bgColor="bg-amber-500/10"
  borderColor="border-amber-400/50"
/>
```

### 3. With Animation Delay

```tsx
<StatCard
  icon={<TrendingUp className="w-8 h-8" />}
  value="23%"
  label="Monthly Growth"
  description="Community expansion"
  delay={0.3}
/>
```

### 4. Grid Layout Example

```tsx
const stats = [
  {
    icon: <Users className="w-8 h-8" />,
    value: "247",
    label: "Total Volunteers",
    description: "Active community members",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-400/50"
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    value: "12",
    label: "Active Events",
    description: "Ongoing opportunities",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-400/50"
  },
  // ... more stats
];

return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {stats.map((stat, index) => (
      <StatCard
        key={index}
        {...stat}
        delay={index * 0.08}
      />
    ))}
  </div>
);
```

## 🔧 Integration with QuickStats

The `QuickStats` component has been updated to use the new `StatCard`:

```tsx
// In QuickStats.tsx
import StatCard from './StatCard';

// The component now renders StatCard components instead of custom cards
{statCards.map((stat, index) => (
  <StatCard
    key={stat.id}
    icon={stat.icon}
    value={stat.value}
    label={stat.label}
    description={stat.description}
    color={stat.color}
    bgColor={stat.bgColor}
    borderColor={stat.borderColor}
    delay={index * 0.08}
  />
))}
```

## 🎨 Styling Customization

### Custom CSS Classes

```tsx
<StatCard
  icon={<Target className="w-8 h-8" />}
  value="1,139"
  label="Total Impact"
  description="Combined beneficiaries and volunteers"
  className="custom-stat-card"
/>
```

### Tailwind Classes

The component uses these Tailwind classes:
- **Card**: `bg-gradient-card`, `hover:shadow-elegant`, `border-2`
- **Icon Container**: `rounded-xl`, `shadow-lg`, `backdrop-blur-sm`
- **Text**: `text-off-white`, `text-text-gray`

## 🚀 Performance Tips

1. **Staggered Animations**: Use `delay={index * 0.08}` for smooth grid animations
2. **Icon Optimization**: Use consistent icon sizes (e.g., `w-8 h-8`)
3. **Lazy Loading**: Consider lazy loading for large grids
4. **Memoization**: Memoize stat data to prevent unnecessary re-renders

## 🐛 Troubleshooting

### Common Issues

1. **Icons Not Showing**: Ensure icons are properly imported and sized
2. **Animation Not Working**: Check that Framer Motion is installed
3. **Layout Issues**: Verify grid classes are applied correctly
4. **Color Not Applying**: Ensure color classes are valid Tailwind classes

### Debug Mode

```tsx
// Add debug styling
<StatCard
  {...props}
  className="border-red-500 border-2" // Debug border
/>
```

## 📱 Demo Page

Visit `/stat-card-demo` to see the component in action with various examples and configurations.

## 🔄 Migration from Old QuickStats

If you were using the old QuickStats cards, the migration is automatic. The component now uses the new StatCard internally while maintaining the same API.

## 📄 License

This component is part of the Ripple NGO platform and follows the same licensing terms.
