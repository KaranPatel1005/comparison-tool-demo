# Interactive Legend Filtering Feature

## Overview
Added interactive filtering functionality to the Legend component, allowing users to click on legend items to filter the table by color category.

## What Was Added

### 1. **Interactive Legend Component**
- **File**: `src/components/Legend/Legend.tsx`
- **Changes**:
  - Added `LegendFilter` type: `'all' | 'green' | 'yellow' | 'red' | 'blue'`
  - Added props: `activeFilter` and `onFilterChange`
  - Made all legend items clickable
  - Added "Show All" option to reset filters
  - Added active state highlighting
  - Added tooltips for better UX

### 2. **Enhanced Legend Styling**
- **File**: `src/components/Legend/Legend.css`
- **Changes**:
  - Added `.clickable` class with cursor pointer
  - Added hover effects (lift animation + background color)
  - Added `.active` class with blue border and background
  - Added gradient background for "Show All" legend box
  - Dark mode support for all new styles

### 3. **DataTable Filtering Logic**
- **File**: `src/components/DataTable/DataTable.tsx`
- **Changes**:
  - Added `legendFilter` prop
  - Updated filtering logic to combine legend filter + search filter
  - Special handling for "blue" filter (shows rows with empty cells)
  - Added filter status indicator showing:
    - Count of filtered rows vs total rows
    - Active filter badge
    - Active search badge
  - Smooth slide-down animation for filter status

### 4. **App State Management**
- **File**: `src/App.tsx`
- **Changes**:
  - Added `legendFilter` state with `useState<LegendFilter>('all')`
  - Connected Legend component with filter state
  - Passed `legendFilter` to DataTable component
  - Reset legend filter on data reset

### 5. **Updated Help Documentation**
- **File**: `src/components/HelpModal/HelpModal.tsx`
- **Changes**:
  - Added instructions about clicking legend items to filter
  - Documented the "Show All" reset functionality

## How It Works

### User Flow
1. User uploads and compares files
2. Table displays all features with color coding
3. User clicks on a legend item (e.g., "All Values Match")
4. Table instantly filters to show only matching rows
5. Filter status appears showing "Showing X of Y features"
6. User can click "Show All" to reset the filter
7. Filters work in combination with search

### Technical Flow
```
User clicks legend item
    ↓
Legend calls onFilterChange(filter)
    ↓
App updates legendFilter state
    ↓
DataTable receives new legendFilter prop
    ↓
useMemo recalculates filteredRows
    ↓
Table re-renders with filtered data
    ↓
Filter status indicator appears
```

## Filter Logic

### Legend Filter Types
- **'all'**: Shows all rows (default)
- **'green'**: Shows only rows where all values match
- **'yellow'**: Shows only rows with partial matches
- **'red'**: Shows only rows where all values differ
- **'blue'**: Shows only rows with at least one empty cell

### Combined Filtering
The DataTable applies filters in this order:
1. **Legend filter** (if not 'all')
2. **Search filter** (if search value exists)

Both filters work together - a row must pass both filters to be displayed.

## Visual Enhancements

### Legend Items
- **Hover**: Slight lift animation + blue background tint
- **Active**: Blue border + stronger background color
- **Cursor**: Pointer to indicate clickability
- **Tooltip**: Descriptive text on hover

### Filter Status Indicator
- **Position**: Below car title, above table
- **Animation**: Smooth slide-down when appearing
- **Content**: 
  - Row count (e.g., "Showing 15 of 50 features")
  - Filter badge (e.g., "Filter: All Match")
  - Search badge (e.g., "Search: 'engine'")
- **Colors**: Blue theme matching the app
- **Dark mode**: Adjusted colors for visibility

## Code Quality

### TypeScript
- Exported `LegendFilter` type for reuse
- Type-safe props and state
- Proper type imports

### Performance
- `useMemo` for filtered rows calculation
- Only recalculates when dependencies change
- Efficient filtering algorithm

### UX
- Instant feedback on click
- Visual indication of active filter
- Clear way to reset (Show All)
- Tooltips for guidance
- Smooth animations

## Testing Scenarios

1. **Basic Filtering**
   - Click "All Values Match" → See only green rows
   - Click "Partial Match" → See only yellow rows
   - Click "All Different" → See only red rows
   - Click "Empty" → See only rows with empty cells
   - Click "Show All" → See all rows again

2. **Combined Filtering**
   - Apply legend filter + search → See rows matching both
   - Clear search while legend filter active → See legend-filtered rows
   - Change legend filter while search active → See new filter + search

3. **Visual Feedback**
   - Active filter has blue border
   - Filter status shows correct counts
   - Hover effects work smoothly
   - Dark mode looks good

## Benefits

1. **Better Data Exploration**: Quickly focus on specific types of rows
2. **Faster Workflow**: No need to scroll through all data
3. **Visual Clarity**: Clear indication of what's being shown
4. **Flexible**: Combine with search for powerful filtering
5. **Intuitive**: Familiar pattern (clickable legend)

## Future Enhancements (Ideas)

- Multi-select filters (e.g., show green AND yellow)
- Keyboard shortcuts (e.g., 'g' for green filter)
- Filter presets (save common filter combinations)
- Filter history (undo/redo filters)
- Export filtered data only

---

**Feature Status**: ✅ Complete and Ready to Use

The interactive legend filtering is now fully functional and integrated into the application!
