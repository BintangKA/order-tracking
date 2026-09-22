# Anti Gravity Frontend Rules

## 1. Project Overview

This is a frontend application built with:

* React
* Vite
* TypeScript
* REST API integration
* Inter font
* White / Light theme

The frontend must be developed with a clean, modern, professional, responsive, and maintainable design.

---

# 2. Primary Development Principles

The AI MUST:

1. Inspect the existing project before modifying code.
2. Understand the existing component structure.
3. Reuse existing components whenever possible.
4. Reuse existing utilities, hooks, services, and styles.
5. Follow the existing project architecture.
6. Avoid unnecessary dependencies.
7. Avoid duplicate components.
8. Avoid changing unrelated code.
9. Preserve existing functionality.
10. Keep code readable and maintainable.
11. Use TypeScript properly.
12. Ensure responsive behavior.
13. Ensure loading, empty, and error states are handled.
14. Verify the implementation before considering the task complete.

Do not implement functionality based only on assumptions.

---

# 3. Mandatory Workflow

Before implementing a request:

### Step 1 — Understand

Identify:

* What the user wants.
* Which page is affected.
* Which components are affected.
* Whether the change affects routing.
* Whether the change affects API integration.
* Whether the change affects shared UI.

### Step 2 — Inspect

Inspect existing:

```text
src/
├── components/
├── pages/
├── layouts/
├── hooks/
├── services/
├── types/
├── utils/
├── routes/
└── assets/
```

Look for existing implementations before creating new ones.

### Step 3 — Plan

Determine:

```text
Page
 ↓
Layout
 ↓
Component
 ↓
Hook
 ↓
Service
 ↓
API
```

Only modify the layers that are actually required.

### Step 4 — Implement

Implement the smallest complete solution.

Do not rewrite the entire application for a small feature.

### Step 5 — Verify

Run:

```bash
npm run lint
npm run build
```

If the project has tests:

```bash
npm run test
```

Fix errors before declaring the task complete.

---

# 4. UI Design Direction

The entire application must use:

```text
Theme:
White / Light

Font:
Inter

Style:
Clean
Modern
Minimal
Professional
Responsive
Accessible
```

The design should feel like a modern SaaS/dashboard application.

Avoid:

* Excessive gradients
* Excessive shadows
* Excessive rounded elements
* Excessive animations
* Unnecessary decorative elements
* Visually noisy layouts
* Random colors

---

# 5. White Theme

The application MUST use a white/light theme by default.

Recommended design tokens:

```css
:root {
    --background: #ffffff;
    --surface: #ffffff;
    --surface-muted: #f8fafc;

    --text-primary: #111827;
    --text-secondary: #6b7280;
    --text-muted: #9ca3af;

    --border: #e5e7eb;

    --primary: #2563eb;
    --primary-hover: #1d4ed8;

    --success: #16a34a;
    --warning: #d97706;
    --danger: #dc2626;
}
```

Use white as the primary background.

Use subtle gray surfaces to create visual hierarchy.

Avoid dark backgrounds unless explicitly requested.

---

# 6. Font — Inter

The entire application MUST use Inter.

Preferred:

```css
font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
```

If Inter is already installed or configured, reuse the existing configuration.

Do not introduce another primary font.

Typography should be consistent across:

* Headings
* Paragraphs
* Buttons
* Forms
* Tables
* Navigation
* Modals
* Status badges

---

# 7. Typography

Use a clear hierarchy.

Recommended:

```text
Page Title
24–32px
font-weight: 600–700

Section Title
18–20px
font-weight: 600

Body
14–16px
font-weight: 400

Secondary Text
13–14px
font-weight: 400

Table
13–14px
```

Do not use extremely large text unless specifically requested.

Do not use excessive font weights.

---

# 8. Layout

Use a consistent application layout.

Desktop:

```text
┌───────────────────────────────────────────────┐
│ Header                                        │
├──────────────┬────────────────────────────────┤
│ Sidebar      │ Main Content                   │
│              │                                │
│ Navigation   │ Page Header                    │
│              │                                │
│              │ Content                        │
│              │                                │
└──────────────┴────────────────────────────────┘
```

