# 🏆 QuickStats Component Usage Guide

This guide shows you how to use the QuickStats component in your Ripple platform.

## 📋 Overview

The QuickStats component provides:
- **8 different stat cards** with icons and colors
- **Real-time data** from Firebase Firestore
- **Responsive design** (4 cards on desktop, 2 on tablet, 1 on mobile)
- **Smooth animations** with Framer Motion
- **Loading states** and error handling
- **Trend indicators** and growth metrics

## 🚀 Quick Start

### 1. Basic Usage

```tsx
import QuickStats from '@/components/QuickStats';

// In your component
<QuickStats />
```

### 2. With Custom NGO ID

```tsx
<QuickStats ngoId="your-ngo-id" />
```

### 3. Customized Display

```tsx
<QuickStats 
  ngoId="your-ngo-id"
  showTrends={false}
  compact={true}
  className="my-custom-class"
/>
```

## 📊 Available Stats

The component displays these 8 key metrics:

| Stat | Icon | Description | Format |
|------|------|-------------|---------|
| **Total Volunteers** | 👥 | Active community members | Number |
| **Active Events** | 📅 | Ongoing opportunities | Number |
| **Hours Contributed** | ⏱️ | Volunteer time donated | Hours |
| **Donations Received** | 💰 | Financial contributions | Currency |
| **Beneficiaries Impacted** | ❤️ | Lives touched | Number |
| **Events Completed** | 🏆 | Successful initiatives | Number |
| **Average Rating** | ⭐ | Volunteer satisfaction | Rating (0-5) |
| **Monthly Growth** | 📈 | Community expansion | Percentage |

## 🎨 Customization Options

### Props

```tsx
interface QuickStatsProps {
  ngoId?: string;           // NGO ID (uses current user if not provided)
  className?: string;       // Additional CSS classes
  showTrends?: boolean;     // Show trend indicators (default: true)
  compact?: boolean;        // Compact layout (default: false)
}
```

### Styling

The component uses your existing design system:
- **Colors**: Matches your `dark-blue` theme
- **Cards**: Uses `gradient-card` background
- **Icons**: Lucide React icons with custom colors
- **Animations**: Framer Motion with staggered delays

## 🔧 Firebase Integration

### 1. Firestore Schema

Store NGO stats in your `ngos` collection:

```typescript
{
  volunteersCount: number,
  activeEvents: number,
  totalHours: number,
  donations: number,
  beneficiaries: number,
  completedEvents: number,
  averageRating: number,
  monthlyGrowth: number
}
```

### 2. Real-time Updates

The component automatically:
- Fetches data from Firestore
- Updates in real-time
- Handles loading and error states
- Falls back to mock data if needed

### 3. Data Fetching

```tsx
// The component uses React Query for caching
const { data: stats, isLoading, error } = useNGOStats(ngoId);
```

## 📱 Responsive Design

The component is fully responsive:

- **Desktop (lg+)**: 4 cards per row
- **Tablet (md)**: 2 cards per row  
- **Mobile (sm)**: 1 card per row

## 🎭 Animation Features

### Entry Animations
- Cards fade in with staggered delays
- Smooth slide-up motion
- Configurable timing

### Hover Effects
- Cards lift up on hover
- Icon scaling animation
- Smooth transitions

### Loading States
- Skeleton loading animation
- Graceful error handling
- Retry functionality

## 📄 Usage Examples

### 1. Dashboard Overview

```tsx
import QuickStats from '@/components/QuickStats';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Key Metrics</h2>
      <QuickStats />
    </div>
  );
};
```

### 2. Compact Stats Bar

```tsx
import { SummaryStats } from '@/components/QuickStats';

const Header = () => {
  return (
    <div className="flex items-center justify-between">
      <h1>NGO Dashboard</h1>
      <SummaryStats />
    </div>
  );
};
```

### 3. Event-specific Stats

```tsx
const EventPage = () => {
  return (
    <div>
      <h2>Event Statistics</h2>
      <QuickStats 
        ngoId="event-ngo-id"
        showTrends={false}
        compact={true}
      />
    </div>
  );
};
```

### 4. Custom Layout

```tsx
const CustomLayout = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3>Overview Stats</h3>
        <QuickStats className="mt-4" />
      </div>
      <div>
        <h3>Detailed Analytics</h3>
        <QuickStats showTrends={true} />
      </div>
    </div>
  );
};
```

## 🔄 Real-time Features

### Automatic Updates
- Data refreshes every 5 minutes
- Real-time Firestore subscriptions
- Optimistic updates for better UX

### Error Handling
- Network error recovery
- Graceful fallbacks
- User-friendly error messages

## 🎯 Integration with Other Components

### With Navigation
```tsx
// Add dashboard link to navigation
<Link to="/ngo-dashboard">Dashboard</Link>
```

### With Authentication
```tsx
// Component automatically uses current user's NGO ID
const { user } = useAuth();
// QuickStats will use user.uid as ngoId
```

### With React Query
```tsx
// Component integrates with your existing React Query setup
<QueryClientProvider client={queryClient}>
  <QuickStats />
</QueryClientProvider>
```

## 🧪 Testing

### Mock Data
The component includes comprehensive mock data for development:

```typescript
const mockNGOStats = {
  volunteersCount: 247,
  activeEvents: 12,
  totalHours: 1847,
  donations: 15420,
  beneficiaries: 892,
  completedEvents: 156,
  averageRating: 4.8,
  monthlyGrowth: 23
};
```

### Testing Scenarios
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design
- ✅ Animation performance
- ✅ Data updates

## 🚀 Performance Tips

### 1. Optimize Queries
```tsx
// Use React Query for caching
const { data } = useQuery({
  queryKey: ['ngoStats', ngoId],
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### 2. Lazy Loading
```tsx
// Load component only when needed
const QuickStats = lazy(() => import('@/components/QuickStats'));
```

### 3. Memoization
```tsx
// Memoize expensive calculations
const statCards = useMemo(() => getStatCards(stats), [stats]);
```

## 🔧 Troubleshooting

### Common Issues

1. **Stats not loading**
   - Check Firebase configuration
   - Verify NGO ID exists
   - Check Firestore permissions

2. **Animations not working**
   - Ensure Framer Motion is installed
   - Check for CSS conflicts
   - Verify component mounting

3. **Responsive issues**
   - Check Tailwind breakpoints
   - Verify container widths
   - Test on different devices

### Debug Mode
```tsx
// Enable console logging
const { data, isLoading, error } = useNGOStats(ngoId);
console.log('QuickStats Debug:', { data, isLoading, error });
```

## 📈 Future Enhancements

### Planned Features
- [ ] Custom stat definitions
- [ ] Chart integrations
- [ ] Export functionality
- [ ] Advanced filtering
- [ ] Comparative analytics

### Customization Options
- [ ] Custom color schemes
- [ ] Icon customization
- [ ] Animation presets
- [ ] Layout variations

## 🎉 Success!

Your QuickStats component is now ready to use! It provides:

✅ **Beautiful, responsive stat cards**  
✅ **Real-time Firebase integration**  
✅ **Smooth animations and interactions**  
✅ **Comprehensive error handling**  
✅ **Easy customization options**  
✅ **Performance optimized**  

The component will automatically work with your existing Ripple platform and provide NGOs with powerful insights into their impact and community engagement.

Happy coding! 🚀
