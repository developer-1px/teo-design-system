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
    <Block role="Container" density="Comfortable">
      <Block role="Stack">
        <Text role="Title" prominence="Strong" content="Chat Interface" />
        <Text
          role="Body"
          prominence="Subtle"
          content="Messaging UI using MessageBubble + ScrollArea"
        />
      </Block>

      {/* Chat Container */}
      <Block role="Card" prominence="Standard" density="Comfortable">
        {/* Chat Header */}
        <Block role="Stack" density="Compact">
          <Block role="Stack" density="Compact">
            <Text role="Heading" prominence="Strong" content="Team Chat" />
            <Text role="Caption" prominence="Subtle" content="3 members online" />
          </Block>
        </Block>

        <Block role="Divider" />

        {/* Messages Area */}
        <Block role="ScrollArea" spec={{ height: '400px' }}>
          <Block role="Stack" density="Standard">
            {messages.map((msg) => (
              <Block
                key={msg.id}
                role="MessageBubble"
                prominence={msg.isOwn ? 'Standard' : 'Subtle'}
                intent={msg.isOwn ? 'Brand' : 'Neutral'}
              >
                <Block role="Stack" density="Compact">
                  {/* Sender Info */}
                  <Block role="Stack" density="Compact">
                    <Text role="Body" prominence="Subtle" content={msg.avatar} />
                    <Block role="Stack" density="Compact">
                      <Text role="Username" content={msg.sender} prominence="Strong" />
                      <Text role="Timestamp" content={msg.timestamp} />
                    </Block>
                  </Block>

                  {/* Message Content */}
                  <Text role="Body" prominence="Standard" content={msg.content} />
                </Block>
              </Block>
            ))}
          </Block>
        </Block>

        <Block role="Divider" />

        {/* Input Area */}
        <Block role="Stack" density="Compact">
          <Field role="Textarea" label="" placeholder="Type a message..." density="Compact" />
          <Block role="Stack" density="Compact">
            <Action role="IconButton" icon="📎" title="Attach file" prominence="Subtle" />
            <Action role="IconButton" icon="😊" title="Add emoji" prominence="Subtle" />
            <Action role="Button" label="Send" prominence="Hero" intent="Brand" />
          </Block>
        </Block>
      </Block>
    </Block>
  );
}
