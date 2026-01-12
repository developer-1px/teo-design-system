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
    <Block role="Container" density="Comfortable">
      <Block role="Stack">
        <Text role="Title" prominence="Strong" content="Comment Thread" />
        <Text
          role="Body"
          prominence="Subtle"
          content="Nested discussion using CommentThread + Quote blocks"
        />
      </Block>

      {/* Main Thread */}
      <Block role="CommentThread" prominence="Standard" density="Comfortable">
        {/* Parent Comment */}
        <Block role="Stack" density="Standard">
          <Block role="Stack" density="Compact">
            <Text role="Body" content="👤" />
            <Block role="Stack" density="Compact">
              <Text role="Username" content="Alex Kim" prominence="Strong" />
              <Text role="Timestamp" content="5 hours ago" />
            </Block>
          </Block>

          <Text
            role="Body"
            prominence="Standard"
            content="I think the new IDDL system is a game changer. No more className hell!"
          />

          <Block role="Stack" density="Compact">
            <Action role="Button" prominence="Subtle" label="Reply" />
            <Action role="Button" prominence="Subtle" label="Like" />
            <Text role="Caption" prominence="Subtle" content="12 likes" />
          </Block>
        </Block>

        {/* Nested Reply 1 */}
        <Block role="CommentThread" prominence="Subtle" density="Comfortable">
          <Block role="Stack" density="Standard">
            <Block role="Stack" density="Compact">
              <Text role="Body" content="👩‍💻" />
              <Block role="Stack" density="Compact">
                <Text role="Username" content="Sarah Chen" prominence="Strong" />
                <Text role="Timestamp" content="3 hours ago" />
              </Block>
            </Block>

            <Block role="Quote" prominence="Subtle" density="Standard">
              <Text role="Blockquote" content="No more className hell!" prominence="Subtle" />
            </Block>

            <Text
              role="Body"
              prominence="Standard"
              content="Totally agree! The declarative approach is so much cleaner."
            />

            <Block role="Stack" density="Compact">
              <Action role="Button" prominence="Subtle" label="Reply" />
              <Action role="Button" prominence="Subtle" label="Like" />
              <Text role="Caption" prominence="Subtle" content="8 likes" />
            </Block>
          </Block>

          {/* Nested Reply 2 */}
          <Block role="CommentThread" prominence="Subtle" density="Standard">
            <Block role="Stack" density="Standard">
              <Block role="Stack" density="Compact">
                <Text role="Body" content="🧑" />
                <Block role="Stack" density="Compact">
                  <Text role="Username" content="Mike Johnson" prominence="Strong" />
                  <Text role="Timestamp" content="1 hour ago" />
                </Block>
              </Block>

              <Text
                role="Body"
                prominence="Standard"
                content="Plus the token engine handles all the responsive scaling automatically!"
              />

              <Block role="Stack" density="Compact">
                <Action role="Button" prominence="Subtle" label="Reply" />
                <Action role="Button" prominence="Subtle" label="Like" />
                <Text role="Caption" prominence="Subtle" content="5 likes" />
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>

      {/* Add Comment Form */}
      <Block role="Card" prominence="Subtle" density="Standard">
        <Block role="Stack" density="Standard">
          <Text role="Label" prominence="Strong" content="Add a comment" />
          <Block role="Stack" density="Compact">
            <Text role="Body" content="Type your thoughts..." prominence="Subtle" />
            <Action role="Button" prominence="Hero" intent="Brand" label="Post Comment" />
          </Block>
        </Block>
      </Block>
    </Block>
  );
}
