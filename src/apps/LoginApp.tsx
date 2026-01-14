import { Frame } from "../design-system/Frame";
import { Section } from "../design-system/Section";
import { Text } from "../design-system/text/Text.tsx";
import { Field } from "../design-system/Field";
import { Action } from "../design-system/Action";
import { ProseOld, ProseDocument } from "../design-system/ProseOld.tsx";
import { ArrowRight, Lock, Mail } from "lucide-react";

export function LoginApp() {
  return (
    <Frame fill row>
      {/* Left: Login Form */}
      <Frame
        override={{ p: 8 }}
        flex={1}
        surface="base"
        align="center"
        justify="center"
      >
        <Frame override={{ w: "100%", maxWidth: "400px", gap: 8 }}>
          <Frame override={{ gap: 2 }}>
            <Text size={7} weight="bold">
              Welcome back
            </Text>
            <Text color="secondary">
              Enter your credentials to access your account.
            </Text>
          </Frame>

          <Frame override={{ gap: 5 }}>
            <Frame override={{ gap: 2 }}>
              <Field
                label="Email address"
                placeholder="name@company.com"
                icon={<Mail size={16} />}
              />
              <Field
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={16} />}
              />
            </Frame>

            <Frame row justify="between" align="center">
              <Frame override={{ gap: 2 }} row align="center" cursor="pointer">
                {/* Checkbox simulation */}
                <Frame
                  override={{
                    w: 4,
                    h: 4,
                    rounded: "sm",
                    style: { border: "1px solid var(--border-color)" },
                  }}
                  surface="sunken"
                />
                <Text size={3} color="secondary">
                  Remember me
                </Text>
              </Frame>
              <Text
                size={3}
                color="tertiary"
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                Forgot password?
              </Text>
            </Frame>

            <Action
              label="Sign in"
              variant="primary"
              icon={ArrowRight}
              size="lg"
              onClick={() => alert("Login clicked")}
            />
          </Frame>

          <Text size={3} color="tertiary" style={{ textAlign: "center" }}>
            Don't have an account?{" "}
            <span style={{ color: "var(--link-color)", cursor: "pointer" }}>
              Sign up
            </span>
          </Text>
        </Frame>
      </Frame>

      {/* Right: Description / Hero */}
      {/* Right: Description / Hero */}
      <Section flex={1} surface="panel" border="left">
        <Frame override={{ p: 12 }} fill align="center" justify="center">
          <ProseDocument maxWidth={120} gap={8}>
            <Frame
              override={{
                w: 64,
                h: 64,
                rounded: "2xl",
                shadow: "lg",
                style: { marginBottom: 16 },
              }}
              surface="card"
              align="center"
              justify="center"
            >
              <Lock size={32} />
            </Frame>

            <ProseOld role="h2">Secure & Minimal Design System</ProseOld>
            <ProseOld role="body" color="secondary">
              Experience the "Pure White" architecture. A design system built
              for data-dense interfaces where content is the hero.
            </ProseOld>

            <Frame override={{ gap: 4, style: { marginTop: 16 } }}>
              <FeatureRow
                title="Zero Decoration"
                desc="Focus on content hierarchy and spacing."
              />
              <FeatureRow
                title="Composite Surfaces"
                desc="Depth created by subtle surface layers."
              />
              <FeatureRow
                title="Inspector Ready"
                desc="Built-in tools to debug design decisions."
              />
            </Frame>
          </ProseDocument>
        </Frame>
      </Section>
    </Frame>
  );
}

function FeatureRow({ title, desc }: { title: string; desc: string }) {
  return (
    <Frame override={{ gap: 4 }} row align="start">
      <Frame
        override={{ w: 6, h: 6, rounded: "full", style: { marginTop: 4 } }}
        surface="primary"
        flex={0}
      />
      <Frame>
        <Text weight="bold" size={4}>
          {title}
        </Text>
        <Text color="secondary" size={3}>
          {desc}
        </Text>
      </Frame>
    </Frame>
  );
}
