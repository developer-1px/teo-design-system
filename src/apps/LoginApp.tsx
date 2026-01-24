import { ArrowRight, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Action } from "../design-system/Action";
import { Field } from "../design-system/Field";
import { Frame } from "../design-system/Frame/Frame.tsx";
import { Icon } from "../design-system/Icon";
import { Section } from "../design-system/Section";
import { Switch } from "../design-system/Switch";
import { Prose } from "../design-system/text/context/Prose";
import { Text } from "../design-system/text/Text.tsx";
import {
  ContainerSize,
  FontSize,
  IconSize,
  Size,
  Space,
} from "../design-system/token/token.const.1tier";

export function LoginApp() {
  const [rememberMe, setRememberMe] = useState(false);
  return (
    <Frame
      layout={Layout.Row.Stretch.Start}
      spacing={Space.n0}
      w={Size.fill}
      h={Size.fill}
    >
      {/* Left: Login Form */}
      {/* Left: Login Form */}
      <Frame
        override={{
          p: Space.n32,
          align: "center",
          justify: "center",
          flex: 1,
        }}
      >
        <Frame
          w={Size.fill} // Standardized to n480 (prev 400px)
          override={{ gap: Space.n32, maxWidth: ContainerSize.n480 }}
        >
          <Frame layout={Layout.Col.Left.Start} spacing={Space.n8}>
            <Text size={FontSize.n28} weight="bold">
              Welcome back
            </Text>
            <Text color="secondary">
              Enter your credentials to access your account.
            </Text>
          </Frame>

          <Frame layout={Layout.Col.Left.Start} spacing={Space.n20}>
            <Frame layout={Layout.Col.Left.Start} spacing={Space.n8}>
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

            <Frame layout={Layout.Row.Middle.Start} spacing={Space.n8}>
              <Frame
                layout={Layout.Row.Middle.Center}
                spacing={Space.n8}
                override={{
                  cursor: "pointer",
                  gap: Space.n12,
                  minHeight: Size.n32,
                }}
                onClick={() => setRememberMe(!rememberMe)}
              >
                <Switch checked={rememberMe} onChange={setRememberMe} />
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

          <Text
            size={FontSize.n14}
            color="tertiary"
            style={{ textAlign: "center" }}
          >
            Don't have an account?{" "}
            <span style={{ color: "var(--link-color)", cursor: "pointer" }}>
              Sign up
            </span>
          </Text>
        </Frame>
      </Frame>

      {/* Right: Description / Hero - Balanced Layout */}
      <Section flex={1} surface="panel" border="left">
        <Frame
          override={{ p: Space.n48, align: "center", justify: "center" }}
          w={Size.fill}
          h={Size.fill}
        >
          <Frame
            w={Size.fill}
            override={{ gap: Space.n32, maxWidth: ContainerSize.n480 }}
          >
            {/* Hero Icon */}
            <Frame
              override={{
                w: Size.n96,
                h: Size.n96,
                elevation: "n4",
                align: "center",
                justify: "center",
                border: true,
                r: Radius2["2xl"],
              }}
              style={{ marginBottom: "var(--space-n16)" } as any}
              surface="base"
            >
              <Icon src={Lock} size={IconSize.n48} />
            </Frame>

            <Frame layout={Layout.Col.Left.Start} spacing={Space.n12}>
              <Prose.Title variant="lg">
                Secure & Minimal Design System
              </Prose.Title>
              <Prose.Body
                style={
                  {
                    color: "var(--text-secondary)",
                    fontSize: "var(--font-size-n16)",
                  } as any
                }
              >
                Experience the "Pure White" architecture. A design system built
                for data-dense interfaces where content is the hero.
              </Prose.Body>
            </Frame>

            <Frame
              override={{ gap: Space.n24 }}
              style={{ marginTop: "var(--space-n16)" } as any}
            >
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
          </Frame>
        </Frame>
      </Section>
    </Frame>
  );
}

function FeatureRow({ title, desc }: { title: string; desc: string }) {
  return (
    <Frame
      layout={Layout.Row.Middle.Center}
      spacing={Space.n12}
      override={{ align: "start", gap: Space.n16, minHeight: Size.n40 }}
    >
      <Frame
        surface="sunken"
        override={{
          w: Size.n24,
          h: Size.n24,
          align: "center",
          justify: "center",
          r: Radius2.full,
          flex: 0,
        }}
      >
        <Frame
          surface="primary"
          override={{ w: Size.n8, h: Size.n8, r: Radius2.full }}
        />
      </Frame>
      <Frame override={{ gap: Space.n2 }}>
        <Text weight="bold" size={FontSize.n14}>
          {title}
        </Text>
        <Text
          color="secondary"
          size={FontSize.n14}
          style={{ lineHeight: "1.5" }}
        >
          {desc}
        </Text>
      </Frame>
    </Frame>
  );
}
