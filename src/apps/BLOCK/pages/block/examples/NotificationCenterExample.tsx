import { Frame } from '@/components/dsl/shared/Frame';
/**
 * NotificationCenterExample
 *
 * Real-world notification center using List + Alert + Timestamp
 * Uses ONLY IDDL components - NO className for design
 */

import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';

export function NotificationCenterExample() {
  const notifications = [
    {
      id: 1,
      type: 'success',
      icon: '✅',
      title: 'Deployment Successful',
      message: 'Your app has been deployed to production',
      timestamp: '2 minutes ago',
      unread: true,
    },
    {
      id: 2,
      type: 'warning',
      icon: '⚠️',
      title: 'High CPU Usage',
      message: 'Server CPU usage is at 85%',
      timestamp: '15 minutes ago',
      unread: true,
    },
    {
      id: 3,
      type: 'info',
      icon: 'ℹ️',
      title: 'New Feature Available',
      message: 'IDDL v4.4 with real-world components is now live',
      timestamp: '1 hour ago',
      unread: false,
    },
    {
      id: 4,
      type: 'critical',
      icon: '🚨',
      title: 'Database Connection Failed',
      message: 'Unable to connect to primary database',
      timestamp: '2 hours ago',
      unread: false,
    },
  ];

  const getIntent = (type: string) => {
    switch (type) {
      case 'success':
        return 'Positive';
      case 'warning':
        return 'Caution';
      case 'critical':
        return 'Critical';
      default:
        return 'Info';
    }
  };

  return (
    <Frame.Column gap={6}>
      <Frame.Stack>
        <Text role="Title" prominence="Strong" content="Notification Center" />
        <Text
          role="Body"
          prominence="Subtle"
          content="System notifications using List + Alert patterns"
        />
      </Frame.Stack>

      {/* Notification Panel */}
      <Block role="Card" prominence="Standard" density="Comfortable">
        {/* Header */}
        <Frame.Stack gap={4}>
          <Frame.Stack gap={2}>
            <Text role="Heading" prominence="Strong" content="Notifications" />
            <Text role="Badge" prominence="Subtle" intent="Brand" content="2 unread" />
          </Frame.Stack>
          <Action role="Button" prominence="Subtle" label="Mark all as read" />
        </Frame.Stack>

        <Block role="Divider" />

        {/* Notification List */}
        <Block role="List" density="Compact">
          {notifications.map((notif) => (
            <Action
              key={notif.id}
              role="ListItem"
              prominence={notif.unread ? 'Standard' : 'Subtle'}
            >
              <Frame.Stack gap={2}>
                {/* Notification Header */}
                <Frame.Stack gap={3} align="center">
                  <Text role="Body" content={notif.icon} />
                  <Frame.Stack gap={1}>
                    <Frame.Stack gap={2} align="center">
                      <Text role="Heading" prominence="Strong" content={notif.title} />
                      {notif.unread && (
                        <Text role="Badge" prominence="Strong" intent="Brand" content="New" />
                      )}
                    </Frame.Stack>
                    <Text role="Caption" content={notif.timestamp} />
                  </Frame.Stack>
                </Frame.Stack>

                {/* Notification Message */}
                <Block role="Alert" prominence="Subtle" intent={getIntent(notif.type) as any}>
                  <Text role="Body" prominence="Standard" content={notif.message} />
                </Block>

                {/* Actions */}
                <Frame.Stack gap={2}>
                  <Action role="Button" prominence="Subtle" label="Dismiss" />
                  <Action role="Button" prominence="Subtle" label="View Details" />
                </Frame.Stack>
              </Frame.Stack>
            </Action>
          ))}
        </Block>

        <Block role="Divider" />

        {/* Footer */}
        <Frame.Stack gap={2}>
          <Action role="Link" label="View all notifications" prominence="Subtle" />
        </Frame.Stack>
      </Block>
    </Frame.Column>
  );
}
