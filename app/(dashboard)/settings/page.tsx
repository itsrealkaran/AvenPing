"use client";

import { useState } from "react";
import Body from "@/components/layout/body";
import ContactSettings from "@/components/settings/ContactSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import LabelSettings from "@/components/settings/LabelSettings";
import CatalogSettings from "@/components/settings/CatalogSettings";
import APISettings from "@/components/settings/APISettings";

const SECTIONS = [
  { key: "contact", label: "Contact" },
  { key: "notification", label: "Notification" },
  { key: "label", label: "Label" },
  { key: "catalog", label: "Catalog" },
  { key: "api", label: "API" },
];

function SectionDetail({ section }: { section: string }) {
  switch (section) {
    case "contact":
      return <ContactSettings />;
    case "notification":
      return <NotificationSettings />;
    case "label":
      return <LabelSettings />;
    case "catalog":
      return <CatalogSettings />;
    case "api":
      return <APISettings />;
    default:
      return <div>Select a section</div>;
  }
}

export default function SettingsPage() {
  const [selected, setSelected] = useState(SECTIONS[0].key);
  return (
    <Body title="Settings">
      <div className="flex flex-1 border-3 border-[#E0E0E0] rounded-2xl bg-white ">
        {/* Sidebar */}
        <div className="w-64 min-w-[120px] max-w-xs h-full flex flex-col overflow-y-auto">
          <nav className="flex-1 overflow-y-auto px-2 pb-4">
            <ul className="space-y-1 pt-2">
              {SECTIONS.map((section) => {
                const isActive = selected === section.key;
                return (
                  <li key={section.key}>
                    <button
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-700 focus:outline-none ${
                        isActive ? "bg-gray-100 text-gray-700" : ""
                      }`}
                      onClick={() => setSelected(section.key)}
                    >
                      <span className="truncate">{section.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        {/* Detail Panel */}
        <div className="flex-1 h-full overflow-y-auto border-l-3 border-[#E0E0E0]">
          <div className="p-4 min-h-full">
            <SectionDetail section={selected} />
          </div>
        </div>
      </div>
    </Body>
  );
}
