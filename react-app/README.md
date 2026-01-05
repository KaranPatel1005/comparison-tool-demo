# BXL Data Comparison Tool V3 - React TypeScript

A modern, strongly-typed React application for comparing data across multiple CSV and Excel files.

## 🚀 Features

- **Multi-file comparison**: Upload and compare up to 4 CSV or Excel files
- **Smart data matching**: Case-insensitive comparison with intelligent conflict resolution
- **Interactive UI**: 
  - Car-by-car navigation
  - Real-time search and filtering
  - Editable cells with auto-save to localStorage
  - Color-coded comparison results
- **Data visualization**: Interactive charts using Chart.js
- **Export capabilities**: Export to CSV or Excel (single car or all cars)
- **Dark mode**: Beautiful dark theme with smooth transition
- **Responsive design**: Glassmorphism UI with modern aesthetics

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Full type safety
- **Vite** - Fast build tool and dev server
- **Chart.js + react-chartjs-2** - Data visualization
- **XLSX** - Excel file parsing and export
- **CSS3** - Glassmorphism effects and animations

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header/
│   ├── FileUpload/
│   ├── KPISection/
│   ├── ChartsSection/
│   ├── CarNavigation/
│   ├── SearchBar/
│   ├── ExportControls/
│   ├── Legend/
│   ├── DataTable/
│   ├── HelpModal/
│   └── LoadingOverlay/
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts
├── utils/              # Utility functions
│   ├── fileParser.ts
│   └── dataProcessor.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main application component
├── App.css             # Global styles
├── main.tsx            # Application entry point
└── index.css           # Base styles
```

## 🏗️ Architecture Highlights

### Type Safety
- Comprehensive TypeScript interfaces for all data structures
- Strict type checking enabled
- Type-only imports for better tree-shaking

### Component Design
- **Functional components** with React hooks
- **Props interfaces** for type-safe component communication
- **Memoization** with `useMemo` and `useCallback` for performance
- **Separation of concerns** - each component has a single responsibility

### State Management
- **React hooks** for local state
- **Custom hooks** for reusable logic (localStorage)
- **Lifted state** for shared data between components
- **Computed values** with useMemo for derived state

### Data Processing
- **Async file reading** with Promises
- **CSV and Excel parsing** with proper error handling
- **Case-insensitive comparison** algorithm
- **Efficient filtering** and search

### Performance
- Memoized calculations to prevent unnecessary re-renders
- Lazy evaluation of expensive operations
- Efficient list rendering with proper keys

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
cd react-app
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage

1. **Upload Files**: Select 3-4 CSV or Excel files (File 1 is the reference)
2. **Compare**: Click "Upload & Compare" to process the files
3. **Navigate**: Use the dropdown or Previous/Next buttons to switch between cars
4. **Search**: Filter features using the search box
5. **Edit**: Modify the "Final Data" column - changes auto-save to browser storage
6. **Export**: Download results as CSV or Excel

## 🎨 Features in Detail

### Color Coding
- 🟢 **Green**: All values match across files
- 🟡 **Yellow**: Partial match (some values differ)
- 🔴 **Red**: All values are different
- 🔵 **Blue**: Empty cell

### KPI Metrics
- Total features count
- Same/Partial/Different counts
- Missing cells count
- Difference percentages per file

### Charts
- **Doughnut chart**: Visual breakdown of Same/Partial/Different
- **Bar chart**: Percentage differences vs File 1

### Dark Mode
- Smooth transition with 0.3s animation
- Adjusted color palette for better readability
- Consistent across all components

## 🔧 Customization

### Adding New Features
1. Define types in `src/types/index.ts`
2. Create utility functions in `src/utils/`
3. Build components in `src/components/`
4. Integrate in `App.tsx`

### Styling
- Component-specific styles in component folders
- Global styles in `App.css`
- Dark mode variants using `.dark-mode` class

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a conversion of the original HTML/JS application to React TypeScript with improved architecture, type safety, and maintainability.

---

**Original Version**: HTML + Vanilla JavaScript  
**New Version**: React + TypeScript with modern best practices
