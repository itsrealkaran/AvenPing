"use client";

import { ReactNode } from "react";
import { UserProvider } from "./user-context";
import { MessagesProvider } from "./messages-context";
import { ProfileProvider } from "./profile-provider";
import { Providers as TanStackQueryProvider } from "@/lib/providers";
import { ContactProvider } from "./contact-provider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <TanStackQueryProvider>
      <UserProvider>
        <MessagesProvider>
          <ProfileProvider>
            <ContactProvider>{children}</ContactProvider>
          </ProfileProvider>
        </MessagesProvider>
      </UserProvider>
    </TanStackQueryProvider>
  );
}
