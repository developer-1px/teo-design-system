import { Frame } from '@/components/dsl/shared/Frame';
/**
 * SimpleDataTableExample
 *
 * Real-world data table with pagination
 * Uses ONLY IDDL components - NO className for design
 */

import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';

export function SimpleDataTableExample() {
  const users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
  ];

  return (
    <Frame.Column density="Comfortable">
      <Frame.Stack>
        <Text role="Title" prominence="Strong" content="Data Table" />
        <Text
          role="Body"
          prominence="Subtle"
          content="User management table using DataTable + Pagination"
        />
      </Frame.Stack>

      <Block role="Card" prominence="Standard" density="Standard">
        {/* Table Header */}
        <Frame.Stack density="Compact">
          <Text role="Heading" prominence="Strong" content="Users" />
          <Action role="Button" prominence="Hero" intent="Brand" label="Add User" />
        </Frame.Stack>

        <Block role="Divider" />

        {/* Table */}
        <Block role="DataTable" density="Compact">
          {/* Header Row */}
          <Frame.Stack density="Compact">
            {['Name', 'Email', 'Role', 'Status', 'Actions'].map((header) => (
              <Text key={header} role="Label" prominence="Strong" content={header} />
            ))}
          </Frame.Stack>

          {/* Data Rows */}
          {users.map((user) => (
            <Frame.Stack key={user.id} density="Compact">
              <Text role="Body" prominence="Standard" content={user.name} />
              <Text role="Body" prominence="Subtle" content={user.email} />
              <Text role="Badge" prominence="Subtle" content={user.role} />
              <Text
                role="Badge"
                prominence="Standard"
                intent={user.status === 'Active' ? 'Positive' : 'Neutral'}
                content={user.status}
              />
              <Frame.Stack density="Compact">
                <Action role="Button" prominence="Subtle" label="Edit" />
                <Action role="Button" prominence="Subtle" intent="Critical" label="Delete" />
              </Frame.Stack>
            </Frame.Stack>
          ))}
        </Block>

        <Block role="Divider" />

        {/* Pagination */}
        <Block role="Pagination" density="Compact">
          <Action role="PageButton" prominence="Subtle" label="Previous" disabled />
          <Action role="PageButton" prominence="Standard" intent="Brand" label="1" selected />
          <Action role="PageButton" prominence="Subtle" label="2" />
          <Action role="PageButton" prominence="Subtle" label="Next" />
        </Block>
      </Block>
    </Frame.Column>
  );
}