Mobile:

```text
┌──────────────────────────┐
│ Header                   │
├──────────────────────────┤
│ Main Content             │
│                          │
│                          │
└──────────────────────────┘
```

The sidebar should become a drawer or mobile navigation when necessary.

---

# 9. Page Structure

A standard page should follow:

```text
Page
 ├── Page Header
 │    ├── Title
 │    ├── Description
 │    └── Actions
 │
 └── Content
      ├── Filters
      ├── Table / Content
      └── Pagination
```

Example:

```text
Orders
Manage and monitor all orders

[ Search orders... ] [ Status ] [ Create Order ]

┌────────────────────────────────────────────────┐
│ Order table                                    │
└────────────────────────────────────────────────┘

Showing 1–10 of 100

[ Previous ] [ 1 ] [ 2 ] [ Next ]
```

Keep page hierarchy obvious.

---

# 10. Tables Are Required for Structured Data

When displaying multiple structured records, ALWAYS prefer a table.

Use tables for:

* Orders
* Users
* Customers
* Products
* Inventory
* Transactions
* Reports
* Logs
* Events
* Order history
* Lists containing multiple attributes

Do NOT automatically turn every record into a card.

Bad:

```text
┌─────────────┐
│ Order 001   │
│ John Doe    │
│ Processing  │
└─────────────┘

┌─────────────┐
│ Order 002   │
│ Jane Doe    │
│ Completed   │
└─────────────┘
```

Preferred:

```text
┌──────────┬────────────┬────────────┬──────────┐
│ Order    │ Customer   │ Status     │ Action   │
├──────────┼────────────┼────────────┼──────────┤
│ ORD-001  │ John Doe   │ Processing │ View     │
│ ORD-002  │ Jane Doe   │ Completed  │ View     │
└──────────┴────────────┴────────────┴──────────┘
```

---

# 11. Table Design

Tables must have:

* White background
* Subtle border
* Light header background
* Clear column spacing
* Consistent typography
* Hover state
* Responsive behavior

Recommended Tailwind style:

```tsx
<div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
    <div className="overflow-x-auto">
        <table className="w-full text-sm">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                        Order
                    </th>

                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                        Customer
                    </th>

                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                        Status
                    </th>
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
                {/* rows */}
            </tbody>
        </table>
    </div>
</div>
```

---

# 12. Responsive Tables

Tables must remain usable on mobile.

Use:

```tsx
<div className="overflow-x-auto">
    <table>
        ...
    </table>
</div>
```

Do not shrink table content until it becomes unreadable.

If the table contains many columns, horizontal scrolling is acceptable.

---

# 13. Table States

Every API-driven table MUST support:

### Loading

Use a skeleton or loading indicator.

### Empty

Example:

```text
No orders found

There are currently no orders to display.
```

### Error

Example:

```text
Unable to load orders

Please try again.
```

### Success

Display the actual records.

---

# 14. Search

Search inputs should be clear and accessible.

Example:

```text
[ 🔍 Search orders... ]
```

Use a debounce for API-driven search when appropriate.

Do not trigger an API request on every keystroke unless necessary.

---

# 15. Filters

Filters should be placed close to the data they affect.

Example:

```text
[ Search... ] [ Status ▼ ] [ Date ▼ ]
```

Avoid unnecessarily complicated filtering interfaces.

Only include filters that provide actual value.

---

# 16. Pagination

Use pagination when datasets can become large.

Example:

```text
Showing 1–10 of 100

[ Previous ] [ 1 ] [ 2 ] [ 3 ] [ Next ]
```

Pagination must handle:

* Loading
* Disabled previous button
* Disabled next button
* Current page
* Empty results

---

# 17. Status Badges

Use compact status badges.

Example:

```tsx
<span className="rounded-full px-2.5 py-1 text-xs font-medium">
    Processing
</span>
```

Semantic colors:

