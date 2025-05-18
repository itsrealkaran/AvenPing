import * as React from "react";
import { Button, ButtonProps } from "./button";
import { ChevronDown } from "lucide-react";

export interface DropdownOption {
  label: string;
  value: string;
}

// Omit onChange from ButtonProps to avoid conflict
interface DropdownButtonProps extends Omit<ButtonProps, "onChange"> {
  options: DropdownOption[];
  onChange: (value: string) => void;
  selected?: string;
}

export const DropdownButton = React.forwardRef<
  HTMLButtonElement,
  DropdownButtonProps
>(({ children, options, onChange, selected, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  // Merge forwarded ref with local ref
  React.useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement);

  React.useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        !buttonRef.current?.contains(event.target as Node) &&
        !menuRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block">
      <Button
        ref={buttonRef}
        {...props}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {children}
        <ChevronDown className="ml-1 size-4" />
      </Button>
      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 z-50 mt-2 rounded-md border border-gray-200 bg-white p-1 shadow-md focus:outline-none"
        >
          {options.map((option) => (
            <Button
              key={option.value}
              ref={buttonRef}
              {...props}
              variant="ghost"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
});
DropdownButton.displayName = "DropdownButton";
