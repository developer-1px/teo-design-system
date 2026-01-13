import { ProseSection } from "../../design-system/Prose";
import { Frame } from "../../design-system/Frame";
import { Text } from "../../design-system/Text";
import { ArrowUpRight, Globe, MessageSquare, Sparkles } from "lucide-react";

export function MainFooter() {
    return (
        <ProseSection
            w="100%"
            p="64px 24px"
            surface="sunken"
            contentGap="16px"
            maxWidth="1200px"
        >
            <Frame row justify="between" align="start" w="100%">
                <Frame gap="6px" w="35%">
                    <Frame row gap="3px" align="center">
                        <Frame
                            style={{ width: 40, height: 40 }}
                            rounded="xl"
                            surface="primary"
                            pack
                            shadow="lg"
                        >
                            <Sparkles size={20} color="#fff" />
                        </Frame>
                        <Text weight="bold" style={{ fontSize: 20, letterSpacing: "-0.02em" }}>
                            VisualEngine
                        </Text>
                    </Frame>
                    <Text
                        style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.7 }}
                        color="secondary"
                    >
                        Building the future of the visual web. Join us in redefining how
                        websites are crafted.
                    </Text>
                    <Frame row gap="4px">
                        <Globe size={20} opacity={0.4} />
                        <MessageSquare size={20} opacity={0.4} />
                        <ArrowUpRight size={20} opacity={0.4} />
                    </Frame>
                </Frame>

                <Frame row gap="16px">
                    <FooterLinkColumn
                        title="PRODUCT"
                        links={["Features", "Design", "Automation", "Templates"]}
                    />
                    <FooterLinkColumn
                        title="RESOURCES"
                        links={["Documentation", "API", "Community", "Guides"]}
                    />
                    <FooterLinkColumn
                        title="COMPANY"
                        links={["About Us", "Legal", "Careers", "News"]}
                    />
                </Frame>
            </Frame>

            <Frame
                border="top"
                p="8px 0 0 0"
                row
                justify="between"
                align="center"
                w="100%"
            >
                <Text style={{ fontSize: 13 }} color="tertiary">
                    © 2024 VisualEngine Inc. All rights reserved.
                </Text>
                <Frame row gap="6px">
                    <Text style={{ fontSize: 13 }} color="tertiary">
                        Privacy Policy
                    </Text>
                    <Text style={{ fontSize: 13 }} color="tertiary">
                        Terms of Service
                    </Text>
                </Frame>
            </Frame>
        </ProseSection>
    );
}

interface FooterLinkColumnProps {
    title: string;
    links: string[];
}

function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
    return (
        <Frame gap="4px">
            <Text
                style={{ fontSize: 11, letterSpacing: "0.05em" }}
                weight="bold"
                color="tertiary"
            >
                {title}
            </Text>
            {links.map((link: string) => (
                <Text key={link} style={{ fontSize: 15 }} color="secondary" opacity={0.6}>
                    {link}
                </Text>
            ))}
        </Frame>
    );
}
