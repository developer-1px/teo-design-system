/**
 * Frame Component Demo
 * 순수 레이아웃 프리미티브 데모
 */

import { Frame } from '@/components/dsl/shared/Frame';
import { Page } from '@/components/dsl/Page/Page';
import { Section } from '@/components/dsl/Section/Section';
import { Block } from '@/components/dsl/Block/Block';
import { Text } from '@/components/dsl/Element/Text/Text';

export function FrameDemo() {
  return (
    <Page role="Document" title="Frame Component Demo">
      <Section role="Container">
        <Frame.Stack gap={12}>
          {/* Header */}
          <Frame.Column gap={2}>
            <Text role="Title" prominence="Hero" content="Frame Component" />
            <Text
              role="Body"
              content="순수 레이아웃 프리미티브 - direction, gap, justify, align만 사용"
            />
          </Frame.Column>

          {/* Basic Examples */}
          <Block role="Card">
            <Frame.Stack gap={4}>
              <Text role="Title" prominence="Strong" content="1. Basic Layouts" />

              {/* Row */}
              <Frame.Column gap={2}>
                <Text role="Label" content="Frame.Row - 가로 레이아웃" />
                <Frame
                  direction="row"
                  gap={4}
                  className="p-4 border border-border-default rounded"
                >
                  <div className="p-4 bg-accent/20 rounded">Item 1</div>
                  <div className="p-4 bg-accent/20 rounded">Item 2</div>
                  <div className="p-4 bg-accent/20 rounded">Item 3</div>
                </Frame>
              </Frame.Column>

              {/* Column */}
              <Frame.Column gap={2}>
                <Text role="Label" content="Frame.Column - 세로 레이아웃" />
                <Frame
                  direction="column"
                  gap={2}
                  className="p-4 border border-border-default rounded"
                >
                  <div className="p-4 bg-accent/20 rounded">Item 1</div>
                  <div className="p-4 bg-accent/20 rounded">Item 2</div>
                  <div className="p-4 bg-accent/20 rounded">Item 3</div>
                </Frame>
              </Frame.Column>
            </Frame.Stack>
          </Block>

          {/* Justify & Align */}
          <Block role="Card">
            <Frame.Stack gap={4}>
              <Text role="Title" prominence="Strong" content="2. Justify & Align" />

              <Frame.Column gap={2}>
                <Text role="Label" content="justify='between' + align='center'" />
                <Frame
                  direction="row"
                  gap={4}
                  justify="between"
                  align="center"
                  className="p-4 border border-border-default rounded"
                >
                  <div className="p-2 bg-accent/20 rounded">Left</div>
                  <div className="p-4 bg-accent/20 rounded">Center (taller)</div>
                  <div className="p-2 bg-accent/20 rounded">Right</div>
                </Frame>
              </Frame.Column>

              <Frame.Column gap={2}>
                <Text role="Label" content="justify='center' + align='end'" />
                <Frame
                  direction="row"
                  gap={4}
                  justify="center"
                  align="end"
                  className="p-4 border border-border-default rounded h-24"
                >
                  <div className="p-2 bg-accent/20 rounded h-12">Item 1</div>
                  <div className="p-2 bg-accent/20 rounded h-16">Item 2</div>
                  <div className="p-2 bg-accent/20 rounded h-8">Item 3</div>
                </Frame>
              </Frame.Column>
            </Frame.Stack>
          </Block>

          {/* Gap Scale */}
          <Block role="Card">
            <Frame.Stack gap={4}>
              <Text role="Title" prominence="Strong" content="3. Gap Scale (4px units)" />

              <Frame.Column gap={3}>
                <Text role="Label" content="gap={1} (4px)" />
                <Frame
                  direction="row"
                  gap={1}
                  className="p-4 border border-border-default rounded"
                >
                  <div className="p-2 bg-accent/20 rounded">A</div>
                  <div className="p-2 bg-accent/20 rounded">B</div>
                  <div className="p-2 bg-accent/20 rounded">C</div>
                </Frame>
              </Frame.Column>

              <Frame.Column gap={3}>
                <Text role="Label" content="gap={4} (16px)" />
                <Frame
                  direction="row"
                  gap={4}
                  className="p-4 border border-border-default rounded"
                >
                  <div className="p-2 bg-accent/20 rounded">A</div>
                  <div className="p-2 bg-accent/20 rounded">B</div>
                  <div className="p-2 bg-accent/20 rounded">C</div>
                </Frame>
              </Frame.Column>

              <Frame.Column gap={3}>
                <Text role="Label" content="gap={8} (32px)" />
                <Frame
                  direction="row"
                  gap={8}
                  className="p-4 border border-border-default rounded"
                >
                  <div className="p-2 bg-accent/20 rounded">A</div>
                  <div className="p-2 bg-accent/20 rounded">B</div>
                  <div className="p-2 bg-accent/20 rounded">C</div>
                </Frame>
              </Frame.Column>
            </Frame.Stack>
          </Block>

          {/* Convenience Methods */}
          <Block role="Card">
            <Frame.Stack gap={4}>
              <Text role="Title" prominence="Strong" content="4. Convenience Methods" />

              <Frame.Column gap={2}>
                <Text role="Label" content="Frame.Stack (column + gap=4)" />
                <div className="p-4 border border-border-default rounded">
                  <Frame.Stack>
                    <div className="p-2 bg-accent/20 rounded">Item 1</div>
                    <div className="p-2 bg-accent/20 rounded">Item 2</div>
                    <div className="p-2 bg-accent/20 rounded">Item 3</div>
                  </Frame.Stack>
                </div>
              </Frame.Column>

              <Frame.Column gap={2}>
                <Text role="Label" content="Frame.Inline (row + gap=2)" />
                <div className="p-4 border border-border-default rounded">
                  <Frame.Inline>
                    <div className="p-2 bg-accent/20 rounded">Tag 1</div>
                    <div className="p-2 bg-accent/20 rounded">Tag 2</div>
                    <div className="p-2 bg-accent/20 rounded">Tag 3</div>
                  </Frame.Inline>
                </div>
              </Frame.Column>
            </Frame.Stack>
          </Block>

          {/* Real-world Example */}
          <Block role="Card">
            <Frame.Stack gap={4}>
              <Text role="Title" prominence="Strong" content="5. Real-world Example" />

              <Frame.Column gap={2}>
                <Text role="Label" content="Card with Header & Actions" />
                <div className="border border-border-default rounded overflow-hidden">
                  <Frame.Stack gap={0}>
                    {/* Header */}
                    <Frame.Row
                      justify="between"
                      align="center"
                      className="p-4 bg-surface-raised border-b border-border-default"
                    >
                      <Text role="Title" content="User Profile" />
                      <Frame.Inline>
                        <button className="px-3 py-1 rounded bg-surface hover:bg-surface-hover">
                          Edit
                        </button>
                        <button className="px-3 py-1 rounded bg-accent text-white hover:bg-accent/90">
                          Save
                        </button>
                      </Frame.Inline>
                    </Frame.Row>

                    {/* Content */}
                    <Frame.Stack className="p-4">
                      <Frame.Column gap={1}>
                        <Text role="Label" content="Name" />
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="px-3 py-2 border border-border-default rounded"
                        />
                      </Frame.Column>

                      <Frame.Column gap={1}>
                        <Text role="Label" content="Email" />
                        <input
                          type="email"
                          placeholder="john@example.com"
                          className="px-3 py-2 border border-border-default rounded"
                        />
                      </Frame.Column>

                      <Frame.Inline wrap>
                        <span className="px-2 py-1 bg-accent/20 rounded text-sm">React</span>
                        <span className="px-2 py-1 bg-accent/20 rounded text-sm">
                          TypeScript
                        </span>
                        <span className="px-2 py-1 bg-accent/20 rounded text-sm">Tailwind</span>
                      </Frame.Inline>
                    </Frame.Stack>
                  </Frame.Stack>
                </div>
              </Frame.Column>
            </Frame.Stack>
          </Block>

          {/* Wrap Example */}
          <Block role="Card">
            <Frame.Stack gap={4}>
              <Text role="Title" prominence="Strong" content="6. Wrap" />

              <Frame.Column gap={2}>
                <Text role="Label" content="wrap={true} - 줄바꿈 허용" />
                <Frame
                  direction="row"
                  gap={2}
                  wrap
                  className="p-4 border border-border-default rounded"
                >
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="px-3 py-1 bg-accent/20 rounded whitespace-nowrap">
                      Tag {i + 1}
                    </div>
                  ))}
                </Frame>
              </Frame.Column>
            </Frame.Stack>
          </Block>

          {/* Full Width/Height */}
          <Block role="Card">
            <Frame.Stack gap={4}>
              <Text role="Title" prominence="Strong" content="7. Full Width/Height" />

              <Frame.Column gap={2}>
                <Text role="Label" content="fullWidth + justify='between'" />
                <Frame
                  direction="row"
                  gap={4}
                  width="fill"
                  justify="between"
                  className="p-4 border border-border-default rounded"
                >
                  <div className="p-2 bg-accent/20 rounded">Left</div>
                  <div className="p-2 bg-accent/20 rounded">Right</div>
                </Frame>
              </Frame.Column>
            </Frame.Stack>
          </Block>
        </Frame.Stack>
      </Section>
    </Page>
  );
}
