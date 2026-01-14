import { useState, useRef, useEffect } from "react";
import { Lock, Copy, X, ChevronRight, ChevronDown, RefreshCw } from "lucide-react";
import { Action } from "../../design-system/Action";
import { Text } from "../../design-system/text/Text";
import { Frame } from "../../design-system/Frame";
import { FontSize, Space } from "../../design-system/token/token.const.1tier";
import { PropertyTree } from "./PropertyTree";
import type { ComponentStackItem } from "../lib/fiber-utils";
import { generateJSX } from "../lib/inspector-utils";

const PROMPT_POOL = [
    {
        label: "토큰 사용",
        prompt:
            "이 컴포넌트를 하드코딩된 값(px) 대신 디자인 시스템 토큰(간격, 색상, 반경)을 사용하도록 리팩토링해주세요.",
    },
    {
        label: "콤팩트하게",
        prompt:
            "이 컴포넌트의 패딩과 간격을 줄여서 더 콤팩트하고 정보 밀도를 높여주세요.",
    },
    {
        label: "아이콘 수정",
        prompt:
            "이모지나 일반 SVG 아이콘을 디자인 시스템의 Lucide-React 아이콘으로 교체해주세요.",
    },
    {
        label: "Props 정리",
        prompt:
            "사용하지 않는 불필요한 props를 제거하고 컴포넌트 구조를 단순화해주세요.",
    },
    {
        label: "컴포넌트 추출",
        prompt:
            "이 논리적 단위를 별도의 재사용 가능한 하위 컴포넌트로 추출해주세요.",
    },
    {
        label: "다크모드 수정",
        prompt:
            "다크 모드에서 올바르게 보이도록 모든 색상(배경, 테두리, 텍스트)이 시맨틱 토큰을 사용하는지 확인해주세요.",
    },
    {
        label: "레이아웃 정렬",
        prompt:
            "이 컴포넌트의 자식 요소 정렬이 잘못되었습니다. flex 속성을 수정하여 올바른 레이아웃을 잡아주세요.",
    },
    {
        label: "반응형 적용",
        prompt:
            "이 컴포넌트가 모바일에서도 잘 보이도록 반응형 스타일(flex-wrap 등)을 적용해주세요.",
    },
    {
        label: "접근성 향상",
        prompt:
            "스크린 리더 사용자를 위해 적절한 aria 속성과 시맨틱 태그를 추가해주세요.",
    },
    {
        label: "조건부 렌더링",
        prompt:
            "이 컴포넌트의 렌더링 로직을 확인하고, 조건부 렌더링이 더 깔끔하게 되도록 수정해주세요.",
    },
    {
        label: "타이포그래피",
        prompt:
            "수동 스타일 오버라이드 대신 Text 컴포넌트의 variant prop을 사용하여 타이포그래피를 표준화해주세요.",
    },
];

