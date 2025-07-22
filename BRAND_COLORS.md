# WorkPortfolio Brand Color System

## 🎨 Primary Brand Colors

### 1. **Primary Blue**
- **HEX:** `#2563EB`
- **Tailwind:** `blue-600`
- **Usage:** Primary buttons, links, callouts, headings, brand elements

### 2. **Highlight/Action Accent: Yellow**
- **HEX:** `#FACC15`
- **Tailwind:** `yellow-400`
- **Usage:** Key text highlights, badges, visual contrast for benefits

### 3. **Error/Problem Accent: Red**
- **HEX:** `#EF4444`
- **Tailwind:** `red-500`
- **Usage:** Problem text, warning boxes, friction points, error states

### 4. **Success/Validation Green**
- **HEX:** `#22C55E`
- **Tailwind:** `green-500`
- **Usage:** Check marks, success indicators, speed indicators, live badges

## 📝 Typography Colors

| Use              | HEX       | Tailwind        |
| ---------------- | --------- | --------------- |
| Headings         | `#111827` | `text-gray-900` |
| Body text        | `#4B5563` | `text-gray-600` |
| Muted text       | `#6B7280` | `text-gray-500` |
| Links            | `#2563EB` | `text-blue-600` |

## 🎯 Background Colors

| Use                    | HEX       | Tailwind     |
| ---------------------- | --------- | ------------ |
| Primary background     | `#F9FAFB` | `bg-gray-50` |
| Card background        | `#FFFFFF` | `bg-white`   |
| Subtle backgrounds     | `#F3F4F6` | `bg-gray-100` |
| Blue accent background | `#EFF6FF` | `bg-blue-50` |
| Red accent background  | `#FEF2F2` | `bg-red-50`   |
| Green accent background| `#F0FDF4` | `bg-green-50` |
| Yellow accent background| `#FEFCE8` | `bg-yellow-50` |

## 🎨 Border Colors

| Use              | HEX       | Tailwind        |
| ---------------- | --------- | --------------- |
| Primary borders  | `#E5E7EB` | `border-gray-200` |
| Focus borders    | `#2563EB` | `border-blue-600` |
| Error borders    | `#EF4444` | `border-red-500`  |
| Success borders  | `#22C55E` | `border-green-500` |

## 📋 Quick Reference Table

| Purpose       | HEX       | Tailwind     | Usage Example |
| ------------- | --------- | ------------ | ------------- |
| Primary Blue  | `#2563EB` | `blue-600`   | Buttons, links, brand |
| Accent Yellow | `#FACC15` | `yellow-400` | Highlights, badges |
| Red Warning   | `#EF4444` | `red-500`    | Problems, errors |
| Success Green | `#22C55E` | `green-500`  | Success, checkmarks |
| Light BG      | `#F9FAFB` | `gray-50`    | Page backgrounds |
| Heading Text  | `#111827` | `gray-900`   | H1, H2, H3 |
| Body Text     | `#4B5563` | `gray-600`   | Paragraphs |
| Muted Text    | `#6B7280` | `gray-500`   | Captions, metadata |

## 🎯 Usage Guidelines

### **Primary Blue (`blue-600`)**
- Primary call-to-action buttons
- Brand logo and navigation
- Important links and focus states
- "Show." in headline emphasis

### **Yellow Accent (`yellow-400`)**
- "Proof matters." in final CTA
- "Takes 2 min" badges
- Star ratings and reviews
- Visual contrast for key benefits

### **Red Warning (`red-500`)**
- "THE PROBLEM" section badges
- "way too hard" emphasis
- Problem cards and warnings
- Error states and friction points

### **Success Green (`green-500`)**
- Check marks in feature lists
- "Built in 4 minutes" indicators
- "Live in 5 minutes" badges
- Success states and confirmations

## 🎨 Color Combinations

### **Primary Button**
```css
bg-blue-600 hover:bg-blue-700 text-white
```

### **Secondary Button**
```css
border-2 border-gray-300 text-gray-700 hover:bg-gray-50
```

### **Success Badge**
```css
bg-green-100 text-green-800 border-green-200
```

### **Warning Badge**
```css
bg-red-100 text-red-500 border-red-200
```

### **Info Badge**
```css
bg-blue-100 text-blue-700 border-blue-200
```

## 🎨 Background Patterns

### **Primary Section Background**
```css
bg-gray-50
```

### **Card Background**
```css
bg-white shadow-lg border-0 rounded-2xl
```

### **Accent Background**
```css
bg-blue-50 border-l-4 border-blue-600
```

### **Warning Background**
```css
bg-red-50 border-l-4 border-red-500
```

## 📱 Responsive Considerations

- All colors maintain proper contrast ratios for accessibility
- Colors work well on both light and dark backgrounds
- Consistent across all device sizes
- Print-friendly color combinations

## 🔧 Tailwind Config Suggestion

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563EB',   // blue-600
          accent: '#FACC15',    // yellow-400
          danger: '#EF4444',    // red-500
          success: '#22C55E',   // green-500
          bg: '#F9FAFB',        // gray-50
          muted: '#6B7280',     // gray-500
        }
      }
    }
  }
}
```

## 📋 Implementation Checklist

- [ ] Primary buttons use `bg-blue-600 hover:bg-blue-700`
- [ ] Headings use `text-gray-900`
- [ ] Body text uses `text-gray-600`
- [ ] Success indicators use `text-green-500`
- [ ] Warning/problem text uses `text-red-500`
- [ ] Highlights use `text-yellow-400`
- [ ] Backgrounds use `bg-gray-50` or `bg-white`
- [ ] Borders use `border-gray-200` for subtle, `border-blue-600` for focus
- [ ] All colors maintain WCAG AA contrast ratios

---

*This color system ensures consistency across all WorkPortfolio touchpoints and creates a professional, trustworthy brand appearance.* 