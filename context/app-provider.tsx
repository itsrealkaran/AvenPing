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

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <TanStackQueryProvider>
      <UserProvider>
        <MessagesProvider>
          <ProfileProvider>
            <ContactProvider>
              <FlowProvider>
                <TemplateProvider>
                  <CampaignProvider>
                    <NotificationProvider>
                      {children}
                    </NotificationProvider>
                  </CampaignProvider>
                </TemplateProvider>
              </FlowProvider>
            </ContactProvider>
          </ProfileProvider>
        </MessagesProvider>
      </UserProvider>
    </TanStackQueryProvider>
  );
}
