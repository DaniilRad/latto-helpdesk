# UI Bugs Report - Helpdesk Application
**Date**: Visual inspection completed  
**Scope**: Full application UI review across all pages

---

## 🔴 CRITICAL BUGS (Block Usability/UX)

### 1. **Table Text Overflow - Text Cannot Wrap**
- **Severity**: 🔴 High
- **Location**: `src/components/bits.jsx:89` - `tdStyle` constant
- **Issue**: All table cells have `whiteSpace: "nowrap"` forcing content to never wrap, causing:
  - Horizontal scrolling on narrow screens (mobile/tablets)
  - Long notes/descriptions/URLs truncate or overflow visually
  - Difficult to read content without resizing table columns
- **Affected Pages**:
  - Tickets table (titles, notes)
  - Problems table (descriptions)
  - Devices table (names, vendors)
  - Software table (license notes)
  - Contracts table (names, notes)
  - Infrastructure (domains, databases notes)
  - Consumables (notes)
- **Visual Impact**: Tables become unusable on screens < 1200px width
- **Fix**: Remove `whiteSpace: "nowrap"` from tdStyle OR selectively apply it only to ID/date columns

```jsx
// CURRENT (BAD):
export const tdStyle = {
  padding: "11px 14px", fontFamily: "var(--font-mono)", fontSize: 13, 
  color: "var(--text-2)",
  borderBottom: "1px solid var(--border-faint)", 
  whiteSpace: "nowrap",  // ← PROBLEM
};

// SUGGESTED:
export const tdStyle = {
  padding: "11px 14px", fontFamily: "var(--font-mono)", fontSize: 13, 
  color: "var(--text-2)",
  borderBottom: "1px solid var(--border-faint)",
  // Remove whiteSpace: "nowrap" - let text wrap naturally
};
```

---

### 2. **Keyboard Navigation Broken - Clickable Divs Not Focusable**
- **Severity**: 🔴 High (Accessibility)
- **Issue**: Interactive elements are `<div>` elements with `onClick`, not semantic buttons/links
  - Users cannot tab/focus on these elements
  - Cannot activate with keyboard (Enter/Space)
  - Screen readers don't identify them as interactive
  - No visible focus ring when navigating with keyboard
  
- **Affected Elements**:
  - **Portal.jsx:57** - "My tickets" list rows
  - **Portal.jsx:85+** - "Popular articles" list rows
  - **ProblemDetail.jsx:120+** - "Linked tickets" rows
  - **Planning.jsx:87** - Calendar ticket chips
  - **Infrastructure.jsx TreeRow** - Device tree toggle/link rows
  
**Example Issue:**
```jsx
// CURRENT (BAD):
<div key={t.id} onClick={() => nav(`/tickets/${t.id}`)}
  style={{ display: "flex", alignItems: "center", gap: 10, 
    padding: "11px 18px", cursor: "pointer" }}>
  {/* Not keyboard accessible! */}
</div>

// SHOULD BE:
<Link to={`/tickets/${t.id}`}
  style={{ display: "flex", alignItems: "center", gap: 10, 
    padding: "11px 18px", cursor: "pointer" }}>
  {/* Or <button role="link"> */}
</Link>
```

---

### 3. **Planning Calendar Chips Too Dense & Hard to Click**
- **Severity**: 🟡 Medium-High
- **Location**: `src/pages/Planning.jsx:87-100`
- **Issue**: Reservation chips use:
  - Padding: `3px 6px` (very tight)
  - BorderRadius: `5` (hardcoded, not tokenized)
  - Very small touch target (only ~24px tall)
  - Title text can truncate inconsistently in narrow cells
  
**Visual Problems:**
- Chips feel cramped and hard to click
- Not enough padding for comfortable interaction
- Doesn't match the rest of the design token system
- Text truncation is unpredictable

```jsx
// CURRENT (BAD):
<div key={t.id} onClick={() => nav(`/tickets/${t.id}`)}
  style={{ display: "flex", alignItems: "center", gap: 5, 
    padding: "3px 6px",  // ← Too tight
    marginBottom: 3,
    background: "var(--surface-2)", 
    borderLeft: `2px solid ${P_COLOR[t.priority]}`,
    borderRadius: 5,  // ← Hardcoded
    cursor: "pointer", overflow: "hidden" }}>
```

---

## 🟡 MAJOR BUGS (Affect Multiple Pages)

### 4. **Navigation Items Missing Focus Styling**
- **Severity**: 🟡 Medium (Accessibility)
- **Location**: `src/ds/components/navigation/NavItem.jsx:37-48`
- **Issue**:
  - No `type="button"` on the button element
  - No `:focus-visible` styling (keyboard users see no focus indicator)
  - Only responds to mouse hover, not keyboard focus
  - Could trigger form submission if placed inside forms
  
```jsx
// CURRENT (INCOMPLETE):
<As
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
  style={{
    // ... has hover state but NO focus state
  }}
/>

// SHOULD ADD:
- type="button" 
- :focus-visible styles
- onFocus/onBlur handlers
```

---

