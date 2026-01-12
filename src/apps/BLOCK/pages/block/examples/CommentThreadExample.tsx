import { Frame } from '@/components/dsl/shared/Frame';
/**
 * CommentThreadExample
 *
 * Nested comment discussion using CommentThread role
 * Uses ONLY IDDL components - NO className for design
 */

import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';

export function CommentThreadExample() {
  return (
    <Frame.Column gap={6}>
      <Frame.Stack>
        <Text role="Title" prominence="Strong" content="Comment Thread" />
        <Text
          role="Body"
          prominence="Subtle"
          content="Nested discussion using CommentThread + Quote blocks"
        />
      </Frame.Stack>

      {/* Main Thread */}
      <Block role="Card" prominence="Standard" density="Comfortable">
        {/* Parent Comment */}
        <Frame.Stack gap={4}>
          <Frame.Stack gap={2} align="center">
            <Text role="Body" content="👤" />
            <Frame.Stack gap={1}>
              <Text role="Label" content="Alex Kim" prominence="Strong" />
              <Text role="Caption" content="5 hours ago" />
            </Frame.Stack>
          </Frame.Stack>

          <Text
            role="Body"
            prominence="Standard"
            content="I think the new IDDL system is a game changer. No more className hell!"
          />

          <Frame.Stack gap={2}>
            <Action role="Button" prominence="Subtle" label="Reply" />
            <Action role="Button" prominence="Subtle" label="Like" />
            <Text role="Caption" prominence="Subtle" content="12 likes" />
          </Frame.Stack>
        </Frame.Stack>

        {/* Nested Reply 1 */}
        <Block role="Card" prominence="Subtle" density="Comfortable">
          <Frame.Stack gap={4}>
            <Frame.Stack gap={2} align="center">
              <Text role="Body" content="👩‍💻" />
              <Frame.Stack gap={1}>
                <Text role="Label" content="Sarah Chen" prominence="Strong" />
                <Text role="Caption" content="3 hours ago" />
              </Frame.Stack>
            </Frame.Stack>

            <Block role="Card" prominence="Subtle" density="Standard">
              <Text role="Body" content="No more className hell!" prominence="Subtle" />
            </Block>

            <Text
              role="Body"
              prominence="Standard"
              content="Totally agree! The declarative approach is so much cleaner."
            />

            <Frame.Stack gap={2}>
              <Action role="Button" prominence="Subtle" label="Reply" />
              <Action role="Button" prominence="Subtle" label="Like" />
              <Text role="Caption" prominence="Subtle" content="8 likes" />
            </Frame.Stack>
          </Frame.Stack>

          {/* Nested Reply 2 */}
          <Block role="Card" prominence="Subtle" density="Standard">
            <Frame.Stack gap={4}>
              <Frame.Stack gap={2} align="center">
                <Text role="Body" content="🧑" />
                <Frame.Stack gap={1}>
                  <Text role="Label" content="Mike Johnson" prominence="Strong" />
                  <Text role="Caption" content="1 hour ago" />
                </Frame.Stack>
              </Frame.Stack>

              <Text
                role="Body"
                prominence="Standard"
                content="Plus the token engine handles all the responsive scaling automatically!"
              />

              <Frame.Stack gap={2}>
                <Action role="Button" prominence="Subtle" label="Reply" />
                <Action role="Button" prominence="Subtle" label="Like" />
                <Text role="Caption" prominence="Subtle" content="5 likes" />
              </Frame.Stack>
            </Frame.Stack>
          </Block>
        </Block>
      </Block>

      {/* Add Comment Form */}
      <Block role="Card" prominence="Subtle" density="Standard">
        <Frame.Stack gap={4}>
          <Text role="Label" prominence="Strong" content="Add a comment" />
          <Frame.Stack gap={2}>
            <Text role="Body" content="Type your thoughts..." prominence="Subtle" />
            <Action role="Button" prominence="Hero" intent="Brand" label="Post Comment" />
          </Frame.Stack>
        </Frame.Stack>
      </Block>
    </Frame.Column>
  );
}
