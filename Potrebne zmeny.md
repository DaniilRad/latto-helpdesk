UI Bug List - Helpdesk Application

Here's a comprehensive breakdown of UI bugs that need fixing:
🔴 HIGH PRIORITY ISSUES

1. Keyboard Navigation Broken on Clickable Rows

   Affected Pages: Portal, Problems Detail, Planning, Infrastructure
   Issue: Many interactive elements (ticket rows, calendar chips, tree items) are coded as <div onClick> instead of semantic buttons/links, making them keyboard-inaccessible
   Files:
   src/pages/Portal.jsx - "My tickets" and "Popular articles" rows
   src/pages/ProblemDetail.jsx - Linked ticket rows
   src/pages/Planning.jsx - Calendar reservation chips
   src/pages/Infrastructure.jsx - TreeRow component
   Fix: Convert to <button>, <Link>, or add role="button", tabIndex={0}, and keyboard handlers (Enter/Space keys)

2. Table Cells Don't Wrap Text Properly

   File: src/components/bits.jsx - tdStyle constant
   Issue: All table cells have whiteSpace: "nowrap" forcing text not to wrap, causing horizontal scroll on mobile and making long notes/URLs unreadable
   Affected Tables: Notes, descriptions, titles, vendor names
   Fix: Remove nowrap from text-heavy columns; keep it only for IDs and dates

3. Navigation Items Missing Keyboard Focus Styling

   File: src/ds/components/navigation/NavItem.jsx
   Issue: Sidebar nav items only respond to mouse hover; no visible :focus-visible or keyboard navigation affordance. Missing type="button" can cause accidental form submission
   Fix: Add type="button", :focus-visible styling, and keyboard focus state

🟡 MEDIUM PRIORITY ISSUES 4. Button Disabled State Inconsistent

    Files: src/ds/components/core/Button.jsx, IconButton.jsx
    Issue: Disabled state only uses opacity and cursor: not-allowed; hover states are still applied via DOM mutation, making disabled buttons visually confusing
    Fix: Move hover/pressed styles to CSS classes and use a distinct disabled visual style (lighter, more desaturated)

5. Planning Calendar Chips Too Dense

   File: src/pages/Planning.jsx
   Issue: Reservation chips use hardcoded borderRadius: 5 and tight padding (3px 6px), making them look cramped compared to rest of UI. Title text can truncate inconsistently in narrow cells
   Fix:
   Increase padding to match design tokens
   Use tokenized border-radius instead of hardcoded 5
   Add flex: 1; minWidth: 0; to title span for consistent truncation

6. Infrastructure Tree Rows Inconsistent Hover States

   File: src/pages/Infrastructure.jsx - TreeRow component
   Issue: Toggle rows get hover styling, but Link rows don't, making some rows appear less clickable
   Fix: Apply consistent hover/focus styles to both toggle and link rows

7. Form Select Not Styled Consistently

   File: src/ds/components/forms/Select.jsx
   Issue: Select control doesn't mirror the focus-within wrapper styling used by Input component; feels visually inconsistent in forms
   Fix: Add focus-within state styling and match Input component's border/ring treatment

🟢 LOW PRIORITY ISSUES 8. Hardcoded Border Radius Values

    Files: src/components/Shell.jsx (logo: borderRadius: 7), src/pages/Planning.jsx (chips: borderRadius: 5)
    Issue: Should use design tokens for consistency
    Fix: Replace with tokenized radius (e.g., var(--radius-sm))

9. Portal Clickable Rows Missing Cursor Feedback

   File: src/pages/Portal.jsx
   Issue: The inline styles show cursor pointer, but they're not semantic, making screen readers miss them
   Fix: Convert to proper buttons or links

10. Planning Calendar Grid Spacing

    File: src/pages/Planning.jsx
    Issue: Calendar chips have marginBottom: 3 which is inconsistent with design token spacing
    Fix: Use standardized gap/spacing token instead

Summary by File
File Bug Count Severity
src/pages/Portal.jsx 1 High
src/pages/Planning.jsx 3 High + Medium
src/pages/Infrastructure.jsx 1 Medium
src/pages/ProblemDetail.jsx 1 High
src/components/bits.jsx 1 High
src/ds/components/navigation/NavItem.jsx 1 High
src/ds/components/core/Button.jsx 1 Medium
src/ds/components/forms/Select.jsx 1 Medium
src/components/Shell.jsx 1 Low

Next Steps: Would you like me to fix any of these bugs? I'd recommend starting with the High Priority items (keyboard navigation, text wrapping in tables, nav focus styling) as they affect accessibility and usability the most.
