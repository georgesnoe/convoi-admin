import {
  IconAlertCircle,
  IconArrowDown,
  IconArrowUp,
  IconChartBar,
  IconCircleCheck,
  IconClock,
  IconDots,
  IconFileText,
  IconHome,
  IconLayoutGrid,
  IconLogout,
  IconMessageCircle,
  IconNotification,
  IconSearch,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useEffect, useState, type ReactElement } from "react";
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
  Progress,
  ProgressLabel,
  ProgressValue,
} from "../components/ui/progress";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";

const navItems = [
  {
    label: "Tableau de bord",
    icon: IconHome,
    active: true,
  },
  {
    label: "Projects",
    icon: IconLayoutGrid,
    active: false,
  },
  {
    label: "Analyses",
    icon: IconChartBar,
    active: false,
  },
  {
    label: "Team",
    icon: IconUser,
    active: false,
  },
  {
    label: "Settings",
    icon: IconSettings,
    active: false,
  },
];

const navCommands = [
  ...navItems.map((item) => ({
    label: `Go to ${item.label}`,
    icon: item.icon,
  })),
];

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

const stats = [
  { label: "Total revenue", value: "$48,240", delta: "+12.5%", positive: true },
  { label: "Active users", value: "8,941", delta: "+4.3%", positive: true },
  { label: "Conversion", value: "3.24%", delta: "-0.8%", positive: false },
];

const currentUser = {
  name: "Georges-Noé",
  initials: "GN",
  email: "georges@gmail.com",
  avatar: "https://i.pravatar.cc/150?img=12",
};

const activity = [
  {
    id: 1,
    user: "Sofia Reyes",
    initials: "SR",
    avatar: "https://i.pravatar.cc/150?img=45",
    action: "Closed issue",
    target: "Payment gateway timeout",
    time: "2 Min Ago",
    icon: IconCircleCheck,
  },
  {
    id: 2,
    user: "James Okafor",
    initials: "JO",
    avatar: "https://i.pravatar.cc/150?img=33",
    action: "Updated report",
    target: "Q2 Revenue Summary",
    time: "18 Min Ago",
    icon: IconFileText,
  },
  {
    id: 3,
    user: "Mia Chen",
    initials: "MC",
    avatar: "https://i.pravatar.cc/150?img=20",
    action: "Scheduled review",
    target: "Infrastructure audit",
    time: "1 Hour Ago",
    icon: IconClock,
  },
  {
    id: 4,
    user: "Daniel Park",
    initials: "DP",
    avatar: "https://i.pravatar.cc/150?img=53",
    action: "Closed issue",
    target: "Dashboard cache miss",
    time: "3 Hours Ago",
    icon: IconCircleCheck,
  },
];

const projects = [
  { name: "Horizon Rebrand", progress: 72, status: "On Track" },
  { name: "API v3 Migration", progress: 38, status: "At Risk" },
  { name: "Mobile App Launch", progress: 91, status: "On Track" },
];

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
                ]
                  .filter(Boolean)
                  .join(" ")}
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
}: {
  trigger: ReactElement;
  align?: "start" | "end";
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent align={align} className="w-44">
        <div className="flex flex-col gap-0.5 px-2 py-1.5">
          <p className="truncate text-xs font-semibold text-foreground">
            {currentUser.name}
          </p>
          <p className="truncate text-[10px] text-muted-foreground">
            {currentUser.email}
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
        <DropdownMenuItem variant="destructive">
          <IconLogout aria-hidden="true" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Dashboard() {
  const [commandOpen, setCommandOpen] = useState(false);

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
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      isActive={item.active}
                      tooltip={item.label}
                      render={<a href="#" />}
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
              <AvatarImage
                src={currentUser.avatar}
                alt={currentUser.name}
                className="grayscale"
              />
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
            <span className="text-xs text-muted-foreground">Acme</span>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-xs font-semibold">Dashboard</span>
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
              trigger={
                <button
                  type="button"
                  className="cursor-pointer rounded-lg outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
                  aria-label="Account menu"
                >
                  <Avatar className="size-8 ring-1 ring-border ring-offset-1 ring-offset-background transition-opacity hover:opacity-80">
                    <AvatarImage
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="grayscale"
                    />
                    <AvatarFallback>{currentUser.initials}</AvatarFallback>
                  </Avatar>
                </button>
              }
            />
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-bold tracking-tight">
                Welcome back, Alex
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Here&apos;s what&apos;s happening across your workspace today.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="hidden shrink-0 sm:flex"
            >
              Export Report
            </Button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {stats.map((card) => (
              <div
                key={card.label}
                className="rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {card.label}
                  </p>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-semibold tabular-nums ${
                      card.positive
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {card.positive ? (
                      <IconArrowUp className="size-3" aria-hidden="true" />
                    ) : (
                      <IconArrowDown className="size-3" aria-hidden="true" />
                    )}
                    {card.delta}
                  </span>
                </div>
                <p className="mt-2.5 text-2xl font-bold tracking-tight tabular-nums">
                  {card.value}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Vs. Last Month
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-5">
            <div className="overflow-hidden rounded-lg border border-border bg-card lg:col-span-3">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-semibold">Recent activity</p>
                <Button
                  nativeButton={false}
                  variant="ghost"
                  className="h-auto px-0 py-0 text-xs text-muted-foreground hover:text-foreground"
                  render={<a href="#" />}
                >
                  View All
                </Button>
              </div>
              <ul className="divide-y divide-border">
                {activity.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                  >
                    <Avatar className="mt-0.5 size-7 shrink-0">
                      <AvatarImage
                        src={item.avatar}
                        alt={item.user}
                        className="grayscale"
                      />
                      <AvatarFallback className="text-[10px]">
                        {item.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs">
                        <span className="font-semibold">{item.user}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          {item.action}{" "}
                        </span>
                        <span className="font-medium">{item.target}</span>
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {item.time}
                      </p>
                    </div>
                    <item.icon
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-card lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-semibold">Active projects</p>
                <Button
                  nativeButton={false}
                  variant="ghost"
                  className="h-auto px-0 py-0 text-xs text-muted-foreground hover:text-foreground"
                  render={<a href="#" />}
                >
                  View All
                </Button>
              </div>
              <ul className="divide-y divide-border">
                {projects.map((project) => {
                  const atRisk = project.status !== "On Track";
                  return (
                    <li
                      key={project.name}
                      className="px-4 py-3.5 transition-colors hover:bg-muted/40"
                    >
                      <Progress value={project.progress} className="gap-2">
                        <div className="flex w-full items-center justify-between gap-2">
                          <ProgressLabel className="truncate text-xs font-semibold text-foreground">
                            {project.name}
                          </ProgressLabel>
                          {atRisk ? (
                            <Badge
                              variant="outline"
                              className="shrink-0 text-[10px] text-muted-foreground"
                            >
                              {project.status}
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="shrink-0 text-[10px]"
                            >
                              {project.status}
                            </Badge>
                          )}
                          <ProgressValue className="ml-0 w-8 shrink-0 text-right text-[11px]" />
                        </div>
                      </Progress>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
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
                  onSelect={() => setCommandOpen(false)}
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