function getRandomPrompts(count: number) {
    const shuffled = [...PROMPT_POOL].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export function InspectorPanel({
    element,
    name,
    stack,
    props,
    initialX,
    initialY,
    onClose,
    onCopy,
}: {
    element: HTMLElement;
    name: string;
    stack: ComponentStackItem[];
    props: Record<string, any>;
    initialX: number;
    initialY: number;
    onClose: () => void;
    onCopy: (msg: string) => void;
}) {
    // Initialize position only once on mount, so it doesn't jump around if parent rerenders
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const styles = window.getComputedStyle(element);
    const getProp = (key: string) => styles.getPropertyValue(key);

    // DOM Properties Removed as per request
    const properties: {
        section: string;
        items: { key: string; value: any }[];
    }[] = [];

    // Additional Section for Hierarchy
    if (stack && stack.length > 0) {
        properties.push({
            section: "Hierarchy",
            items: stack.map((item, i) => ({
                key: `${i + 1}`, // Simple index key
                value: `${item.fileName}:${item.lineNumber}(${item.name})`, // Format: File:Line(Name)
            })),
        });
    }

    // React Props Section (Priority)
    if (Object.keys(props).length > 0) {
        properties.unshift({
            section: "React Props",
            items: Object.entries(props).map(([key, value]) => ({
                key,
                value,
            })),
        });
    }

    // State
    const [showAiAssist, setShowAiAssist] = useState(false);
    const [randomPrompts, setRandomPrompts] = useState<
        { label: string; prompt: string }[]
    >(() => getRandomPrompts(5));

    const handlePromptClick = (prompt: string) => {
        const clone = element.cloneNode(true) as HTMLElement;
        clone.innerHTML = ""; // Just the shell to avoid noise
        const shell = clone.outerHTML;

        // Construct Prompt
        const fullPrompt = `I need to modify this component in ${name} (${stack[0]?.fileName || "unknown file"}).\n\nComponent Shell:\n${shell}\n\nRequest: ${prompt}\n\nPlease provide the corrected code.`;

        navigator.clipboard.writeText(fullPrompt).then(() => {
            onCopy("Prompt copied!");
        });
    };

    // Filter
    const hasFlex =
        getProp("display").includes("flex") || getProp("display").includes("grid");

    const handleCopy = () => {
        const jsx = generateJSX(name, props);
        navigator.clipboard.writeText(jsx).then(() => {
            onCopy("Component shell copied!");
        });
    };

    // Drag Logic
    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            setPosition({
                x: e.clientX - dragOffset.current.x,
                y: e.clientY - dragOffset.current.y,
            });
        };

        const handleMouseUp = () => {
            isDragging.current = false;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    // Determine Title
    const title = stack.length > 0 ? stack[0].name : "Element";

    return (
        <div
            style={{
                position: "fixed",
                top: position.y, // absolute or fixed? original was fixed inside overlay.
                left: position.x,
                zIndex: 10003,
                pointerEvents: "auto",
            }}
        >
            <Frame
                override={{
                    style: {
                        maxHeight: "80vh",
                        border: "1px solid var(--border-color)",
                        width: 260, // Enforce width as per original code logic usually IMPLIED or specific
                    },
                    rounded: "lg",
                    shadow: "2xl",
                }}
                surface="base"
            >
                {/* Draggable Header - Compact */}
                <Frame
                    override={{
                        py: Space.n0,
                        px: Space.n8,
                        style: {
                            cursor: "grab",
                            userSelect: "none",
                            borderBottom: "1px solid var(--border-color)",
                        },
                    }}
                    surface="sunken"
                    row
                    align="center"
                    justify="between"
                    onMouseDown={handleMouseDown}
                >
                    <Frame override={{ gap: Space.n6 }} row align="center">
                        <Lock size={10} className="text-primary" />
                        <Text weight="bold" size={FontSize.n10}>
                            {title}
                        </Text>
                    </Frame>
                    <Frame override={{ gap: Space.n2 }} row>
                        <Action
                            icon={Copy}
                            variant="ghost"
                            size={5}
                            iconSize={10}
                            tooltip="Copy HTML"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent drag start
                                handleCopy();
                            }}
                        />
                        <Action
                            icon={X}
                            variant="ghost"
                            size={5}
                            iconSize={10}
                            tooltip="Close Inspector"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent drag start
                                onClose();
                            }}
                        />
                    </Frame>
                </Frame>

                {/* Content - Compact */}
                <Frame override={{ py: Space.n8, px: Space.n0 }} overflow="auto">
                    {/* File Path Subtitle */}
                    <Frame override={{ pt: Space.n0, pr: Space.n8, pb: Space.n8, pl: Space.n8 }}>
                        <Text size={FontSize.n28} color="tertiary" style={{ wordBreak: "break-all" }}>
                            {name}
                        </Text>
                    </Frame>

                    {/* AI Assist Section (Collapsible) */}
                    <Frame override={{ gap: Space.n2, pt: Space.n0, pr: Space.n8, pb: Space.n8, pl: Space.n8 }}>
                        <Frame row align="center" justify="between">
                            <Action
                                variant="ghost"
                                size={5}
                                icon={showAiAssist ? ChevronDown : ChevronRight}
                                label="AI Assist"
                                onClick={() => setShowAiAssist(!showAiAssist)}
                                style={{
                                    width: "100%",
                                    justifyContent: "flex-start",
                                    color: "var(--text-tertiary)",
                                }}
                            />
                            {showAiAssist && (
                                <Action
                                    icon={RefreshCw}
                                    variant="ghost"
                                    size={4}
                                    iconSize={10}
                                    tooltip="새로운 제안 보기"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setRandomPrompts(getRandomPrompts(5));
                                    }}
                                />
                            )}
                        </Frame>

                        {showAiAssist && (
                            <Frame override={{ gap: Space.n2, pt: Space.n0, pr: Space.n0, pb: Space.n0, pl: Space.n8 }}>
                                {randomPrompts.map((item) => (
                                    <Action
                                        key={item.label}
                                        size={FontSize.n9}
                                        variant="ghost"
                                        justify="start"
                                        label={item.label}
                                        onClick={() => handlePromptClick(item.prompt)}
                                        style={{
                                            width: "100%",
                                            justifyContent: "flex-start",
                                            textAlign: "left",
                                        }}
                                    />
                                ))}
                            </Frame>
                        )}
                    </Frame>

                    {/* Properties & Hierarchy (Always Visible now or simplified) */}
                    {properties.map((section) => {
                        if (section.section === "Flex" && !hasFlex) return null;
                        return (
                            <Frame
                                override={{ gap: Space.n2, pt: Space.n0, pr: Space.n8, pb: Space.n8, pl: Space.n8 }}
                                key={section.section}
                            >
                                <Text
                                    weight="bold"
                                    size={FontSize.n9}
                                    color="tertiary"
                                    style={{
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    {section.section}
                                </Text>
                                <Frame
                                    override={{
                                        gap: Space.n0,
                                        style: { border: "1px solid var(--border-color)" },
                                        rounded: "sm",
                                    }}
                                    overflow="hidden"
                                >
                                    {section.items.map((item, i) => (
                                        <PropertyTree
                                            key={item.key}
                                            label={item.key}
                                            value={item.value}
                                            background={i % 2 === 0 ? "base" : "sunken"}
                                        />
                                    ))}
                                </Frame>
                            </Frame>
                        );
                    })}
                </Frame>
            </Frame>
        </div>
    );
}
