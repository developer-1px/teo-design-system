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
    <Block role="Container" density="Comfortable">
      <Block role="Stack">
        <Text role="Title" prominence="Strong" content="Notification Center" />
        <Text
          role="Body"
          prominence="Subtle"
          content="System notifications using List + Alert patterns"
        />
      </Block>

      {/* Notification Panel */}
      <Block role="Card" prominence="Standard" density="Comfortable">
        {/* Header */}
        <Block role="Stack" density="Compact">
          <Block role="Stack" density="Compact">
            <Text role="Heading" prominence="Strong" content="Notifications" />
            <Text role="Badge" prominence="Subtle" intent="Brand" content="2 unread" />
          </Block>
          <Action role="Button" prominence="Subtle" label="Mark all as read" />
        </Block>

        <Block role="Divider" />

        {/* Notification List */}
        <Block role="List" density="Compact">
          {notifications.map((notif) => (
            <Action
              key={notif.id}
              role="ListItem"
              prominence={notif.unread ? 'Standard' : 'Subtle'}
            >
              <Block role="Stack" density="Compact">
                {/* Notification Header */}
                <Block role="Stack" density="Compact">
                  <Text role="Body" content={notif.icon} />
                  <Block role="Stack" density="Compact">
                    <Block role="Stack" density="Compact">
                      <Text role="Heading" prominence="Strong" content={notif.title} />
                      {notif.unread && (
                        <Text role="Badge" prominence="Strong" intent="Brand" content="New" />
                      )}
                    </Block>
                    <Text role="Timestamp" content={notif.timestamp} />
                  </Block>
                </Block>

                {/* Notification Message */}
                <Block role="Alert" prominence="Subtle" intent={getIntent(notif.type) as any}>
                  <Text role="Body" prominence="Standard" content={notif.message} />
                </Block>

                {/* Actions */}
                <Block role="Stack" density="Compact">
                  <Action role="Button" prominence="Subtle" label="Dismiss" />
                  <Action role="Button" prominence="Subtle" label="View Details" />
                </Block>
              </Block>
            </Action>
          ))}
        </Block>

        <Block role="Divider" />

        {/* Footer */}
        <Block role="Stack" density="Compact">
          <Action role="Link" label="View all notifications" prominence="Subtle" />
        </Block>
      </Block>
    </Block>
  );
}
