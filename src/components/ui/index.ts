/**
 * UI Components
 * 재사용 가능한 UI 컴포넌트들을 export
 */

// Re-export from atoms
export { Button } from '@/components/atoms/Button';
export type { ButtonProps } from '@/components/atoms/Button';

export { IconButton } from '@/components/atoms/IconButton';
export type { IconButtonProps } from '@/components/atoms/IconButton';

export { Input } from '@/components/atoms/Input';
export type { InputProps } from '@/components/atoms/Input';

export { Label } from '@/components/atoms/Label';
export type { LabelProps } from '@/components/atoms/Label';

export { Checkbox } from '@/components/atoms/Checkbox';
export type { CheckboxProps } from '@/components/atoms/Checkbox';

export { Radio } from '@/components/atoms/Radio';
export type { RadioProps } from '@/components/atoms/Radio';

export { Badge } from '@/components/atoms/Badge';
export type { BadgeProps } from '@/components/atoms/Badge';

export { Avatar } from '@/components/atoms/Avatar';
export type { AvatarProps } from '@/components/atoms/Avatar';

export { Card } from '@/components/atoms/Card';
export type { CardProps } from '@/components/atoms/Card';

export { Alert } from '@/components/atoms/Alert';
export type { AlertProps } from '@/components/atoms/Alert';

export { Divider } from '@/components/atoms/Divider';
export type { DividerProps } from '@/components/atoms/Divider';

export { Kbd } from '@/components/atoms/Kbd';
export type { KbdProps } from '@/components/atoms/Kbd';

// Complex UI Components
export { Content, ContentGroup } from './Content';
export type { ContentProps, ContentGroupProps } from './Content';

export { useProminence, ProminenceProvider, ProminenceContext } from './ProminenceContext';
export type { ProminenceContextValue } from './ProminenceContext';

export { ResizeHandle } from './ResizeHandle';
export type { ResizeHandleProps } from './ResizeHandle';

// Form Components (complex ones from ui/)
export { Textarea } from './Textarea';
export type { TextareaProps } from './Textarea';

export { Select } from './Select';
export type { SelectProps } from './Select';

export { Switch } from './Switch';
export type { SwitchProps } from './Switch';

export { FormField } from './FormField';
export type { FormFieldProps } from './FormField';

// Display Components
export { Tag } from './Tag';
export type { TagProps } from './Tag';

// Search & Interaction
export { SearchInput } from './SearchInput';
export type { SearchInputProps } from './SearchInput';

export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps } from './Tabs';

export { Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator } from './Dropdown';
export type { DropdownProps, DropdownTriggerProps, DropdownContentProps, DropdownItemProps } from './Dropdown';

// Data Display
export { DataTable } from './DataTable';

// Content Components
export { Code } from './Code';
export type { CodeProps } from './Code';

export { CodeBlock } from './CodeBlock';
export type { CodeBlockProps } from './CodeBlock';

export { Spinner } from './Spinner';
export type { SpinnerProps } from './Spinner';

export { Progress } from './Progress';
export type { ProgressProps } from './Progress';

export { Skeleton } from './Skeleton';
export type { SkeletonProps } from './Skeleton';

export { Tooltip } from './Tooltip';
export type { TooltipProps } from './Tooltip';
