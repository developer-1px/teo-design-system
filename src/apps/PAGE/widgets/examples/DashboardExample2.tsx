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
        <Block role="Stack" density="Compact">
          <Text role="Heading" prominence="Strong" content="📊 Analytics Dashboard" />
          <Block role="Stack" density="Compact">
            <Action role="IconButton" icon="🔔" title="Notifications" prominence="Subtle" />
            <Action role="IconButton" icon="⚙️" title="Settings" prominence="Subtle" />
            <Text role="Body" content="👤" />
          </Block>
        </Block>
      </Section>

      {/* Main Dashboard Content */}
      <Section role="Main">
        <Block role="Container" density="Comfortable">
          <Block role="Stack" density="Comfortable">
            {/* Overview Stats */}
            <Block role="Grid" spec={{ columns: 4 }} density="Standard">
              <Block role="StatCard" prominence="Standard" intent="Brand" density="Comfortable">
                <Block role="Stack" density="Compact">
                  <Text role="Caption" prominence="Subtle" content="Total Users" />
                  <Text role="Title" prominence="Hero" content="12,458" />
                  <Text role="Badge" prominence="Subtle" intent="Positive" content="+12.5%" />
                </Block>
              </Block>

              <Block role="StatCard" prominence="Standard" intent="Positive" density="Comfortable">
                <Block role="Stack" density="Compact">
                  <Text role="Caption" prominence="Subtle" content="Revenue" />
                  <Text role="Title" prominence="Hero" content="$48.2K" />
                  <Text role="Badge" prominence="Subtle" intent="Positive" content="+8.3%" />
                </Block>
              </Block>

              <Block role="StatCard" prominence="Standard" intent="Info" density="Comfortable">
                <Block role="Stack" density="Compact">
                  <Text role="Caption" prominence="Subtle" content="Active Sessions" />
                  <Text role="Title" prominence="Hero" content="3,842" />
                  <Text role="Badge" prominence="Subtle" intent="Positive" content="+5.2%" />
                </Block>
              </Block>

              <Block role="StatCard" prominence="Standard" intent="Caution" density="Comfortable">
                <Block role="Stack" density="Compact">
                  <Text role="Caption" prominence="Subtle" content="Bounce Rate" />
                  <Text role="Title" prominence="Hero" content="32.1%" />
                  <Text role="Badge" prominence="Subtle" intent="Caution" content="-2.1%" />
                </Block>
              </Block>
            </Block>

            {/* Charts Grid */}
            <Block role="Grid" spec={{ columns: 2 }} density="Standard">
              {/* Traffic Chart */}
              <Block role="Card" prominence="Standard" density="Comfortable">
                <Block role="Stack" density="Standard">
                  <Block role="Stack" density="Compact">
                    <Text role="Heading" prominence="Strong" content="Traffic Overview" />
                    <Text role="Caption" prominence="Subtle" content="Last 7 days" />
                  </Block>

                  <Block role="Center">
                    <Text role="Body" prominence="Subtle" content="📈 Chart Placeholder" />
                  </Block>
                </Block>
              </Block>

              {/* Revenue Chart */}
              <Block role="Card" prominence="Standard" density="Comfortable">
                <Block role="Stack" density="Standard">
                  <Block role="Stack" density="Compact">
                    <Text role="Heading" prominence="Strong" content="Revenue Breakdown" />
                    <Text role="Caption" prominence="Subtle" content="This month" />
                  </Block>

                  <Block role="Center">
                    <Text role="Body" prominence="Subtle" content="🥧 Chart Placeholder" />
                  </Block>
                </Block>
              </Block>
            </Block>

            {/* Recent Activity */}
            <Block role="Card" prominence="Standard" density="Comfortable">
              <Block role="Stack" density="Standard">
                <Text role="Heading" prominence="Strong" content="Recent Activity" />

                <Block role="List" density="Compact">
                  <Action role="ListItem">
                    <Block role="Stack" density="Compact">
                      <Text role="Body" content="New user registered: alice@example.com" />
                      <Text role="Timestamp" content="2 minutes ago" />
                    </Block>
                  </Action>
                  <Action role="ListItem">
                    <Block role="Stack" density="Compact">
                      <Text role="Body" content="Payment received: $299.00" />
                      <Text role="Timestamp" content="15 minutes ago" />
                    </Block>
                  </Action>
                  <Action role="ListItem">
                    <Block role="Stack" density="Compact">
                      <Text role="Body" content="New subscription: Pro Plan" />
                      <Text role="Timestamp" content="1 hour ago" />
                    </Block>
                  </Action>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      </Section>
    </Page>
  );
}
