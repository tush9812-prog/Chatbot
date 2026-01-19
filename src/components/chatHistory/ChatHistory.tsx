import "./ChatHistory.css";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  // Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarProvider } from "../ui/sidebar";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";

export const ChatHistory = ({ loader, setLoader, messages, setMessages }) => {
  if (messages.length > 0) {
    return (
      <div className="sidebar">
        <ScrollArea className="h-full w-full rounded-md border p-4">
          <Component messages={messages}></Component>
        </ScrollArea>
      </div>
    );
  }
  return (
    <ScrollArea className="h-full w-full rounded-md border p-4">
      <Sidebar aria-label="Default sidebar example">
        <SidebarItems>
          <SidebarItemGroup>
            <SidebarItem href="#">
              <div className="h-full default-container">
                <h1>Quote of the Day</h1>
              </div>
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>
      </Sidebar>
    </ScrollArea>
  );
};

export function Component({ messages }) {
  return (
    <Sidebar aria-label="Default sidebar example">
      <SidebarItems>
        <SidebarItemGroup>
          {messages.length > 0 &&
            messages.map((item, index) =>
              item.role === "User" ? (
                <SidebarItem href="#">
                  <li key={index}>
                    <div className="prompt">
                      {index + 1} {item.prompt}
                    </div>
                  </li>
                </SidebarItem>
              ) : null,
            )}
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