### 5. **Button Disabled State Visual Feedback Weak**
- **Severity**: 🟡 Medium
- **Location**: `src/ds/components/core/Button.jsx:45-77` and `IconButton.jsx:34-48`
- **Issue**:
  - Disabled buttons only use `opacity: 0.45` to indicate disabled state
  - Still respond to hover states via inline DOM mutation
  - Creates confusion: hover effects still apply to disabled buttons
  - No distinct visual style to clearly show "this is disabled"
  
```jsx
// CURRENT (PROBLEMATIC):
const onEnter = (e) => { 
  if (disabled) return;  // Prevents hover, but opacity alone isn't enough
  if (variant === "primary") e.currentTarget.style.background = "var(--accent-hover)";
  // ...
};

// SHOULD BE:
// Use CSS classes instead of inline DOM mutation
// Add distinct disabled styling beyond just opacity
```

---

### 6. **Form Select Not Visually Consistent With Input**
- **Severity**: 🟡 Medium
- **Location**: `src/ds/components/forms/Select.jsx`
- **Issue**:
  - Select doesn't have `focus-within` wrapper styling like Input component
  - No focus ring styling
  - Chevron icon doesn't change on focus
  - Feels disconnected from Input component styling
  
**Visual Inconsistency:**
- When selecting text with keyboard, user sees native browser focus ring
- Input components would show custom styled ring
- Creates visual inconsistency in forms

---

### 7. **Inline Hover States Using DOM Mutation (Fragile)**
- **Severity**: 🟡 Medium
- **Affected Components**:
  - Planning calendar chips: `Planning.jsx:92-93`
  - Portal ticket rows: `Portal.jsx:60-61`
  - Problem detail linked tickets: `ProblemDetail.jsx:124-125`
  - HoverRow: `bits.jsx:106-107`
  - Button hover: `Button.jsx:70-73`
  - IconButton hover: `IconButton.jsx:28-35`

**Issue**: Using inline `e.currentTarget.style.background = ...` for hover effects:
- Fragile if parent re-renders
- Can cause style inconsistencies
- Harder to maintain
- Doesn't work well with concurrent rendering

**Should Use**: CSS `:hover` pseudo-class or CSS-in-JS classes instead

---

## 🟢 MINOR BUGS (Polish Issues)

### 8. **Hardcoded Border Radius Values (Not Tokenized)**
- **Severity**: 🟢 Low
- **Location**:
  - `src/components/Shell.jsx:68` - Logo: `borderRadius: 7`
  - `src/pages/Planning.jsx:91` - Chips: `borderRadius: 5`
  
**Issue**: Should use design tokens for consistency
**Fix**: Use `var(--radius-md)` or similar token instead

---

### 9. **Planning Calendar Grid Spacing Inconsistent**
- **Severity**: 🟢 Low
- **Location**: `src/pages/Planning.jsx:89`
- **Issue**: `marginBottom: 3` uses hardcoded value instead of design token
**Fix**: Use `gap` property with design token or `margin: var(--space-1)`

---

### 10. **Planning Calendar Title Truncation Unpredictable**
- **Severity**: 🟢 Low
- **Location**: `src/pages/Planning.jsx:97-98`
- **Issue**: Title span doesn't have `flex: 1; minWidth: 0;` for predictable truncation in flex containers

```jsx
// CURRENT:
<span style={{ fontSize: 11, color: "var(--text-1)", 
  overflow: "hidden", textOverflow: "ellipsis", 
  whiteSpace: "nowrap" }}>  // Missing flex properties!
  {t.title}
</span>

// SHOULD BE:
<span style={{ fontSize: 11, color: "var(--text-1)", 
  flex: 1, minWidth: 0,  // ← Add this
  overflow: "hidden", textOverflow: "ellipsis", 
  whiteSpace: "nowrap" }}>
  {t.title}
</span>
```

---

## Summary by Priority

| Priority | Count | Examples |
|----------|-------|----------|
| 🔴 Critical | 3 | Table wrapping, keyboard nav, dense chips |
| 🟡 Major | 4 | Nav focus, button disabled state, form consistency, DOM mutation |
| 🟢 Minor | 3 | Hardcoded radii, spacing tokens, truncation |
| **Total** | **10** | |

---

## Recommended Fix Order

1. **First**: Fix table text wrapping (`tdStyle` - affects all pages)
2. **Second**: Convert clickable divs to semantic elements (Portal, Problems, Planning)
3. **Third**: Add keyboard focus styling to NavItem
4. **Fourth**: Improve button disabled state visual feedback
5. **Fifth**: Replace inline hover states with CSS classes
6. **Sixth**: Add focus styling to Select component
7. **Seventh**: Replace hardcoded values with design tokens

---

## Files Requiring Changes

- `src/components/bits.jsx` - tdStyle
- `src/ds/components/navigation/NavItem.jsx` - Focus styling
- `src/ds/components/core/Button.jsx` - Disabled state
- `src/ds/components/core/IconButton.jsx` - Disabled state
- `src/ds/components/forms/Select.jsx` - Focus styling
- `src/pages/Portal.jsx` - Keyboard nav
- `src/pages/Planning.jsx` - Chips, tokens
- `src/pages/ProblemDetail.jsx` - Keyboard nav
- `src/pages/Infrastructure.jsx` - TreeRow styling
