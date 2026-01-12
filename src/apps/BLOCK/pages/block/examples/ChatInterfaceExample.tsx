import { Frame } from '@/components/dsl/shared/Frame';
/**
 * ChatInterfaceExample
 *
 * Real-world chat interface using MessageBubble role
 * Uses ONLY IDDL components - NO className for design
 */

import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Field } from '@/components/dsl/Element/Field/Field';
import { Text } from '@/components/dsl/Element/Text/Text';

export function ChatInterfaceExample() {
  const messages = [
    {
      id: 1,
      sender: 'Alice',
      avatar: '👩',
      content: 'Hey! Did you see the new design system docs?',
      timestamp: '10:32 AM',
      isOwn: false,
    },
    {
      id: 2,
      sender: 'You',
      avatar: '🧑',
      content: 'Yes! The IDDL approach is really interesting. No more className mess!',
      timestamp: '10:33 AM',
      isOwn: true,
    },
    {
      id: 3,
      sender: 'Alice',
      avatar: '👩',
      content: 'Exactly! Everything is declarative. Just declare role, prominence, and intent.',
      timestamp: '10:34 AM',
      isOwn: false,
    },
    {
      id: 4,
      sender: 'You',
      avatar: '🧑',
      content: 'And the token engine handles all the styling automatically. This is the future!',
      timestamp: '10:35 AM',
      isOwn: true,
    },
  ];

  return (
    <Frame.Column gap={6}>
      <Frame.Stack>
        <Text role="Title" prominence="Strong" content="Chat Interface" />
        <Text
          role="Body"
          prominence="Subtle"
          content="Messaging UI using MessageBubble + ScrollArea"
        />
      </Frame.Stack>

      {/* Chat Container */}
      <Block role="Card" prominence="Standard" density="Comfortable">
        {/* Chat Header */}
        <Frame.Stack gap={1}>
          <Frame.Stack gap={1}>
            <Text role="Heading" prominence="Strong" content="Team Chat" />
            <Text role="Caption" prominence="Subtle" content="3 members online" />
          </Frame.Stack>
        </Frame.Stack>

        <Block role="Divider" />

        {/* Messages Area */}
        <Block role="ScrollArea" spec={{ height: '400px' }}>
          <Frame.Stack gap={4}>
            {messages.map((msg) => (
              <Block
                key={msg.id}
                role="Card"
                prominence={msg.isOwn ? 'Standard' : 'Subtle'}
                intent={msg.isOwn ? 'Brand' : 'Neutral'}
              >
                <Frame.Stack gap={2}>
                  {/* Sender Info */}
                  <Frame.Stack gap={2} align="center">
                    <Text role="Body" content={msg.avatar} />
                    <Frame.Stack gap={1}>
                      <Text role="Label" content={msg.sender} prominence="Strong" />
                      <Text role="Caption" content={msg.timestamp} />
                    </Frame.Stack>
                  </Frame.Stack>

                  {/* Message Content */}
                  <Text role="Body" prominence="Standard" content={msg.content} />
                </Frame.Stack>
              </Block>
            ))}
          </Frame.Stack>
        </Block>

        <Block role="Divider" />

        {/* Input Area */}
        <Frame.Stack gap={2}>
          <Field role="Textarea" label="" placeholder="Type a message..." density="Compact" />
          <Frame.Stack gap={2}>
            <Action role="IconButton" icon="📎" title="Attach file" prominence="Subtle" />
            <Action role="IconButton" icon="😊" title="Add emoji" prominence="Subtle" />
            <Action role="Button" label="Send" prominence="Hero" intent="Brand" />
          </Frame.Stack>
        </Frame.Stack>
      </Block>
    </Frame.Column>
  );
}
