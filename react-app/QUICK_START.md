# Quick Start Guide

## 🚀 Running the Application

### Development Mode

```bash
cd react-app
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

### Production Build

```bash
npm run build
npm run preview
```

## 📂 Project Structure Quick Reference

```
react-app/
├── src/
│   ├── components/       # All UI components (11 folders)
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Business logic utilities
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application
│   └── main.tsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
```

## 🎯 Key Files to Understand

1. **`src/App.tsx`** - Main component, orchestrates everything
2. **`src/types/index.ts`** - All TypeScript interfaces
3. **`src/utils/fileParser.ts`** - CSV/Excel parsing logic
4. **`src/utils/dataProcessor.ts`** - Data comparison logic
5. **`src/components/DataTable/DataTable.tsx`** - Main table component

## 🔧 Common Tasks

### Adding a New Component

```typescript
// 1. Create component file
src/components/MyComponent/MyComponent.tsx

// 2. Define props interface
interface MyComponentProps {
  data: string;
  onAction: () => void;
}

// 3. Create component
const MyComponent: React.FC<MyComponentProps> = ({ data, onAction }) => {
  return <div>{data}</div>;
};

export default MyComponent;

// 4. Add styles
src/components/MyComponent/MyComponent.css
```

### Adding a New Type

```typescript
// In src/types/index.ts
export interface MyNewType {
  field1: string;
  field2: number;
}
```

### Adding a Utility Function

```typescript
// In src/utils/myUtils.ts
export const myFunction = (input: string): string => {
  return input.toUpperCase();
};
```

## 🎨 Styling

- Global styles: `src/App.css`
- Component styles: `src/components/[Component]/[Component].css`
- Dark mode: Use `.dark-mode` class prefix

Example:
```css
.my-element {
  color: #333;
}

.dark-mode .my-element {
  color: #ccc;
}
```

## 🐛 Debugging

### TypeScript Errors
```bash
npm run build
```
This will show all TypeScript errors.

### Runtime Errors
- Open browser DevTools (F12)
- Check Console tab
- React DevTools extension recommended

## 📦 Dependencies

### Core
- `react` - UI library
- `react-dom` - React DOM renderer
- `typescript` - Type checking

### Charts
- `chart.js` - Chart library
- `react-chartjs-2` - React wrapper for Chart.js

### File Processing
- `xlsx` - Excel file parsing

### Build Tools
- `vite` - Build tool and dev server
- `@vitejs/plugin-react` - React plugin for Vite

## 🔍 Code Quality

### Type Checking
```bash
npx tsc --noEmit
```

### Linting (if configured)
```bash
npm run lint
```

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
- Check `tsconfig.json` settings
- Ensure all imports use correct paths
- Use type-only imports when needed: `import type { ... }`

## 💡 Tips

1. **Hot Reload**: Changes auto-reload in dev mode
2. **Component Isolation**: Each component is self-contained
3. **Type Safety**: Let TypeScript guide you - if it compiles, it's likely correct
4. **State Management**: Use `useState` for local state, lift state up when needed
5. **Performance**: Use `useMemo` and `useCallback` for expensive operations

## 📚 Learning Resources

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Vite Docs](https://vitejs.dev)
- [Chart.js Docs](https://www.chartjs.org/docs/)

## 🎓 Next Steps

1. Run the app and explore the UI
2. Upload some test CSV/Excel files
3. Examine the component structure
4. Try modifying a component
5. Add a new feature!

---

**Need Help?** Check the main README.md and CONVERSION_SUMMARY.md for more details.
