import {ChevronsRight, MoreHorizontal} from "lucide-react"
import {Action} from "../../../design-system/Action"
import {Frame} from "../../../design-system/Frame/Frame.tsx"
import {Layout} from "../../../design-system/Frame/Layout/Layout.ts"
import {Text} from "../../../design-system/text/Text.tsx"
import {FontSize, Size, type SizeToken, Space,} from "../../../design-system/token/token.const.1tier"
import {Radius2} from "../../../design-system/token/token.const.2tier"

function Avatar({
  initial,
  color,
  size = Size.n32,
}: {
  initial: string;
  color: string;
  size?: SizeToken;
}) {
  return (
    <Frame
      rounded={Radius2.full}
      style={{ backgroundColor: color }}
      pack
      override={{ w: size, h: size, align: "center" }}
    >
      <Text.Card.Note
        size={FontSize.n12}
        weight="bold"
        style={{ color: "white" }}
      >
        {initial}
      </Text.Card.Note>
    </Frame>
  );
}

export function DrawerHeader({
  title,
  subtitle,
  avatarColor,
  onClose,
}: {
  title: string;
  subtitle: string;
  avatarColor: string;
  onClose: () => void;
}) {
  return (
    <Frame
      layout={Layout.Row.Header.Default}
      override={{
        h: Size.n64,
        py: Space.n0,
        px: Space.n24,
        borderBottom: true,
        align: "center",
      }}
    >
      <Frame
        layout={Layout.Row.Item.Default}
        override={{ gap: Space.n12, align: "center" }}
      >
        <Action icon={ChevronsRight} variant="ghost" onClick={onClose} />
        <Avatar initial={title[0]} color={avatarColor} size={Size.n32} />
        <Frame>
          <Text.Card.Title weight="bold">{title}</Text.Card.Title>
          <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
            {subtitle}
          </Text.Card.Note>
        </Frame>
      </Frame>
      <Frame override={{ gap: Space.n8 }} layout={Layout.Row.Actions.Default}>
        <Action icon={MoreHorizontal} variant="ghost" />
      </Frame>
    </Frame>
  );
}
