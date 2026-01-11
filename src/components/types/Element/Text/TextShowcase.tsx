/**
 * Text Showcase
 *
 * Registry 기반 Text 컴포넌트 테스트 페이지
 */

import { Text } from './Text';

export function TextShowcase() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <Text role="Title" content="Text Component Showcase" prominence="Hero" />
        <Text
          role="Body"
          content="Registry-based architecture로 확장 가능한 role 시스템"
          prominence="Hero"
        />
      </div>

      {/* Typography Section */}
      <section className="space-y-6">
        <Text role="Heading" content="1. Typography Roles" spec={{ level: 2 }} />

        <div className="space-y-4 p-6 bg-surface-sunken rounded-lg">
          <Text role="Label" content="Title (prominence variants)" prominence="Strong" />
          <div className="space-y-3">
            <Text role="Title" content="Hero Title (h1)" prominence="Hero" />
            <Text role="Title" content="Strong Title (h2)" prominence="Strong" />
            <Text role="Title" content="Standard Title (h3)" prominence="Standard" />
            <Text role="Title" content="Subtle Title (h4)" prominence="Subtle" />
          </div>
        </div>

        <div className="space-y-4 p-6 bg-surface-sunken rounded-lg">
          <Text role="Label" content="Heading (with level)" prominence="Strong" />
          <div className="space-y-3">
            <Text role="Heading" content="Heading Level 1" spec={{ level: 1 }} />
            <Text role="Heading" content="Heading Level 2" spec={{ level: 2 }} />
            <Text role="Heading" content="Heading Level 3" spec={{ level: 3 }} />
          </div>
        </div>

        <div className="space-y-4 p-6 bg-surface-sunken rounded-lg">
          <Text role="Label" content="Body (prominence variants)" prominence="Strong" />
          <div className="space-y-3">
            <Text role="Body" content="Hero body text (lead paragraph)" prominence="Hero" />
            <Text role="Body" content="Strong body text (emphasis)" prominence="Strong" />
            <Text role="Body" content="Standard body text (normal paragraph)" prominence="Standard" />
            <Text role="Body" content="Subtle body text (muted)" prominence="Subtle" />
          </div>
        </div>

        <div className="space-y-4 p-6 bg-surface-sunken rounded-lg">
          <Text role="Label" content="Label & Caption" prominence="Strong" />
          <div className="space-y-3">
            <Text role="Label" content="Form Label" spec={{ for: 'email' }} />
            <Text role="Caption" content="This is a caption or helper text" />
          </div>
        </div>
      </section>

      {/* Inline Semantics */}
      <section className="space-y-6">
        <Text role="Heading" content="2. Inline Semantic Roles" spec={{ level: 2 }} />

        <div className="p-6 bg-surface-sunken rounded-lg space-y-3">
          <Text role="Body">
            This text contains <Text role="Strong" content="important" /> and{' '}
            <Text role="Emphasis" content="emphasized" /> words.
          </Text>

          <Text role="Body">
            Search results for <Text role="Mark" content="React" /> in documentation.
          </Text>

          <Text role="Body">
            Use the <Text role="Code" content="useState" /> hook for state management.
          </Text>

          <Text role="Body">
            Read more in the{' '}
            <Text
              role="Link"
              content="documentation"
              spec={{ href: '/docs', target: '_blank' }}
            />
            .
          </Text>
        </div>
      </section>

      {/* Badge (Complex Renderer) */}
      <section className="space-y-6">
        <Text role="Heading" content="3. Badge (Complex Renderer)" spec={{ level: 2 }} />

        <div className="space-y-4 p-6 bg-surface-sunken rounded-lg">
          <Text role="Label" content="Badge with intent variants" prominence="Strong" />
          <div className="flex flex-wrap gap-2">
            <Text role="Badge" content="Default" />
            <Text role="Badge" content="Brand" intent="Brand" />
            <Text role="Badge" content="Success" intent="Positive" />
            <Text role="Badge" content="Warning" intent="Caution" />
            <Text role="Badge" content="Error" intent="Critical" />
            <Text role="Badge" content="Info" intent="Info" />
          </div>
        </div>

        <div className="space-y-4 p-6 bg-surface-sunken rounded-lg">
          <Text role="Label" content="Badge with pulse animation" prominence="Strong" />
          <div className="flex flex-wrap gap-2">
            <Text role="Badge" content="Live" intent="Positive" spec={{ pulse: true }} />
            <Text role="Badge" content="3" intent="Critical" spec={{ pulse: true }} />
          </div>
        </div>

        <div className="space-y-4 p-6 bg-surface-sunken rounded-lg">
          <Text role="Label" content="Dot indicators" prominence="Strong" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Text role="Badge" intent="Positive" spec={{ dot: true }} />
              <Text role="Caption" content="Online" />
            </div>
            <div className="flex items-center gap-2">
              <Text role="Badge" intent="Caution" spec={{ dot: true }} />
              <Text role="Caption" content="Away" />
            </div>
            <div className="flex items-center gap-2">
              <Text role="Badge" intent="Critical" spec={{ dot: true }} />
              <Text role="Caption" content="Offline" />
            </div>
          </div>
        </div>
      </section>

      {/* Intent Colors */}
      <section className="space-y-6">
        <Text role="Heading" content="4. Intent-based Styling" spec={{ level: 2 }} />

        <div className="p-6 bg-surface-sunken rounded-lg space-y-2">
          <Text role="Body" content="Neutral text (default)" intent="Neutral" />
          <Text role="Body" content="Brand color text" intent="Brand" />
          <Text role="Body" content="Success message" intent="Positive" />
          <Text role="Body" content="Warning message" intent="Caution" />
          <Text role="Body" content="Error message" intent="Critical" />
          <Text role="Body" content="Info message" intent="Info" />
        </div>
      </section>

      {/* Alignment */}
      <section className="space-y-6">
        <Text role="Heading" content="5. Text Alignment" spec={{ level: 2 }} />

        <div className="p-6 bg-surface-sunken rounded-lg space-y-2">
          <Text role="Body" content="Left aligned text" align="left" />
          <Text role="Body" content="Center aligned text" align="center" />
          <Text role="Body" content="Right aligned text" align="right" />
        </div>
      </section>

      {/* Highlight */}
      <section className="space-y-6">
        <Text role="Heading" content="6. Text Highlighting" spec={{ level: 2 }} />

        <div className="p-6 bg-surface-sunken rounded-lg">
          <Text
            role="Body"
            content="The quick brown fox jumps over the lazy dog."
            highlight="fox"
          />
        </div>
      </section>

      {/* Real-world Examples */}
      <section className="space-y-6">
        <Text role="Heading" content="7. Real-world Examples" spec={{ level: 2 }} />

        {/* Article Header */}
        <div className="p-6 bg-surface-sunken rounded-lg space-y-3">
          <Text role="Label" content="Article Header" prominence="Strong" />
          <Text role="Title" content="Getting Started with IDDL" prominence="Hero" />
          <Text
            role="Body"
            content="Learn how to build declarative UIs with intent-driven design language."
            prominence="Hero"
          />
          <Text role="Caption" content="Published on January 11, 2026" />
        </div>

        {/* Form Field */}
        <div className="p-6 bg-surface-sunken rounded-lg space-y-2">
          <Text role="Label" content="Form Field Example" prominence="Strong" />
          <Text role="Label" content="Email Address" spec={{ for: 'email-demo' }} />
          <input
            id="email-demo"
            type="email"
            className="w-full px-3 py-2 border rounded"
            placeholder="you@example.com"
          />
          <Text role="Caption" content="We'll never share your email with anyone else." />
        </div>

        {/* Status Indicators */}
        <div className="p-6 bg-surface-sunken rounded-lg space-y-3">
          <Text role="Label" content="Status Indicators" prominence="Strong" />
          <div className="flex items-center gap-2">
            <Text role="Body" content="Server Status:" />
            <Text role="Badge" content="Online" intent="Positive" spec={{ pulse: true }} />
          </div>
          <div className="flex items-center gap-2">
            <Text role="Body" content="Build Status:" />
            <Text role="Badge" content="Passing" intent="Positive" />
          </div>
          <div className="flex items-center gap-2">
            <Text role="Body" content="Notifications:" />
            <Text role="Badge" content="3" intent="Critical" />
          </div>
        </div>
      </section>

      {/* Time (NEW - Data role) */}
      <section className="space-y-6">
        <Text role="Heading" content="8. Time Formatting (NEW)" spec={{ level: 2 }} />

        <div className="space-y-4 p-6 bg-surface-sunken rounded-lg">
          <Text role="Label" content="Relative time (live updates)" prominence="Strong" />
          <div className="space-y-2">
            <Text
              role="Time"
              spec={{
                value: new Date(Date.now() - 1000 * 60 * 3),
                format: 'relative',
                live: true,
              }}
            />
            <Text
              role="Time"
              spec={{
                value: new Date(Date.now() - 1000 * 60 * 60 * 2),
                format: 'relative',
                live: true,
              }}
            />
            <Text
              role="Time"
              spec={{
                value: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
                format: 'relative',
              }}
            />
          </div>
        </div>

        <div className="space-y-4 p-6 bg-surface-sunken rounded-lg">
          <Text role="Label" content="Absolute time formats" prominence="Strong" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Text role="Caption" content="Date:" className="w-24" />
              <Text role="Time" spec={{ value: new Date(), format: 'date' }} />
            </div>
            <div className="flex items-center gap-2">
              <Text role="Caption" content="Time:" className="w-24" />
              <Text role="Time" spec={{ value: new Date(), format: 'time' }} />
            </div>
            <div className="flex items-center gap-2">
              <Text role="Caption" content="DateTime:" className="w-24" />
              <Text role="Time" spec={{ value: new Date(), format: 'datetime' }} />
            </div>
            <div className="flex items-center gap-2">
              <Text role="Caption" content="Short:" className="w-24" />
              <Text role="Time" spec={{ value: new Date(), format: 'short' }} />
            </div>
            <div className="flex items-center gap-2">
              <Text role="Caption" content="ISO:" className="w-24" />
              <Text role="Time" spec={{ value: new Date(), format: 'iso' }} prominence="Subtle" />
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6 bg-surface-sunken rounded-lg">
          <Text role="Label" content="Real-world usage" prominence="Strong" />
          <div className="space-y-3">
            {/* Comment timestamp */}
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Text role="Body" content="John Doe" prominence="Strong" />
                  <Text
                    role="Time"
                    spec={{
                      value: new Date(Date.now() - 1000 * 60 * 15),
                      format: 'relative',
                      live: true,
                    }}
                    prominence="Subtle"
                  />
                </div>
                <Text role="Body" content="Great work on this feature!" />
              </div>
            </div>

            {/* Published date */}
            <div className="flex items-center gap-2">
              <Text role="Caption" content="Published:" />
              <Text
                role="Time"
                spec={{
                  value: new Date('2026-01-11'),
                  format: 'date',
                }}
              />
            </div>

            {/* Last updated */}
            <div className="flex items-center gap-2">
              <Text role="Caption" content="Last updated:" />
              <Text
                role="Time"
                spec={{
                  value: new Date(Date.now() - 1000 * 60 * 60),
                  format: 'relative',
                  live: true,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: Extended Indicator Roles */}
      <section className="space-y-6">
        <Text role="Heading" content="9. Extended Indicator Roles" spec={{ level: 2 }} />

        <div className="space-y-6 p-6 bg-surface-sunken rounded-lg">
          {/* Alert */}
          <div className="space-y-3">
            <Text role="Label" content="Alert (다양한 변형)" prominence="Strong" />
            <div className="space-y-3">
              <Text
                role="Alert"
                intent="Info"
                spec={{ title: 'Information' }}
                content="This is an info alert with a title"
              />
              <Text
                role="Alert"
                intent="Positive"
                spec={{ title: 'Success' }}
                content="Operation completed successfully"
              />
              <Text
                role="Alert"
                intent="Caution"
                spec={{ title: 'Warning' }}
                content="Please review before proceeding"
              />
              <Text
                role="Alert"
                intent="Critical"
                spec={{ title: 'Error', onClose: () => alert('Closed!') }}
                content="Something went wrong"
              />
            </div>
          </div>

          {/* Avatar */}
          <div className="space-y-3">
            <Text role="Label" content="Avatar (다양한 크기)" prominence="Strong" />
            <div className="flex items-center gap-3">
              <Text role="Avatar" prominence="Subtle" spec={{ fallback: 'John Doe' }} />
              <Text role="Avatar" prominence="Standard" spec={{ fallback: 'Jane Smith' }} />
              <Text role="Avatar" prominence="Strong" spec={{ fallback: 'Bob Wilson' }} />
              <Text role="Avatar" prominence="Hero" spec={{ fallback: 'Alice Brown' }} />
            </div>
          </div>

          {/* Kbd */}
          <div className="space-y-3">
            <Text role="Label" content="Kbd (키보드 단축키)" prominence="Strong" />
            <div className="flex items-center gap-2">
              <Text role="Body" content="Press" prominence="Standard" />
              <Text role="Kbd" content="Ctrl" />
              <Text role="Body" content="+" />
              <Text role="Kbd" content="K" />
              <Text role="Body" content="to open command palette" />
            </div>
          </div>

          {/* Tag */}
          <div className="space-y-3">
            <Text role="Label" content="Tag (제거 가능한 태그)" prominence="Strong" />
            <div className="flex flex-wrap gap-2">
              <Text role="Tag" content="React" spec={{ onRemove: () => alert('Removed React') }} />
              <Text
                role="Tag"
                content="TypeScript"
                spec={{ onRemove: () => alert('Removed TypeScript') }}
              />
              <Text role="Tag" content="Vite" spec={{ onRemove: () => alert('Removed Vite') }} />
              <Text role="Tag" content="Read-only" prominence="Subtle" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-border">
        <Text role="Caption" content="Text Component - Registry-based Architecture" />
        <Text role="Caption" content="Extensible role system with 16 roles implemented" />
      </footer>
    </div>
  );
}
