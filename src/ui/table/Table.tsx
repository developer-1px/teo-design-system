import {TableCell} from "./TableCell"
import {TableEmpty} from "./TableEmpty"
import {TableHead} from "./TableHead"
import {TableHeader} from "./TableHeader"
import {TableRoot} from "./TableRoot"
import {TableRow} from "./TableRow"

/**
 * Table component namespace structure
 *
 * Usage:
 * ```tsx
 * <Table.Root>
 *   <Table.Header columns="1fr 2fr 1fr">
 *     <Table.Head sortable onSort={...}>Name</Table.Head>
 *     <Table.Head>Company</Table.Head>
 *     <Table.Head>Status</Table.Head>
 *   </Table.Header>
 *
 *   <Table.Row columns="1fr 2fr 1fr" onClick={...} selected={...}>
 *     <Table.Cell>John Doe</Table.Cell>
 *     <Table.Cell>Acme Corp</Table.Cell>
 *     <Table.Cell>Active</Table.Cell>
 *   </Table.Row>
 * </Table.Root>
 * ```
 */
export const Table = {
  Root: TableRoot,
  Header: TableHeader,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Empty: TableEmpty,
};
