/**
 * Discord MessageInput Component
 * Message composer at the bottom of the channel
 */

import {useAtomValue} from "jotai"
import {Plus, Smile} from "lucide-react"
import {useState} from "react"
import {Frame} from "../../design-system/Frame/Frame.tsx"
import {Layout} from "../../design-system/Frame/Layout/Layout.ts"
import {Icon} from "../../design-system/Icon"
import {FontSize, IconSize, Size, Space,} from "../../design-system/token/token.const.1tier"
import {Radius2} from "../../design-system/token/token.const.2tier"
import {getChannelById} from "./mockData"
import {selectedChannelIdAtom, selectedServerIdAtom} from "./store"

export function MessageInput() {
  const [message, setMessage] = useState("");
  const selectedServerId = useAtomValue(selectedServerIdAtom);
  const selectedChannelId = useAtomValue(selectedChannelIdAtom);

  if (!selectedServerId || !selectedChannelId) {
    return null;
  }

  const result = getChannelById(selectedServerId, selectedChannelId);
  const channelName = result?.channel.name || "channel";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Send message:", message);
      setMessage("");
    }
  };

  return (
    <Frame override={{ px: Space.n16, pb: Space.n16 }}>
      <Frame
        surface="sunken"
        rounded={Radius2.lg}
        override={{ px: Space.n16, py: Space.n12 }}
      >
        <form onSubmit={handleSubmit}>
          <Frame layout={Layout.Row.Item.Default}>
            {/* Add Attachment */}
            <Frame
              override={{
                w: Size.n32,
                h: Size.n32,
                cursor: "pointer",
                align: "center",
                justify: "center",
              }}
              rounded={Radius2.full}
              style={{
                color: "var(--text-subtle)",
              }}
            >
              <Icon src={Plus} size={IconSize.n20} />
            </Frame>

            {/* Input */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message #${channelName}`}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                color: "var(--text-primary)",
                fontSize: FontSize.n14,
                fontFamily: "inherit",
              }}
            />

            {/* Emoji */}
            <Frame
              override={{
                w: Size.n32,
                h: Size.n32,
                cursor: "pointer",
                align: "center",
                justify: "center",
              }}
              rounded={Radius2.full}
              style={{
                color: "var(--text-subtle)",
              }}
            >
              <Icon src={Smile} size={IconSize.n20} />
            </Frame>
          </Frame>
        </form>
      </Frame>
    </Frame>
  );
}
