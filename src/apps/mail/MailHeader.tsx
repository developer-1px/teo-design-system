import { useAtom } from "jotai";
import { Menu, Search, Settings, User, Mail } from "lucide-react";

import { Icon } from "@/ui/primitives/Icon";
import { Text } from "@/legacy-design-system/text/Text.tsx";
import { IconSize } from "@/legacy-design-system/token/token.const.1tier";
import { searchQueryAtom } from "./store";
import * as styles from "./Mail.css";

export function MailHeader() {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);

  return (
    <div className={styles.header}>
      {/* Left: Logo and Menu */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "40px" }}>
        <button className={styles.iconButton}>
          <Icon src={Menu} size={IconSize.n20} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Icon
            src={Mail}
            size={IconSize.n20}
            style={{ color: "var(--text-primary)" }}
          />
          <Text.Card.Title weight="bold">Mail</Text.Card.Title>
        </div>
      </div>

      {/* Center: Search */}
      <label className={styles.searchBar}>
        <Icon
          src={Search}
          size={IconSize.n14}
          style={{ color: "var(--text-tertiary)" }}
        />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search mail"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </label>

      {/* Right: Profile and Settings */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button className={styles.iconButton}>
          <Icon src={Settings} size={IconSize.n20} />
        </button>
        <button className={styles.iconButton}>
          <Icon src={User} size={IconSize.n20} />
        </button>
      </div>
    </div>
  );
}
