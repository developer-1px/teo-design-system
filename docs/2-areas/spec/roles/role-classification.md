# Role Classification Specification

This document defines the standard classification for all UI components in the IDDL system. The classification is based on the functional role of the component: **Section**, **Block**, **Action**, **Field**, or **Element** (Text/Separator).

## Classification Principles

| Category | Description | Characteristics | Examples |
|----------|-------------|-----------------|----------|
| **Section** | Page Area | Distinct physical region, often with its own layout context context. | Modal, Drawer, Sidebar, Main |
| **Block** | Container | Structural container for other components. "The Frame". | Stack, List, Menu, Card, Form |
| **Action** | Interactive Leaf | A single, click-target leaf node. "The Trigger". | Button, MenuItem, Tab, Link |
| **Field** | Input | User input mechanism. | Input, Select, Checkbox |
| **Text** | Information Leaf | Read-only text or status indicator. | Label, Title, Badge |
| **Separator** | Visual Divider | Purely visual separation. | Divider, Spacer |

---

## Role Definitions

### 1. Section Roles
*Defines major layout areas.*

```typescript
type SectionRole =
  | 'Main' | 'Header' | 'Footer' | 'Sidebar' | 'Panel'
  | 'Modal' | 'Drawer' | 'Sheet' | 'Dialog'
  | 'Region' // Generic region
```

### 2. Block Roles
*Containers that structure content.*

#### Structural
- `Container`
- `Stack` (Flex)
- `Grid`
- `Card` (Content Container)
- `Group` (Generic)

#### Navigation & Grouping
- `Tabs` (Tab List Container)
- `Breadcrumbs`
- `Pagination`
- `Stepper`
- `NavGroup`
- `ButtonGroup`
- `ChipGroup`
- `RadioGroup`
- `FieldGroup`

#### Collections (Lists & Menus)
- `List`
- `Menu`
- `SubMenu`
- `ContextMenu`
- `TreeView`
- `Table`
- `DataGrid`
- `Accordion`
- `Carousel`
- `Timeline`

#### Composites
- `Form`
- `SearchBar`
- `CommandPalette`
- `Calendar`
- `Dropdown` (Trigger + Menu container)

#### Feedback Containers
- `Alert`
- `Toast`
- `Banner`
- `Tooltip`
- `Popover`

### 3. Action Roles
*Clickable, interactive leaf nodes.*

#### Basic Triggers
- `Button`
- `IconButton`
- `Link`
- `ToggleButton`
- `DropdownTrigger`
- `AccordionTrigger`
- `TooltipTrigger`

#### Selection Items
- `Tab`
- `MenuItem`
- `Option` (Select Option)
- `Chip` (Interactive)
- `Radio` (Input-like but often stylized as actionable)
- `StepItem`
- `PageButton` (Pagination Item)
- `BreadcrumbItem`

#### List/Table Items
- `ListItem` (Clickable)
- `TreeItem`
- `NavItem`
- `CommandItem`
- `TableRow` (Clickable)
- `CalendarDay`

#### Media/User
- `Avatar` (Clickable)
- `Notification` (Item)

### 4. Field Roles
*Data entry inputs.*

#### Textual
- `Input` (Text)
- `TextArea`
- `SearchInput`
- `PasswordInput`

#### Choice
- `Select`
- `Combobox`
- `Checkbox`
- `Switch`
- `Radio` (Input)

#### Numeric/Special
- `NumberInput`
- `Slider`
- `ColorPicker`
- `FilePicker`
- `DatePicker`
- `TimePicker`

### 5. Element Roles (Text & Separator)
*Static content.*

#### Typography
- `Title`
- `Heading`
- `Body`
- `Label`
- `Caption`
- `ListItemText` (Non-clickable part)

#### Status
- `Badge`
- `Tag` (Non-interactive)
- `Progress`
- `Spinner`
- `Skeleton`

#### Visual
- `Divider`
- `Spacer`
- `Icon`
- `Avatar` (Non-clickable)

---

## Migration Notes

Legacy roles currently in `BlockRole` that should move to `ActionRole`:
- `ListItem`
- `MenuItem`
- `Tab`
- `Chip`
- `Badge` (-> Text/Element)
- `Avatar` (-> Text/Action)

Legacy roles in `BlockRole` that should move to `FieldRole`:
- `Checkbox` (if present)
- `Radio` (if present)
