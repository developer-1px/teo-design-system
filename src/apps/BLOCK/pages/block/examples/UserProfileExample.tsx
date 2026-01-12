/**
 * UserProfileExample
 *
 * Real-world user profile layout
 * Uses ONLY IDDL components - NO className for design
 */

import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';

export function UserProfileExample() {
  const user = {
    name: 'Sarah Chen',
    username: '@sarahchen',
    avatar: '👩‍💻',
    bio: 'Senior Software Engineer @ TechCorp. Passionate about design systems and developer tools.',
    location: 'San Francisco, CA',
    website: 'sarahchen.dev',
    joinedDate: 'Joined March 2022',
    stats: {
      posts: 342,
      followers: 1248,
      following: 891,
    },
    badges: ['Verified', 'Pro Member', 'Top Contributor'],
  };

  return (
    <Block role="Container" density="Comfortable">
      <Block role="Stack">
        <Text role="Title" prominence="Strong" content="User Profile" />
        <Text
          role="Body"
          prominence="Subtle"
          content="Social media profile layout using Card + StatCard + Tabs"
        />
      </Block>

      {/* Profile Card */}
      <Block role="Card" prominence="Standard" density="Comfortable">
        {/* Cover Header */}
        <Block role="Stack" density="Standard">
          {/* Avatar + Name */}
          <Block role="Stack" density="Standard">
            <Block role="Center">
              <Text role="Title" prominence="Hero" content={user.avatar} />
            </Block>

            <Block role="Stack" density="Compact">
              <Text role="Title" prominence="Strong" content={user.name} />
              <Text role="Username" content={user.username} prominence="Subtle" />

              {/* Badges */}
              <Block role="Stack" density="Compact">
                {user.badges.map((badge) => (
                  <Text
                    key={badge}
                    role="Badge"
                    prominence="Subtle"
                    intent="Info"
                    content={badge}
                  />
                ))}
              </Block>
            </Block>
          </Block>

          {/* Bio */}
          <Text role="Body" prominence="Standard" content={user.bio} />

          {/* Metadata */}
          <Block role="Stack" density="Compact">
            <Text role="Caption" prominence="Subtle" content={`📍 ${user.location}`} />
            <Text role="Caption" prominence="Subtle" content={`🔗 ${user.website}`} />
            <Text role="Timestamp" content={user.joinedDate} />
          </Block>

          {/* Stats Cards */}
          <Block role="Grid" spec={{ columns: 3 }} density="Compact">
            <Block role="StatCard" prominence="Subtle" density="Standard">
              <Block role="Stack" density="Compact">
                <Text role="Title" prominence="Strong" content={user.stats.posts.toString()} />
                <Text role="Caption" prominence="Subtle" content="Posts" />
              </Block>
            </Block>

            <Block role="StatCard" prominence="Subtle" density="Standard">
              <Block role="Stack" density="Compact">
                <Text role="Title" prominence="Strong" content={user.stats.followers.toString()} />
                <Text role="Caption" prominence="Subtle" content="Followers" />
              </Block>
            </Block>

            <Block role="StatCard" prominence="Subtle" density="Standard">
              <Block role="Stack" density="Compact">
                <Text role="Title" prominence="Strong" content={user.stats.following.toString()} />
                <Text role="Caption" prominence="Subtle" content="Following" />
              </Block>
            </Block>
          </Block>

          {/* Actions */}
          <Block role="Stack" density="Compact">
            <Action role="Button" prominence="Hero" intent="Brand" label="Follow" />
            <Action role="Button" prominence="Standard" label="Message" />
            <Action role="IconButton" title="More Options" icon="⋯" />
          </Block>
        </Block>

        {/* Content Tabs */}
        <Block role="Divider" />
        <Block role="Tabs">
          <Action role="Tab" label="Posts" selected prominence="Standard" />
          <Action role="Tab" label="Media" prominence="Subtle" />
          <Action role="Tab" label="Likes" prominence="Subtle" />
        </Block>
      </Block>
    </Block>
  );
}
