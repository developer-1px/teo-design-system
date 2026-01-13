import { Frame } from "../design-system/Frame";
import { Section } from "../design-system/Section";
import { Text } from "../design-system/Text";
import { Field } from "../design-system/Field";
import { Action } from "../design-system/Action";
import { Prose, ProseDocument } from "../design-system/Prose";
import { ArrowRight, Lock, Mail } from "lucide-react";

export function LoginApp() {
    return (
        <Frame fill row>
            {/* Left: Login Form */}
            <Frame
                flex={1}
                surface="base"
                align="center"
                justify="center"
                p={8}
            >
                <Frame w="100%" maxWidth="400px" gap={8}>
                    <Frame gap={2}>
                        <Text size={7} weight="bold">Welcome back</Text>
                        <Text color="secondary">Enter your credentials to access your account.</Text>
                    </Frame>

                    <Frame gap={5}>
                        <Frame gap={2}>
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
                            <Frame row gap={2} align="center" cursor="pointer">
                                {/* Checkbox simulation */}
                                <Frame w={4} h={4} rounded="sm" style={{ border: "1px solid var(--border-color)" }} surface="sunken" />
                                <Text size={3} color="secondary">Remember me</Text>
                            </Frame>
                            <Text size={3} color="tertiary" style={{ textDecoration: "underline", cursor: "pointer" }}>
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
                        Don't have an account? <span style={{ color: "var(--link-color)", cursor: "pointer" }}>Sign up</span>
                    </Text>
                </Frame>
            </Frame>

            {/* Right: Description / Hero */}
            {/* Right: Description / Hero */}
            <Section
                flex={1}
                surface="panel"
                border="left"
            >
                <Frame
                    fill
                    align="center"
                    justify="center"
                    p={12}
                >
                    <ProseDocument maxWidth={120} gap={8}>
                        <Frame
                            w={64}
                            h={64}
                            surface="card"
                            rounded="2xl"
                            shadow="lg"
                            align="center"
                            justify="center"
                            style={{ marginBottom: 16 }}
                        >
                            <Lock size={32} />
                        </Frame>

                        <Prose role="h2">Secure & Minimal Design System</Prose>
                        <Prose role="body" color="secondary">
                            Experience the "Pure White" architecture. A design system built for data-dense interfaces where content is the hero.
                        </Prose>

                        <Frame gap={4} style={{ marginTop: 16 }}>
                            <FeatureRow title="Zero Decoration" desc="Focus on content hierarchy and spacing." />
                            <FeatureRow title="Composite Surfaces" desc="Depth created by subtle surface layers." />
                            <FeatureRow title="Inspector Ready" desc="Built-in tools to debug design decisions." />
                        </Frame>
                    </ProseDocument>
                </Frame>
            </Section>
        </Frame>
    );
}

function FeatureRow({ title, desc }: { title: string; desc: string }) {
    return (
        <Frame row gap={4} align="start">
            <Frame
                w={6}
                h={6}
                rounded="full"
                surface="primary"
                style={{ marginTop: 4 }}
                flex={0}
            />
            <Frame>
                <Text weight="bold" size={4}>{title}</Text>
                <Text color="secondary" size={3}>{desc}</Text>
            </Frame>
        </Frame>
    );
}
