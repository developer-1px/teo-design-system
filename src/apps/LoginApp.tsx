import { Frame } from "../design-system/Frame";
import { Space, Size } from "../design-system/token/token.const.1tier";
import { Section } from "../design-system/Section";
import { Text } from "../design-system/text/Text.tsx";
import { Field } from "../design-system/Field";
import { Action } from "../design-system/Action";
import { ProseOld, ProseDocument } from "../design-system/ProseOld.tsx";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Icon } from "../design-system/Icon";
import { IconSize, FontSize } from "../design-system/token/token.const.1tier";

export function LoginApp() {
  return (
    <Frame fill row>
      {/* Left: Login Form */}
      <Frame
        override={{ p: Space.n32 }}
        flex={1}
        surface="base"
        align="center"
        justify="center"
      >
        <Frame override={{ w: Size.full, style: { maxWidth: "400px" }, gap: Space.n32 }}>
          <Frame override={{ gap: Space.n8 }}>
            <Text size={FontSize.n28} weight="bold">
              Welcome back
            </Text>
            <Text color="secondary">
              Enter your credentials to access your account.
            </Text>
          </Frame>

          <Frame override={{ gap: Space.n20 }}>
            <Frame override={{ gap: Space.n8 }}>
              <Field
                label="Email address"
                placeholder="name@company.com"
                icon={<Icon src={Mail} size={IconSize.n16} />}
              />
              <Field
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Icon src={Lock} size={IconSize.n16} />}
              />
            </Frame>

            <Frame row justify="between" align="center">
              <Frame override={{ gap: Space.n8 }} row align="center" cursor="pointer">
                {/* Checkbox simulation */}
                <Frame
                  override={{
                    w: Size.n4,
                    h: Size.n4,
                    rounded: "sm",
                    style: { border: "1px solid var(--border-color)" },
                  }}
                  surface="sunken"
                />
                <Text size={FontSize.n14} color="secondary">
                  Remember me
                </Text>
              </Frame>
              <Text
                size={FontSize.n14}
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

          <Text size={FontSize.n14} color="tertiary" style={{ textAlign: "center" }}>
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
        <Frame override={{ p: Space.n48 }} fill align="center" justify="center">
          <ProseDocument maxWidth={120} gap={8}>
            <Frame
              override={{
                w: Size.n64,
                h: Size.n64,
                rounded: "2xl",
                shadow: "lg",
                style: { marginBottom: 16 },
              }}
              surface="card"
              align="center"
              justify="center"
            >
              <Icon src={Lock} size={IconSize.n32} />
            </Frame>

            <ProseOld role="h2">Secure & Minimal Design System</ProseOld>
            <ProseOld role="body" color="secondary">
              Experience the "Pure White" architecture. A design system built
              for data-dense interfaces where content is the hero.
            </ProseOld>

            <Frame override={{ gap: Space.n16, style: { marginTop: 16 } }}>
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
    <Frame override={{ gap: Space.n16 }} row align="start">
      <Frame
        override={{ w: Size.n8, h: Size.n8, rounded: "full", style: { marginTop: 4 } }}
        surface="primary"
        flex={0}
      />
      <Frame>
        <Text weight="bold" size={FontSize.n12}>
          {title}
        </Text>
        <Text color="secondary" size={FontSize.n14}>
          {desc}
        </Text>
      </Frame>
    </Frame>
  );
}
