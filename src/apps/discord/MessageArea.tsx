/**
 * Discord MessageArea Component
 * Container for channel header, message list, and message input
 */

import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Size } from "../../design-system/token/token.const.1tier";
import { ChannelHeader } from "./ChannelHeader";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

export function MessageArea() {
  return (
    <Frame
      override={{ w: Size.fill, h: Size.fill, minWidth: Size.n0, flex: 1 }}
    >
      <ChannelHeader />
      <MessageList />
      <MessageInput />
    </Frame>
  );
}
