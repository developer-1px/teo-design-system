/**
 * Discord MessageArea Component
 * Container for channel header, message list, and message input
 */

import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Size, Space } from "../../design-system/token/token.const.1tier";
import { ChannelHeader } from "./ChannelHeader";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

export function MessageArea() {
  return (
    <Frame
      flex
      fill
      surface="base"
      override={{ minWidth: Size.n0 }}
    >
      <ChannelHeader />
      <MessageList />
      <MessageInput />
    </Frame>
  );
}