```text
Success     → Green
Processing  → Blue
Warning     → Amber
Error       → Red
Cancelled   → Red
Pending     → Gray
```

Do not use color as the only source of meaning.

The status text must remain visible.

---

# 18. Buttons

Buttons must have a clear visual hierarchy.

Primary:

```text
Create Order
Save Changes
Submit
```

Secondary:

```text
Cancel
Back
Filter
```

Danger:

```text
Delete
Cancel Order
Remove
```

Avoid having multiple primary buttons competing for attention.

---

# 19. Icons

Use icons only when they improve usability.

Icons may be used for:

* Search
* Filter
* Edit
* Delete
* View
* Navigation
* Notifications
* Settings

Do not use icons as the only indicator for unfamiliar actions.

Icon-only buttons must have an accessible label or tooltip.

---

# 20. Forms

Forms must include:

* Label
* Input
* Validation
* Error message
* Proper spacing
* Loading state
* Disabled state

Bad:

```text
[ Enter name ]
```

Preferred:

```text
Customer Name

[ John Doe                    ]

Please enter the customer name.
```

Never rely only on placeholder text as the label.

---

# 21. Input Styling

Inputs should follow the white theme.

Recommended:

```text
Background: white
Border: gray-200
Text: gray-900
Placeholder: gray-400
Focus: primary color
```

Inputs should have visible focus states.

---

# 22. Form Validation

Frontend validation is for user experience.

The backend remains the source of truth.

Display validation errors close to the affected field.

Example:

```text
Email

[ invalid-email ]

Please enter a valid email address.
```

---

# 23. Loading States

Do not leave blank screens while data is loading.

Use:

* Skeleton
* Spinner
* Loading text

For tables, prefer skeleton rows when practical.

Example:

```text
┌─────────────────────────────────────┐
│ ███████   █████████   ██████       │
│ ███████   █████████   ██████       │
│ ███████   █████████   ██████       │
└─────────────────────────────────────┘
```

---

# 24. Empty States

Empty states should explain what happened.

Good:

```text
No orders found

There are no orders matching your current filters.
```

Avoid:

```text
Nothing.
```

When appropriate, provide an action:

```text
No orders yet

Create your first order to get started.

[ Create Order ]
```

---

# 25. Error States

Errors must be user-friendly.

Bad:

```text
AxiosError: Request failed with status code 500
```

Good:

```text
Unable to load orders

Something went wrong while loading the orders.

[ Try Again ]
```

Do not expose technical implementation details to users.

---

# 26. Dashboard Cards

Cards are appropriate for summary information.

Examples:

```text
┌─────────────────────┐
│ Total Orders        │
│                     │
│ 1,248               │
│ +12.5% this month   │
└─────────────────────┘
```

Use cards for:

* KPI
* Statistics
* Summary
* Small grouped information

Do not use cards to replace large data tables.

---

# 27. Dashboard Design

Dashboard hierarchy:

```text
Dashboard

Summary Metrics
    ↓
Important Visualization
    ↓
Recent Data
    ↓
Additional Information
```

Do not fill the dashboard with unnecessary charts.

Every chart should communicate useful information.

---

# 28. Detail Pages

Detail pages should clearly separate sections.

Example:

```text
Order #ORD-001

┌─────────────────────────────────────────┐
│ Order Information                       │
├─────────────────────────────────────────┤
│ Customer: John Doe                      │
│ Status: Processing                      │
│ Created: 22 September 2026              │
└─────────────────────────────────────────┘

Order Timeline

Created
   │
   ●
   │
Processing
   │
   ●
   │
Assigned
```

---

# 29. Timeline

For tracking-related pages, use a timeline when chronological information is important.

Timeline must distinguish:

```text
Completed
Current
Pending
Cancelled
```

The current status should be visually clear.

---

# 30. Modal / Dialog

Use modals for focused interactions.

Good use cases:

* Confirmation
* Small forms
* Important actions
* Short information

Do not put entire complex pages inside a modal.

For destructive actions:

