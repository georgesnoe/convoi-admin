import {
  IconAlertCircle,
  IconCalendar,
  IconCar,
  IconCircleCheck,
  IconDots,
  IconHome,
  IconLogout,
  IconMessageCircle,
  IconNotification,
  IconRoute,
  IconSearch,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useEffect, useState, type ReactElement } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import { Logo } from "../components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Kbd, KbdGroup } from "../components/ui/kbd";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import { signOut, getMe } from "../lib/api";
import { useFetch } from "../hooks/use-fetch";
import type { User } from "../lib/types";

const navItems = [
  { label: "Tableau de bord", icon: IconHome, to: "/dashboard" },
  { label: "Utilisateurs", icon: IconUser, to: "/dashboard/users" },
  { label: "Véhicules", icon: IconCar, to: "/dashboard/vehicles" },
  { label: "Trajets", icon: IconRoute, to: "/dashboard/trips" },
  {
    label: "Réservations",
    icon: IconCalendar,
    to: "/dashboard/reservations",
  },
  { label: "Messages", icon: IconMessageCircle, to: "/dashboard/messages" },
];

const navCommands = navItems.map((item) => ({
  label: `Go to ${item.label}`,
  icon: item.icon,
  to: item.to,
}));

const actionCommands = [
  {
    label: "Invite a teammate",
    icon: IconUser,
  },
  {
    label: "View notifications",
    icon: IconNotification,
  },
];

type DisplayUser = {
  name: string;
  email: string;
  avatar?: string;
  initials: string;
};

function getInitials(name?: string | null) {
  if (!name?.trim()) return "…";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase() || "…";
}

function resolveUser(payload: unknown): User | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  const candidates = [obj.user, obj.data, obj.me, payload];
  for (const candidate of candidates) {
    if (
      candidate &&
      typeof candidate === "object" &&
      typeof (candidate as Record<string, unknown>).email === "string"
    ) {
      return candidate as User;
    }
  }
  return null;
}

function useDisplayUser(): DisplayUser {
  const { data } = useFetch<unknown>(getMe);
  const user = resolveUser(data);
  return {
    name: user?.name ?? "Chargement…",
    email: user?.email ?? "",
    avatar: user?.image ?? undefined,
    initials: getInitials(user?.name),
  };
}

const initialNotifications = [
  {
    id: 1,
    icon: IconMessageCircle,
    title: "Sofia Reyes commented on Payment gateway timeout",
    time: "2 Min Ago",
    unread: true,
  },
  {
    id: 2,
    icon: IconCircleCheck,
    title: "Deploy to production succeeded",
    time: "1 Hour Ago",
    unread: true,
  },
  {
    id: 3,
    icon: IconAlertCircle,
    title: "API v3 Migration was flagged at risk",
    time: "3 Hours Ago",
    unread: false,
  },
];

