import { Frame } from "../../design-system/Frame";
import { Text } from "../../design-system/Text";
import {
    Box,
    ChevronRight,
    Columns,
    FileText,

    Image as ImageIcon,
    Layers,
    Settings,
    Type,
} from "lucide-react";

export interface CMSSidebarProps {
    isOpen: boolean;
}

export function CMSSidebar({ isOpen }: CMSSidebarProps) {
    return (
        <Frame
            surface="base"
            border="right"
            p={isOpen ? 2 : 0}
            style={{
                width: isOpen ? 280 : 0,
                gap: 24,
                opacity: isOpen ? 1 : 0,
                overflow: "hidden",
                whiteSpace: "nowrap",
            }}
        >
            <Frame row align="center" gap="8px" p="0px 8px">
                <Frame style={{ width: 24, height: 24 }} rounded="md" surface="primary" pack>
                    <Layers size={14} color="#fff" />
                </Frame>
                <Text weight="bold" style={{ fontSize: 16 }}>
                    Visual Builder
                </Text>
            </Frame>

            <Frame flex gap="8px" overflow="scroll">
                <Frame>
                    <Frame p="0px 8px 8px 8px">
                        <Text style={{ fontSize: 11 }} weight="bold" color="tertiary">
                            ELEMENTS
                        </Text>
                    </Frame>
                    <Frame grid columns="1fr 1fr" gap="8px">
                        <ElementButton icon={Type} label="Text" />
                        <ElementButton icon={ImageIcon} label="Image" />
                        <ElementButton icon={Box} label="Box" />
                        <ElementButton icon={Columns} label="Columns" />
                    </Frame>
                </Frame>

                <Frame h="1px" surface="overlay" w="100%" style={{ margin: "16px 0" }} />

                <Frame gap="4px">
                    <Frame p="0px 8px 8px 8px">
                        <Text style={{ fontSize: 11 }} weight="bold" color="tertiary">
                            LAYERS
                        </Text>
                    </Frame>
                    <LayerItem label="Hero Section" active />
                    <LayerItem label="Feature Grid" />
                    <LayerItem label="Testimonials" />
                    <LayerItem label="Footer" />
                </Frame>
            </Frame>

            <Frame border="top" p="16px 0px 0px 0px" row align="center" gap="8px">
                <Frame style={{ width: 32, height: 32 }} rounded="full" surface="sunken" pack>
                    <Settings size={16} />
                </Frame>
                <Frame gap="2px">
                    <Text style={{ fontSize: 13 }} weight="medium">
                        Site Settings
                    </Text>
                    <Text style={{ fontSize: 11 }} color="tertiary">
                        General, SEO, Analytics
                    </Text>
                </Frame>
            </Frame>
        </Frame>
    );
}

interface ElementButtonProps {
    icon: React.ElementType;
    label: string;
}

function ElementButton({ icon: Icon, label }: ElementButtonProps) {
    return (
        <Frame
            surface="sunken"
            p="12px"
            rounded="lg"
            align="center"
            gap="8px"
            cursor="grab"
            border
        >
            <Icon size={20} opacity={0.6} />
            <Text style={{ fontSize: 12 }} weight="medium">
                {label}
            </Text>
        </Frame>
    );
}

interface LayerItemProps {
    label: string;
    active?: boolean;
}

function LayerItem({ label, active }: LayerItemProps) {
    return (
        <Frame
            row
            align="center"
            justify="between"
            p="8px 12px"
            rounded="md"
            surface={active ? "raised" : undefined}
            cursor="pointer"
        >
            <Frame row gap="8px" align="center">
                <FileText size={14} opacity={0.5} />
                <Text style={{ fontSize: 13 }} weight={active ? "bold" : "medium"}>
                    {label}
                </Text>
            </Frame>
            {active && <ChevronRight size={12} opacity={0.5} />}
        </Frame>
    );
}