```text
Delete Order?

Are you sure you want to delete this order?

[ Cancel ] [ Delete ]
```

---

# 31. Navigation

Navigation should be simple and predictable.

Use:

* Clear labels
* Consistent icons
* Active state
* Logical grouping

Example:

```text
Dashboard

Orders
  ├── All Orders
  └── Tracking

Management
  ├── Customers
  └── Users

Settings
```

Avoid unnecessary nested navigation.

---

# 32. React Component Rules

Use functional components.

Preferred:

```tsx
function OrderTable() {
    return (
        <table>
            ...
        </table>
    );
}
```

Avoid unnecessary class components.

Components should have a single clear responsibility.

Avoid giant components.

If a component becomes difficult to understand, split it into logical reusable components.

---

# 33. Component Reusability

Before creating a component, search for an existing equivalent.

For example, if the project already has:

```text
components/ui/Button.tsx
components/ui/Input.tsx
components/ui/Modal.tsx
components/ui/Table.tsx
```

reuse them.

Do not create:

```text
components/CustomButton.tsx
components/NewButton.tsx
components/MyButton.tsx
```

without a real reason.

---

# 34. API Architecture

API communication should be separated from UI components.

Preferred:

```text
Page
 ↓
Hook
 ↓
Service
 ↓
API Client
 ↓
Backend
```

Avoid:

```tsx
function OrderPage() {
    useEffect(() => {
        axios.get("/api/orders");
    }, []);
}
```

when the project already provides an API service layer.

---

# 35. API Services

Example:

```ts
export async function getOrders(): Promise<Order[]> {
    const response = await api.get<ApiResponse<Order[]>>(
        "/orders"
    );

    return response.data.data;
}
```

Keep API services focused on communication.

Do not put complex UI logic inside API services.

---

# 36. TypeScript Rules

TypeScript must be used properly.

Avoid:

```ts
const data: any = response.data;
```

Prefer:

```ts
interface Order {
    id: number;
    orderNumber: string;
    status: string;
}
```

Use explicit types for:

* API responses
* Component props
* Forms
* Domain models
* Hooks
* Shared data structures

Avoid unnecessary type assertions.

---

# 37. `any` Rule

Do not use `any` unless there is a legitimate technical reason.

If `any` is unavoidable:

1. Keep its scope small.
2. Document why it is necessary.
3. Prefer a safer type if possible.

---

# 38. State Management

Use the simplest state management solution appropriate for the feature.

Prefer:

```text
Local component state
        ↓
Custom hook
        ↓
Shared state
```

Do not introduce a global state library for simple local state.

Avoid duplicating server state.

If the project already uses TanStack Query, follow the existing pattern.

---

# 39. useEffect Rules

Do not use `useEffect` unnecessarily.

Use it for actual side effects such as:

* API synchronization when required
* Event listeners
* Subscriptions
* Timers
* External system integration

Do not use `useEffect` simply to calculate derived values.

Bad:

```tsx
useEffect(() => {
    setTotal(price * quantity);
}, [price, quantity]);
```

Prefer:

```tsx
const total = price * quantity;
```

---

# 40. Routing

Follow the existing routing architecture.

Do not create duplicate routes.

Routes should have clear names.

Example:

```text
/dashboard
/orders
/orders/:id
/orders/:id/tracking
/users
/settings
```

Protected routes should use the existing authentication mechanism.

---

# 41. Authentication

Do not duplicate authentication logic across pages.

Centralize authentication behavior through the project's existing:

* Auth provider
* Auth hook
* Route guard
* API client

Never store secrets directly in frontend source code.

---

# 42. Real-Time UI

If the application uses SSE:

```text
Page
 ↓
Custom Hook
 ↓
EventSource
 ↓
Backend
```

Do not create EventSource connections directly in many components.

Handle:

```text
Connecting
Connected
Disconnected
Reconnecting
```

Clean up connections when the component unmounts.

Example:

```tsx
useEffect(() => {
    const eventSource = new EventSource(url);

    return () => {
        eventSource.close();
    };
}, [url]);
```

