"use client";

import { ReactNode } from "react";
import { UserProvider } from "./user-context";
import { MessagesProvider } from "./messages-context";
import { ProfileProvider } from "./profile-provider";
import { Providers as TanStackQueryProvider } from "@/lib/providers";
import { ContactProvider } from "./contact-provider";
import { FlowProvider } from "./flow-provider";
import { TemplateProvider } from "./template-provider";
import { CampaignProvider } from "./campaign-provider";
import { NotificationProvider } from "./notification-provider";
import { SettingsProvider } from "./settings-provider";
import { PhoneNumberProvider } from "./phone-number-context";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <TanStackQueryProvider>
      <UserProvider>
        <PhoneNumberProvider>
          <MessagesProvider>
            <ProfileProvider>
              <ContactProvider>
                <FlowProvider>
                  <TemplateProvider>
                    <CampaignProvider>
                      <NotificationProvider>
                        <SettingsProvider>{children}</SettingsProvider>
                      </NotificationProvider>
                    </CampaignProvider>
                  </TemplateProvider>
                </FlowProvider>
              </ContactProvider>
            </ProfileProvider>
          </MessagesProvider>
        </PhoneNumberProvider>
      </UserProvider>
    </TanStackQueryProvider>
  );
}
