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

  // Get the selected option label
  const selectedOption = options.find((option) => option.value === selected);
  const displayText = children || selectedOption?.label || "Select Option";

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
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
      >
        {displayText}
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
              type="button"
              className="w-full justify-start"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
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
