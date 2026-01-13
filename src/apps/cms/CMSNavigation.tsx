import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame";
import { Text } from "../../design-system/Text";
import {
    Bell,
    ChevronDown,
    Layout,
    Menu,
    Monitor,
    Moon,
    Play,
    Share,
} from "lucide-react";

export function TopCenterBar() {
    return (
        <Frame
            position="absolute"
            top={12}
            left="50%"
            style={{ transform: "translateX(-50%)" }}
            surface="base"
            rounded="full"
            p={4}
            gap={4}
            shadow="lg"
            border
            row
            zIndex={50}
            align="center"
        >
            <Action icon={Monitor} variant="ghost" size="sm" rounded="full" />
            <Frame w={1} h={16} surface="overlay" />
            <Frame row gap={8} align="center" style={{ padding: "0 8px" }}>
                <Text size={13} weight="medium">
                    Page:
                </Text>
                <Frame row gap={4} align="center" cursor="pointer">
                    <Text size={13} weight="bold">
                        Marketing Home
                    </Text>
                    <ChevronDown size={12} opacity={0.5} />
                </Frame>
            </Frame>
            <Frame w={1} h={16} surface="overlay" />
            <Action icon={Play} variant="ghost" size="sm" rounded="full" />
        </Frame>
    );
}

export function TopRightBar() {
    return (
        <Frame
            position="absolute"
            top={12}
            right={12}
            row
            gap={8}
            zIndex={50}
            align="center"
        >
            <Frame row gap={4} surface="base" p={4} rounded="full" border shadow="lg">
                <Frame p={6} rounded="full">
                    <Moon size={16} />
                </Frame>
                <Frame p={6} rounded="full">
                    <Bell size={16} />
                </Frame>
            </Frame>
            <Action
                label="Share"
                icon={Share}
                variant="primary"
                size="sm"
                glow
                rounded="full"
            />
        </Frame>
    );
}

export interface SidebarToggleProps {
    isOpen: boolean;
    onClick: () => void;
}

export function SidebarToggle({ isOpen, onClick }: SidebarToggleProps) {
    return (
        <Frame
            position="absolute"
            top={12}
            left={12}
            zIndex={50}
            surface="base"
            p={8}
            rounded="full"
            border
            shadow="lg"
            cursor="pointer"
            className=""
            onClick={onClick}
        >
            {isOpen ? <Layout size={20} /> : <Menu size={20} />}
        </Frame>
    );
}
