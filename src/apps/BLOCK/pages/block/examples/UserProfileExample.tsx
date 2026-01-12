import { Frame } from '@/components/dsl/shared/Frame';
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
    <Frame.Column gap={6}>
      <Frame.Stack>
        <Text role="Title" prominence="Strong" content="User Profile" />
        <Text
          role="Body"
          prominence="Subtle"
          content="Social media profile layout using Card + StatCard + Tabs"
        />
      </Frame.Stack>

      {/* Profile Card */}
      <Block role="Card" prominence="Standard" density="Comfortable">
        {/* Cover Header */}
        <Frame.Stack gap={4}>
          {/* Avatar + Name */}
          <Frame.Stack gap={4} align="center">
            <Frame.Center>
              <Text role="Title" prominence="Hero" content={user.avatar} />
            </Frame.Center>

            <Frame.Stack gap={1}>
              <Text role="Title" prominence="Strong" content={user.name} />
              <Text role="Label" content={user.username} prominence="Subtle" />

              {/* Badges */}
              <Frame.Stack gap={2}>
                {user.badges.map((badge) => (
                  <Text
                    key={badge}
                    role="Badge"
                    prominence="Subtle"
                    intent="Info"
                    content={badge}
                  />
                ))}
              </Frame.Stack>
            </Frame.Stack>
          </Frame.Stack>

          {/* Bio */}
          <Text role="Body" prominence="Standard" content={user.bio} />

          {/* Metadata */}
          <Frame.Stack gap={2}>
            <Text role="Caption" prominence="Subtle" content={`📍 ${user.location}`} />
            <Text role="Caption" prominence="Subtle" content={`🔗 ${user.website}`} />
            <Text role="Caption" content={user.joinedDate} prominence="Subtle" />
          </Frame.Stack>

          {/* Stats Cards */}
          <Frame.Grid columns={3} gap={4}>
            <Block role="Card" prominence="Subtle" density="Standard">
              <Frame.Stack gap={1} align="center">
                <Text role="Title" prominence="Strong" content={user.stats.posts.toString()} />
                <Text role="Caption" prominence="Subtle" content="Posts" />
              </Frame.Stack>
            </Block>

            <Block role="Card" prominence="Subtle" density="Standard">
              <Frame.Stack gap={1} align="center">
                <Text role="Title" prominence="Strong" content={user.stats.followers.toString()} />
                <Text role="Caption" prominence="Subtle" content="Followers" />
              </Frame.Stack>
            </Block>

            <Block role="Card" prominence="Subtle" density="Standard">
              <Frame.Stack gap={1} align="center">
                <Text role="Title" prominence="Strong" content={user.stats.following.toString()} />
                <Text role="Caption" prominence="Subtle" content="Following" />
              </Frame.Stack>
            </Block>
          </Frame.Grid>

          {/* Actions */}
          <Frame.Stack gap={2}>
            <Action role="Button" prominence="Hero" intent="Brand" label="Follow" />
            <Action role="Button" prominence="Standard" label="Message" />
            <Action role="IconButton" title="More Options" icon="⋯" />
          </Frame.Stack>
        </Frame.Stack>

        {/* Content Tabs */}
        <Block role="Divider" />
        <Block role="Tabs">
          <Action role="Tab" label="Posts" selected prominence="Standard" />
          <Action role="Tab" label="Media" prominence="Subtle" />
          <Action role="Tab" label="Likes" prominence="Subtle" />
        </Block>
      </Block>
    </Frame.Column>
  );
}