function NotificationsMenu() {
  const [items, setItems] = useState(initialNotifications);
  const unread = items.filter((n) => n.unread).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline" size="icon" className="relative" />}
        aria-label="Notifications"
      >
        <IconNotification aria-hidden="true" />
        {unread > 0 && (
          <span
            className="absolute top-1 right-1 size-1.5 bg-primary"
            aria-hidden="true"
          />
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[320px] gap-0 p-0"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight">
              Notifications
            </span>
            {unread > 0 && (
              <Badge
                variant="secondary"
                className="h-5 px-1.5 text-[10px] font-medium"
              >
                {unread} New
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="xs"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={markAllRead}
            disabled={unread === 0}
          >
            Mark all read
          </Button>
        </div>

        <Separator />

        <ul className="flex flex-col">
          {items.map((item, index) => (
            <li key={item.id}>
              <div
                className={[
                  "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40",
                  item.unread ? "bg-muted/30" : "",
                ].join(" ")}
              >
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <item.icon className="size-3.5" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p
                    className={[
                      "text-xs leading-snug",
                      item.unread
                        ? "font-medium text-foreground"
                        : "text-foreground/80",
                    ].join(" ")}
                  >
                    {item.title}
                  </p>
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {item.time}
                  </span>
                </div>
                {item.unread && (
                  <span
                    className="mt-1 size-1.5 shrink-0 bg-primary"
                    role="img"
                    aria-label="Unread"
                  />
                )}
              </div>
              {index < items.length - 1 && <Separator />}
            </li>
          ))}
        </ul>

        <Separator />

        <div className="px-4 py-2.5 text-center">
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            render={<a href="#" />}
            nativeButton={false}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function UserMenu({
  trigger,
  align = "start",
  user,
}: {
  trigger: ReactElement;
  align?: "start" | "end";
  user: DisplayUser;
}) {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent align={align} className="w-44">
        <div className="flex flex-col gap-0.5 px-2 py-1.5">
          <p className="truncate text-xs font-semibold text-foreground">
            {user.name}
          </p>
          <p className="truncate text-[10px] text-muted-foreground">
            {user.email}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <IconUser aria-hidden="true" />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconSettings aria-hidden="true" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={async () => {
            try {
              await signOut();
            } finally {
              navigate("/sign-in", { replace: true });
            }
          }}
        >
          <IconLogout aria-hidden="true" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [commandOpen, setCommandOpen] = useState(false);
  const currentUser = useDisplayUser();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const current = navItems.find((item) => location.pathname === item.to);

  return (
    <SidebarProvider defaultOpen className="min-h-svh">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex h-10 items-center gap-2.5 px-2">
            <Logo className="size-5 shrink-0 text-foreground" />
            <span className="font-bold tracking-tight group-data-[collapsible=icon]:hidden">
              Convoi
            </span>
            <Badge
              variant="secondary"
              className="ml-auto px-1.5 py-0 text-[10px] font-medium group-data-[collapsible=icon]:hidden"
            >
              Pro
            </Badge>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      isActive={location.pathname === item.to}
                      tooltip={item.label}
                      render={<NavLink to={item.to} />}
                    >
                      <item.icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center gap-2.5 p-1">
            <Avatar className="size-7">
              {currentUser.avatar && (
                <AvatarImage
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="grayscale"
                />
              )}
              <AvatarFallback>{currentUser.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-xs leading-none font-semibold">
                {currentUser.name}
              </p>
              <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                {currentUser.email}
              </p>
            </div>
            <UserMenu
              user={currentUser}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 shrink-0 group-data-[collapsible=icon]:hidden"
                  aria-label="More options"
                >
                  <IconDots aria-hidden="true" />
                </Button>
              }
            />
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b border-border px-4 sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Convoi</span>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-xs font-semibold">
              {current?.label ?? "Dashboard"}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="hidden h-8 w-56 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs text-muted-foreground transition-colors hover:bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:outline-none sm:inline-flex"
            >
              <IconSearch className="size-4 shrink-0" aria-hidden="true" />
              <span className="flex-1 text-left">Search…</span>
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </button>
            <NotificationsMenu />
            <UserMenu
              align="end"
              user={currentUser}
              trigger={
                <button
                  type="button"
                  className="cursor-pointer rounded-lg outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
                  aria-label="Account menu"
                >
                  <Avatar className="size-8 ring-1 ring-border ring-offset-1 ring-offset-background transition-opacity hover:opacity-80">
                    {currentUser.avatar && (
                      <AvatarImage
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="grayscale"
                      />
                    )}
                    <AvatarFallback>{currentUser.initials}</AvatarFallback>
                  </Avatar>
                </button>
              }
            />
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6">
          <Outlet />
        </div>
      </SidebarInset>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <Command>
          <CommandInput
            aria-label="Type a command or search"
            placeholder="Type a command or search…"
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              {navCommands.map((command) => (
                <CommandItem
                  key={command.label}
                  onSelect={() => {
                    setCommandOpen(false);
                    navigate(command.to);
                  }}
                >
                  <command.icon />
                  <span>{command.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Actions">
              {actionCommands.map((command) => (
                <CommandItem
                  key={command.label}
                  onSelect={() => setCommandOpen(false)}
                >
                  <command.icon />
                  <span>{command.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </SidebarProvider>
  );
}