---

# 43. Performance

Avoid unnecessary rendering.

Use optimization only when there is a real performance reason.

Consider:

* `React.memo`
* `useMemo`
* `useCallback`
* Lazy loading
* Code splitting
* Pagination
* Debounced search

Do not add optimization blindly.

Prefer simple code until performance requires optimization.

---

# 44. Accessibility

Use semantic HTML.

Prefer:

```tsx
<button>
```

instead of:

```tsx
<div onClick={...}>
```

Use:

* `label`
* `aria-label`
* `aria-describedby`
* semantic headings
* keyboard navigation
* focus states

Buttons and links must be distinguishable.

---

# 45. Responsive Design

Every page must work on:

* Desktop
* Laptop
* Tablet
* Mobile

Do not assume a large screen.

Check:

```text
Mobile
Tablet
Desktop
```

when implementing significant UI changes.

---

# 46. Mobile Rules

On mobile:

* Reduce unnecessary spacing.
* Stack actions when necessary.
* Allow tables to scroll horizontally.
* Keep buttons touch-friendly.
* Avoid tiny text.
* Avoid overflowing content.
* Make navigation accessible.

Do not simply scale down the desktop UI.

---

# 47. Animations

Animations should be:

* Subtle
* Fast
* Purposeful

Use animation for:

* Page transitions
* Modal appearance
* Loading states
* Hover feedback
* Expanding/collapsing sections

Avoid excessive animation.

Do not animate every element.

---

# 48. Colors

Use a limited color palette.

Primary colors should be consistent.

Semantic colors:

```text
Success → Green
Warning → Amber
Danger → Red
Info → Blue
Neutral → Gray
```

Do not randomly assign colors to components.

---

# 49. Shadows

Use subtle shadows only when needed.

Avoid:

```text
Large dramatic shadows
Multiple shadows
Heavy glowing effects
```

Preferred:

```text
Subtle shadow
or
Border-based separation
```

The interface should feel clean and professional.

---

# 50. Border Radius

Use consistent border radius.

Recommended:

```text
Small controls → rounded-md
Inputs         → rounded-md
Cards          → rounded-xl
Dialogs        → rounded-xl
Tables         → rounded-xl
```

Do not mix many unrelated radius values.

---

# 51. Spacing

Use a consistent spacing system.

Prefer Tailwind spacing utilities or the project's existing spacing tokens.

Avoid random values throughout the application.

Keep:

* Page padding
* Section spacing
* Form spacing
* Table spacing
* Card spacing

consistent.

---

# 52. No Hardcoded Fake Data

Do not create fake production data when API integration is expected.

Bad:

```ts
const orders = [
    {
        id: 1,
        orderNumber: "ORD-001",
    },
];
```

if the page is supposed to load data from the backend.

Use the actual API service.

Mock data is acceptable only when explicitly requested.

---

# 53. Error Handling

API failures must be handled gracefully.

The user should see a meaningful message.

Do not expose:

```text
AxiosError
HTTP stack trace
Backend stack trace
Raw JSON errors
```

unless the interface is explicitly a developer/debugging interface.

---

# 54. Security

Never expose:

* API secrets
* Private keys
* Database credentials
* JWT secrets
* Sensitive environment variables

Remember that Vite variables prefixed with:

```text
VITE_
```

are exposed to the browser.

Never place sensitive secrets in them.

---

# 55. Environment Variables

Use:

```env
VITE_API_URL=http://localhost:8080/api
```

Access through:

```ts
const API_URL = import.meta.env.VITE_API_URL;
```

Do not hardcode environment-specific API URLs throughout components.

---

# 56. File Naming

Use consistent naming.

Components:

```text
OrderTable.tsx
OrderDetail.tsx
OrderStatusBadge.tsx
```

Hooks:

```text
useOrders.ts
useOrder.ts
useOrderEvents.ts
```

Services:

```text
orderService.ts
authService.ts
```

Types:

