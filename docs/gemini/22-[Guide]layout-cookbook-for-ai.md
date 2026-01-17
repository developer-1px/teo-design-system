# Layout Cookbook: Patterns for AI Design

This document serves as a "Few-Shot" example library for AI agents to select the correct `Layout` presets in the Semantic MDK system.

> **Principle**: "Choose Process (Stack/Row) -> Choose Intent (Section/Header) -> Choose Detail (Default/Tight)"

---

## 🏗️ common Page Layouts

### 1. Standard Content Page
**Intent**: A main page with a header, a content section, and a footer.

```tsx
// ❌ Avoid: Manual flex props
// <Frame className="flex flex-col gap-4 p-4">

// ✅ Correct: Semantic Layouts
<Frame layout={Layout.Stack.Content.Default} w={Size.fill} h={Size.fill}>
  {/* Header */}
  <Frame layout={Layout.Row.Header.Sticky} surface="raised">
    <Text variant="title-md">Page Title</Text>
  </Frame>

  {/* Main Section */}
  <Frame layout={Layout.Stack.Section.Default}>
    <Text variant="heading-lg">Welcome</Text>
    <Text variant="body-md">Content goes here...</Text>
  </Frame>
</Frame>
```

### 2. Dashboard with Grid
**Intent**: A dashboard showing statistics cards.

```tsx
<Frame layout={Layout.Stack.Content.Default} w={Size.fill}>
  {/* Toolbar */}
  <Frame layout={Layout.Row.Toolbar.Default}>
    <Text variant="heading-md">Dashboard</Text>
    <Frame layout={Layout.Row.Actions.Default}>
      <Button>Refresh</Button>
    </Frame>
  </Frame>

  {/* Grid of Cards */}
  <Frame layout={Layout.Grid.Dashboard.Default}>
    <StatCard title="Users" value="1,200" />
    <StatCard title="Revenue" value="$45k" />
    <StatCard title="Active" value="89%" />
  </Frame>
</Frame>
```

---

## 🧩 Component Patterns

### 3. Media Object (List Item with Icon)
**Intent**: An item in a list with an icon, text, and an action.

```tsx
<Frame
  layout={Layout.Row.Item.Default} // ✅ Gives min-height & padding automatically
  surface="card"
  interactive={true}
>
  {/* Icon Slot */}
  <Icon name="user" color="subtle" />

  {/* Content Slot */}
  <Frame layout={Layout.Stack.Content.Tight} w={Size.fill}>
    <Text variant="label-md">User Name</Text>
    <Text variant="caption-sm" color="subtle">user@example.com</Text>
  </Frame>

  {/* Action Slot */}
  <Icon name="chevron-right" color="subtle" />
</Frame>
```

### 4. Modal / Dialog Footer
**Intent**: Buttons at the bottom of a dialog.

```tsx
<Frame
  layout={Layout.Row.Actions.Default} // ✅ Aligns right with correct gap
  w={Size.fill}
  py={Space.n16}
>
  <Button variant="ghost">Cancel</Button>
  <Button variant="primary">Confirm Action</Button>
</Frame>
```

### 5. Key-Value Properties
**Intent**: Displaying metadata pairs.

```tsx
<Frame layout={Layout.Grid.Cards.Compact}> {/* Or use Slots.KeyValue if strict table needed */}
   <Frame layout={Layout.Stack.Content.Tight}>
     <Text variant="label-sm" color="subtle">Status</Text>
     <Badge variant="success">Active</Badge>
   </Frame>
   <Frame layout={Layout.Stack.Content.Tight}>
     <Text variant="label-sm" color="subtle">Created</Text>
     <Text variant="body-sm">2 days ago</Text>
   </Frame>
</Frame>
```

### 6. Two-Column Form
**Intent**: Complex forms that need efficient space usage.

```tsx
<Frame layout={Layout.Grid.Form.TwoColumn}>
  <Frame layout={Layout.Stack.Form.Default}>
    <Text variant="label-sm">First Name</Text>
    <Input />
  </Frame>
  
  <Frame layout={Layout.Stack.Form.Default}>
    <Text variant="label-sm">Last Name</Text>
    <Input />
  </Frame>
  
  {/* Full width item in grid can be handled by override if needed, or by wrapping in a full-width container */}
</Frame>
```

---

## 🚫 Anti-Patterns (Do NOT Do This)

### ❌ "The Flat Button"
AI often forgets that buttons need size.
```tsx
// ❌ Bad: No height, no padding
<Frame row gap={Space.n8}>
  <Icon name="plus" />
  <Text>Add</Text>
</Frame>
```
**Correction**: Use a preset.
```tsx
// ✅ Good: Layout.Row.Item or Toolbar guarantees height/padding
<Frame layout={Layout.Row.Item.Compact} surface="button">
  <Icon name="plus" />
  <Text>Add</Text>
</Frame>
```

### ❌ "The Manual Margin"
AI tries to use `mt`, `mb` manually.
```tsx
// ❌ Bad: Measuring pixels manually
<Frame>
  <Header />
  <Frame h={Space.n20} /> {/* Manual Spacer */}
  <Content />
</Frame>
```
**Correction**: Use a parent Stack.
```tsx
// ✅ Good: Parent defines the rhythm
<Frame layout={Layout.Stack.Content.Default}>
  <Header />
  <Content />
</Frame>
```
