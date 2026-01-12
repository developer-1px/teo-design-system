import React, { useState } from 'react';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';

export function ActionShowcasePage() {
  const [activeCategoryId, setActiveCategoryId] = useState('matrix');
  const intents = ['Neutral', 'Brand', 'Positive', 'Caution', 'Critical', 'Info'] as const;
  const categories = [
    { id: 'matrix', label: 'Button Matrix' },
    { id: 'density', label: 'Density & Spacing' },
    { id: 'combinations', label: 'UI Combinations' },
    { id: 'states', label: 'Button States' },
    { id: 'icons', label: 'Icon Buttons' },
    { id: 'components', label: 'Specialized Actions' },
    { id: 'links', label: 'Links' },
  ];

  const handleCategoryChange = (id: string) => {
    setActiveCategoryId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <ShowcasePage
      title="Actions"
      subtitle="Interactive Elements v6.0"
      description="Comprehensive set of interactive elements driven by the IDDL Token Engine. This showcase demonstrates Prominence, Intent, and Density axes in realistic UI contexts."
      categories={categories}
      activeCategoryId={activeCategoryId}
      onCategoryChange={handleCategoryChange}
    >
      {/* 1. Button Matrix */}
      <Block role="Container" id="matrix">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="1. Button Matrix" />
          <Text
            role="Body"
            prominence="Subtle"
            content="The core combinations of Prominence and Intent axes."
          />
        </Block>

        <Block role="Card" density="Standard">
          {/* Header Row */}
          <Block role="Grid" spec={{ columns: 7 }}>
            <Text role="Label" content="Prominence" />
            {intents.map((intent) => (
              <Text key={intent} role="Label" content={intent} />
            ))}
          </Block>

          {/* Rows */}
          {['Hero', 'Strong', 'Standard', 'Subtle'].map((prominence: any) => (
            <Block key={prominence} role="Grid" spec={{ columns: 7 }}>
              <Text role="Label" content={prominence} />
              {intents.map((intent) => (
                <Action
                  key={intent}
                  role="Button"
                  label="Action"
                  prominence={prominence}
                  intent={intent}
                  onClick={() => {}}
                />
              ))}
            </Block>
          ))}
        </Block>
      </Block>

      <Block role="Divider" />

      {/* 2. Density Test */}
      <Block role="Container" id="density">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="2. Density & Spacing" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Adaptive layouts based on the Density axis (Compact, Standard, Comfortable)."
          />
        </Block>

        <Block role="Grid" spec={{ columns: 3 }}>
          {(['Compact', 'Standard', 'Comfortable'] as any[]).map((d) => (
            <Block key={d} role="Card" density={d} prominence="Subtle">
              <Block role="Stack">
                <Text role="Heading" content={d} prominence="Strong" />
                <Text role="Caption" content={`${d} density scale`} prominence="Subtle" />
              </Block>

              <Block role="Stack">
                <Action role="Button" label={`${d} Action`} prominence="Hero" intent="Brand" />
                <Action role="Button" label="Secondary" prominence="Strong" />
              </Block>

              <Block role="Toolbar">
                <Action role="IconButton" icon="Plus" prominence="Standard" label="Add" />
                <Action role="IconButton" icon="Settings" prominence="Standard" label="Config" />
                <Action role="IconButton" icon="Trash" prominence="Subtle" label="Delete" />
              </Block>
            </Block>
          ))}
        </Block>
      </Block>

      <Block role="Divider" />

      {/* 3. Real-world Combinations */}
      <Block role="Container" id="combinations">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="3. UI Combinations" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Realistic implementation of interactive patterns using Action & Block."
          />
        </Block>

        <Block role="Grid" spec={{ columns: 2 }}>
          {/* Example A: File Header / Toolbar */}
          <Block role="Card">
            <Block role="Toolbar">
              <Block role="Toolbar">
                <Action role="IconButton" icon="ChevronLeft" prominence="Subtle" label="Back" />
                <Text role="Label" content="src / components / Action.tsx" />
              </Block>
              <Block role="Toolbar">
                <Action role="Button" label="Share" icon="Share2" prominence="Standard" />
                <Action role="IconButton" icon="MoreVertical" prominence="Standard" label="More" />
              </Block>
            </Block>
            <Block role="Container">
              <Block role="Stack">
                <Text role="Title" content="Interactive Design Language" />
                <Block role="Toolbar">
                  <Action role="Chip" label="v6.0-stable" intent="Positive" selected />
                  <Action role="Chip" label="TypeScript" icon="Code" />
                  <Action role="Chip" label="React" icon="Atom" />
                </Block>
              </Block>
            </Block>
          </Block>

          {/* Example B: Comment / Activity UI */}
          <Block role="Card">
            <Block role="Toolbar">
              <Block>JD</Block>
              <Block role="Stack">
                <Block role="Toolbar">
                  <Text role="Label" content="Jane Doe" prominence="Strong" />
                  <Text role="Caption" content="2 hours ago" prominence="Subtle" />
                </Block>
                <Text
                  role="Body"
                  content="I've updated the button tokens to support the new shadow-xl variant. Please review the Hero prominence."
                />
              </Block>
            </Block>
            <Block role="Toolbar">
              <Action role="Button" label="Reply" prominence="Subtle" icon="MessageSquare" />
              <Action role="Button" label="Like" prominence="Subtle" icon="Heart" />
              <Action role="IconButton" icon="Smile" prominence="Subtle" label="Emoji" />
            </Block>
            <Block>
              <Action
                role="Button"
                label="Resolve Conversation"
                prominence="Strong"
                intent="Positive"
              />
            </Block>
          </Block>
        </Block>
      </Block>

      <Block role="Divider" />

      {/* 4. Button States */}
      <Block role="Container" id="states">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="4. Button States" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Dynamic states managed by the engine (Loading, Disabled, Selected)."
          />
        </Block>

        <Block role="Grid" spec={{ columns: 4 }}>
          <Block role="Card">
            <Text role="Label" content="Loading" prominence="Subtle" />
            <Action role="Button" label="Saving Changes" loading prominence="Hero" intent="Brand" />
          </Block>
          <Block role="Card">
            <Text role="Label" content="Disabled" prominence="Subtle" />
            <Action role="Button" label="Submit" disabled prominence="Hero" intent="Critical" />
          </Block>
          <Block role="Card">
            <Text role="Label" content="Selected" prominence="Subtle" />
            <Action
              role="Button"
              label="Active State"
              selected
              prominence="Strong"
              intent="Positive"
            />
          </Block>
          <Block role="Card">
            <Text role="Label" content="Default" prominence="Subtle" />
            <Action role="Button" label="Idle Action" prominence="Standard" />
          </Block>
        </Block>
      </Block>

      <Block role="Divider" />

      {/* 5. Icon Buttons */}
      <Block role="Container" id="icons">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="5. Icon Buttons" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Role-specific glyph actions with precise geometry."
          />
        </Block>

        <Block role="Card">
          <Block role="Toolbar">
            <Text role="Label" content="Text + Icon" />
            <Action role="Button" label="Configure Systems" icon="Settings" prominence="Standard" />
            <Action
              role="Button"
              label="Delete Resource"
              icon="Trash"
              prominence="Hero"
              intent="Critical"
            />
            <Action
              role="Button"
              label="Commit Changes"
              icon="Save"
              prominence="Strong"
              intent="Brand"
            />
          </Block>
          <Block role="Divider" />

          <Block role="Toolbar">
            <Text role="Label" content="Icon Only" />
            <Action role="IconButton" icon="Settings" prominence="Standard" label="Settings" />
            <Action
              role="IconButton"
              icon="Trash"
              prominence="Hero"
              intent="Critical"
              label="Delete"
            />
            <Action role="IconButton" icon="Plus" prominence="Strong" intent="Brand" label="Add" />
            <Action role="IconButton" icon="MoreHorizontal" prominence="Subtle" label="More" />
            <Action
              role="IconButton"
              icon="Search"
              prominence="Standard"
              intent="Info"
              label="Search"
            />
          </Block>
        </Block>
      </Block>

      <Block role="Divider" />

      {/* 6. Specialized Actions */}
      <Block role="Container" id="components">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="6. Specialized Actions" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Semantic components for complex contextual interactions."
          />
        </Block>

        <Block role="Grid" spec={{ columns: 2 }}>
          <Block role="Stack">
            <Block role="Card">
              <Text role="Heading" content="Tabs & Segments" prominence="Strong" />
              <Block role="Toolbar">
                <Action role="Tab" label="Overview" selected />
                <Action role="Tab" label="Settings" />
                <Action role="Tab" label="Analytics" />
              </Block>
            </Block>

            <Block role="Card">
              <Text role="Heading" content="Interactive Chips" prominence="Strong" />
              <Block role="Toolbar">
                <Action role="Chip" label="JavaScript" icon="Code" selected intent="Brand" />
                <Action role="Chip" label="React" icon="Atom" />
                <Action role="Chip" label="Performance" icon="Zap" intent="Positive" />
                <Action role="Chip" label="Warning" icon="AlertTriangle" intent="Caution" />
              </Block>
            </Block>
          </Block>

          <Block role="Stack">
            <Block role="Card">
              <Block>
                <Text role="Heading" content="Menu Items" prominence="Strong" />
              </Block>
              <Block role="Stack">
                <Action role="MenuItem" label="Profile Settings" icon="User" />
                <Action role="MenuItem" label="Share Workspace" icon="Share2" />
                <Action role="MenuItem" label="Logout" icon="LogOut" intent="Critical" />
              </Block>
            </Block>

            <Block role="Card">
              <Block>
                <Text role="Heading" content="List Items" prominence="Strong" />
              </Block>
              <Block role="Stack">
                <Action role="ListItem" label="General Documentation" icon="FileText" selected />
                <Action role="ListItem" label="Team Collaboration" icon="Users" />
                <Action role="ListItem" label="Danger Zone" icon="Shield" intent="Critical" />
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>

      <Block role="Divider" />

      {/* 7. Links */}
      <Block role="Container" id="links">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="7. Navigation Links" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Semantic hyperlinks with standard typography."
          />
        </Block>

        <Block role="Card">
          <Action role="Link" label="Documentation" href="#" />
          <Action role="Link" label="View Repository" icon="Github" href="#" intent="Brand" />
          <Action role="Link" label="System Status" icon="Activity" href="#" intent="Positive" />
          <Action role="Link" label="Admin Portal" icon="Shield" href="#" prominence="Subtle" />
        </Block>
      </Block>
    </ShowcasePage>
  );
}
