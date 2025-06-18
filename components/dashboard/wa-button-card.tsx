import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import React, { useRef, useState } from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const PALETTE = ["#ffffff", "#7FFB8A", "#7EEAFF", "#000000", "#BDBDBD"];

function getContrastingTextColor(bg: string) {
  let color = bg.replace("#", "");
  if (color.length === 3)
    color = color
      .split("")
      .map((x) => x + x)
      .join("");
  if (color.length !== 6) return "#222";
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#222" : "#fff";
}

export default function WAButtonCardContent() {
  const [buttonText, setButtonText] = useState("");
  const [buttonColor, setButtonColor] = useState("#7FFB8A");
  const [buttonRoundness, setButtonRoundness] = useState("10");
  const colorInputRef = useRef<HTMLInputElement>(null);
  const isCustom = !PALETTE.includes(buttonColor);
  const textColor = getContrastingTextColor(buttonColor);
  const previewBorder = `${buttonColor}40`;
  const previewBg = "#F5F5F5";

  const handleGetCode = () => {
    // Generate the WhatsApp button code
    const code = `<a href="https://wa.me/YOUR_PHONE_NUMBER?text=${encodeURIComponent(
      buttonText || "Chat with us on WhatsApp"
    )}" 
  style="display: inline-flex; align-items: center; padding: 0.5rem 1.5rem; font-weight: 500; border-radius: ${buttonRoundness}px; background-color: ${buttonColor}; color: ${textColor}; text-decoration: none; border: 2px solid ${previewBorder}; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.01);">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 0.5rem;">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
  ${buttonText || "Chat with us on WhatsApp"}
</a>`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(code)
      .then(() => {
        alert("WhatsApp button code copied to clipboard!");
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("WhatsApp button code copied to clipboard!");
      });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Text Input */}
      <div>
        <label
          htmlFor="wa-btn-text"
          className="block text-sm font-medium text-gray-600 mb-1"
        >
          Text
        </label>
        <Input
          id="wa-btn-text"
          aria-label="WA Button Text"
          type="text"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          className="text-sm px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition w-full bg-white"
          placeholder="Chat with us on WhatsApp"
        />
      </div>
      {/* Color Palette and Roundness Controls */}
      <div className="flex flex-row gap-8">
        {/* Color Palette */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-600">
            Color Palette
          </span>
          <div className="flex gap-1.5">
            {PALETTE.map((color, idx) => (
              <button
                key={color}
                type="button"
                aria-label={`Select color ${color}`}
                className={`w-8 h-8 rounded-md border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  buttonColor === color && !isCustom
                    ? "ring-2 ring-primary border-primary"
                    : "border-gray-300"
                }`}
                style={{ background: color }}
                onClick={() => setButtonColor(color)}
              />
            ))}
            {/* Custom color picker trigger */}
            <button
              type="button"
              aria-label="Pick a custom color"
              className={`w-8 h-8 rounded-md border flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                isCustom
                  ? "ring-2 ring-primary border-primary"
                  : "border-gray-300"
              }`}
              style={{ background: isCustom ? buttonColor : "#F3F4F6" }}
              onClick={() => colorInputRef.current?.click()}
            >
              {!isCustom && (
                <span className="text-xl text-gray-400 font-bold">+</span>
              )}
              <input
                ref={colorInputRef}
                type="color"
                aria-label="Custom color picker"
                className="absolute opacity-0 w-0 h-0"
                value={isCustom ? buttonColor : "#7FFB8A"}
                onChange={(e) => setButtonColor(e.target.value)}
              />
            </button>
          </div>
        </div>

        {/* Roundness Slider */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Roundness</span>
            <span className="text-sm text-gray-700 font-mono">
              {buttonRoundness} px
            </span>
          </div>
          <div className="flex flex-1 items-center">
            <Slider
              min={0}
              max={30}
              step={1}
              value={[parseInt(buttonRoundness)]}
              onValueChange={([v]) => setButtonRoundness(String(v))}
              aria-label="Button Roundness"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div>
        <span className="block text-[15px] font-medium text-gray-600 mb-1">
          Preview
        </span>
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ background: previewBg, padding: "0.75rem" }}
        >
          <div
            className="items-center px-4 py-1.5 font-medium border shadow-sm"
            style={{
              background: buttonColor,
              borderRadius: `${buttonRoundness}px`,
              color: textColor,
              border: `2px solid ${previewBorder}`,
              minWidth: 0,
              fontFamily: "inherit",
              fontWeight: 500,
              fontSize: "0.875rem",
              boxShadow: "0 1px 2px 0 rgba(0,0,0,0.01)",
            }}
          >
            <WhatsAppIcon
              sx={{
                color: textColor,
                fontSize: "1.25rem",
                marginRight: "0.375rem",
              }}
            />
            <span
              className="text-sm font-medium truncate"
              style={{ maxWidth: 200 }}
            >
              {buttonText || "Chat with us on WhatsApp"}
            </span>
          </div>
        </div>
      </div>
      <Button
        onClick={handleGetCode}
        size="sm"
        className="w-fit"
        aria-label="Get WA Button Code"
      >
        Get Code
      </Button>
    </div>
  );
}
