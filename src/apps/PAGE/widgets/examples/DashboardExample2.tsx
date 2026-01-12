import { Frame } from '@/components/dsl/shared/Frame';
/**
 * DashboardExample2
 *
 * Analytics dashboard with role="Application" layout="Workbench"
 * Uses ONLY IDDL - NO className
 */

import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Page } from '@/components/dsl/Page/Page';
import { Section } from '@/components/dsl/Section/Section';

export function DashboardExample2() {
  return (
    <Page role="Application" layout="Workbench" title="Analytics Dashboard">
      {/* Top Header */}
      <Section role="Header">
        <Frame.Stack density="Compact">
          <Text role="Heading" prominence="Strong" content="📊 Analytics Dashboard" />
          <Frame.Stack density="Compact">
            <Action role="IconButton" icon="🔔" title="Notifications" prominence="Subtle" />
            <Action role="IconButton" icon="⚙️" title="Settings" prominence="Subtle" />
            <Text role="Body" content="👤" />
          </Frame.Stack>
        </Frame.Stack>
      </Section>

      {/* Main Dashboard Content */}
      <Section role="Main">
        <Frame.Column density="Comfortable">
          <Frame.Stack density="Comfortable">
            {/* Overview Stats */}
            <Frame.Grid columns={4} density="Standard">
              <Block role="Card" prominence="Standard" intent="Brand" density="Comfortable">
                <Frame.Stack density="Compact">
                  <Text role="Caption" prominence="Subtle" content="Total Users" />
                  <Text role="Title" prominence="Hero" content="12,458" />
                  <Text role="Badge" prominence="Subtle" intent="Positive" content="+12.5%" />
                </Frame.Stack>
              </Block>

              <Block role="Card" prominence="Standard" intent="Positive" density="Comfortable">
                <Frame.Stack density="Compact">
                  <Text role="Caption" prominence="Subtle" content="Revenue" />
                  <Text role="Title" prominence="Hero" content="$48.2K" />
                  <Text role="Badge" prominence="Subtle" intent="Positive" content="+8.3%" />
                </Frame.Stack>
              </Block>

              <Block role="Card" prominence="Standard" intent="Info" density="Comfortable">
                <Frame.Stack density="Compact">
                  <Text role="Caption" prominence="Subtle" content="Active Sessions" />
                  <Text role="Title" prominence="Hero" content="3,842" />
                  <Text role="Badge" prominence="Subtle" intent="Positive" content="+5.2%" />
                </Frame.Stack>
              </Block>

              <Block role="Card" prominence="Standard" intent="Caution" density="Comfortable">
                <Frame.Stack density="Compact">
                  <Text role="Caption" prominence="Subtle" content="Bounce Rate" />
                  <Text role="Title" prominence="Hero" content="32.1%" />
                  <Text role="Badge" prominence="Subtle" intent="Caution" content="-2.1%" />
                </Frame.Stack>
              </Block>
            </Frame.Grid>

            {/* Charts Grid */}
            <Frame.Grid columns={2} density="Standard">
              {/* Traffic Chart */}
              <Block role="Card" prominence="Standard" density="Comfortable">
                <Frame.Stack density="Standard">
                  <Frame.Stack density="Compact">
                    <Text role="Heading" prominence="Strong" content="Traffic Overview" />
                    <Text role="Caption" prominence="Subtle" content="Last 7 days" />
                  </Frame.Stack>

                  <Frame.Center>
                    <Text role="Body" prominence="Subtle" content="📈 Chart Placeholder" />
                  </Frame.Center>
                </Frame.Stack>
              </Block>

              {/* Revenue Chart */}
              <Block role="Card" prominence="Standard" density="Comfortable">
                <Frame.Stack density="Standard">
                  <Frame.Stack density="Compact">
                    <Text role="Heading" prominence="Strong" content="Revenue Breakdown" />
                    <Text role="Caption" prominence="Subtle" content="This month" />
                  </Frame.Stack>

                  <Frame.Center>
                    <Text role="Body" prominence="Subtle" content="🥧 Chart Placeholder" />
                  </Frame.Center>
                </Frame.Stack>
              </Block>
            </Frame.Grid>

            {/* Recent Activity */}
            <Block role="Card" prominence="Standard" density="Comfortable">
              <Frame.Stack density="Standard">
                <Text role="Heading" prominence="Strong" content="Recent Activity" />

                <Block role="List" density="Compact">
                  <Action role="ListItem">
                    <Frame.Stack density="Compact">
                      <Text role="Body" content="New user registered: alice@example.com" />
                      <Text role="Caption" content="2 minutes ago" />
                    </Frame.Stack>
                  </Action>
                  <Action role="ListItem">
                    <Frame.Stack density="Compact">
                      <Text role="Body" content="Payment received: $299.00" />
                      <Text role="Caption" content="15 minutes ago" />
                    </Frame.Stack>
                  </Action>
                  <Action role="ListItem">
                    <Frame.Stack density="Compact">
                      <Text role="Body" content="New subscription: Pro Plan" />
                      <Text role="Caption" content="1 hour ago" />
                    </Frame.Stack>
                  </Action>
                </Block>
              </Frame.Stack>
            </Block>
          </Frame.Stack>
        </Frame.Column>
      </Section>
    </Page>
  );
}
