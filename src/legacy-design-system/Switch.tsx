import { Frame } from "./Frame/Frame";
import { Opacity, Size, Space } from "./token/token.const.1tier";
import { Radius2 } from "./token/radius2";

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ checked = false, onChange, disabled }: SwitchProps) {
  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <Frame
      onClick={handleToggle}
      interactive={!disabled ? "button" : undefined}
      surface="sunken"
      override={{
        r: Radius2.full,
        w: Size.n44, // Use closest token or explicit style if token missing
        h: Size.n24,
        p: Space.n2,
        align: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? Opacity.n50 : undefined,
      }}
      style={{
        transition: "background-color 0.2s ease",
        // No box-sizing overrides needed if Size uses standard sizing
      }}
    >
      <Frame
        surface="raised"
        override={{
          r: Radius2.full,
          w: Size.n20,
          h: Size.n20,
          elevation: "n1",
        }}
        style={{
          transition: "transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)", // Smooth spring-like ease
          transform: checked ? "translateX(20px)" : "translateX(0)",
        }}
      // Remove shadow prop if it conflicts or ensure it works.
      // Frame supports shadow via override or className.
      />
    </Frame>
  );
}