```text
order.ts
user.ts
api.ts
```

Use descriptive names.

---

# 57. Folder Organization

Preferred:

```text
src/
├── assets/
├── components/
│   ├── ui/
│   ├── layout/
│   └── features/
│
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

Follow the existing structure if the project already uses another consistent architecture.

Do not reorganize the entire project unless explicitly requested.

---

# 58. Avoid Duplicate Logic

If multiple components use the same logic:

```text
Component A
Component B
Component C
```

consider extracting:

```text
useSomething()
```

or:

```text
utils/something.ts
```

Only extract when the logic is genuinely reusable.

---

# 59. Avoid Giant Components

If a page contains:

* Table
* Filter
* Modal
* Form
* Timeline
* Header
* Multiple dialogs

do not keep everything in one massive component.

Extract logical components:

```text
OrderPage
├── OrderHeader
├── OrderFilters
├── OrderTable
├── OrderPagination
├── OrderStatusBadge
└── CancelOrderDialog
```

---

# 60. Do Not Overengineer

Do not introduce:

* Redux
* Zustand
* Additional UI frameworks
* Additional HTTP clients
* Complex design systems
* Large abstraction layers

unless there is an actual requirement.

Use the tools already available in the project.

---

# 61. Preserve Existing UI

When modifying a feature:

* Preserve existing visual language.
* Preserve existing spacing.
* Preserve existing components.
* Preserve existing interactions.

Only change the UI elements required by the request.

---

# 62. Complete File Rule

When modifying source code, provide complete files whenever the user asks for code.

Do not return incomplete code such as:

```text
// existing code...
```

or:

```text
// rest of the component
```

when the complete file is required.

Code should be copy-paste ready.

---

# 63. No Unnecessary Changes

If the user asks:

```text
Change the table pagination
```

do not also:

* redesign the sidebar
* change fonts
* change colors
* change routing
* rewrite API services

unless required by the request.

Keep changes scoped.

---

# 64. Final UI Checklist

Before completing a frontend task, verify:

### Design

* [ ] White/light theme
* [ ] Inter font
* [ ] Consistent typography
* [ ] Consistent spacing
* [ ] Consistent border radius
* [ ] Subtle borders/shadows
* [ ] Professional appearance

### Data

* [ ] Structured data uses tables
* [ ] Table is responsive
* [ ] Search works when required
* [ ] Filters work when required
* [ ] Pagination works when required
* [ ] Loading state exists
* [ ] Empty state exists
* [ ] Error state exists

### React

* [ ] Components are reusable
* [ ] No unnecessary `useEffect`
* [ ] No unnecessary state
* [ ] No unnecessary `any`
* [ ] API logic is separated
* [ ] Existing components are reused

### Responsive

* [ ] Desktop
* [ ] Tablet
* [ ] Mobile
* [ ] No horizontal overflow except intentional table scrolling
* [ ] Buttons are usable on mobile

### Accessibility

* [ ] Semantic HTML
* [ ] Labels exist
* [ ] Keyboard navigation works
* [ ] Focus states exist
* [ ] Icon-only buttons have accessible labels
* [ ] Color is not the only status indicator

### Quality

* [ ] No fake data unless explicitly requested
* [ ] No duplicate components
* [ ] No unnecessary dependencies
* [ ] No unrelated changes
* [ ] `npm run lint` passes
* [ ] `npm run build` passes

---

# 65. Final AI Behavior

Act as a senior React frontend engineer and UI engineer.

Before coding:

```text
Inspect
 ↓
Understand
 ↓
Plan
 ↓
Implement
 ↓
Verify
```

Always prefer:

```text
Existing component
        ↓
Existing hook
        ↓
Existing service
        ↓
Existing utility
```

before creating something new.

The final frontend should be:

```text
Clean
+
Modern
+
White
+
Inter
+
Table-oriented
+
Responsive
+
Accessible
+
Type-safe
+
Maintainable
+
Production-ready
```

The AI must optimize for a consistent and maintainable application, not merely code that renders successfully.
