"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Aperture,
  Building2,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export type NavUser = { name: string; email?: string; image?: string };

const links = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/add-studio", label: "Add Studio" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about", label: "About Us" },
];

const accountLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/studios/new", label: "Add New Studio", icon: Plus },
  { href: "/dashboard/studios", label: "My Studio Listings", icon: Building2 },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
];

const subscribeHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};
const getHash = () => window.location.hash;
const getServerHash = () => "";

function isActive(href: string, pathname: string, hash: string) {
  if (href.startsWith("/#")) return pathname === "/" && hash === href.slice(1);
  if (href === "/") return pathname === "/" && hash === "";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function linkClass(active: boolean, extra?: string) {
  return cn(
    "relative text-sm transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-foreground after:transition-transform after:duration-300",
    active
      ? "text-foreground after:scale-x-100"
      : "text-muted-foreground after:origin-left after:scale-x-0 hover:text-foreground hover:after:scale-x-100",
    extra,
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function UserAvatar({
  user,
  size = "sm",
}: {
  user: NavUser;
  size?: "sm" | "default";
}) {
  return (
    <Avatar size={size}>
      {user.image && <AvatarImage src={user.image} alt={user.name} />}
      <AvatarFallback>{initials(user.name)}</AvatarFallback>
    </Avatar>
  );
}

export function Navbar({
  user,
  onLogout,
}: {
  user?: NavUser | null;
  onLogout?: () => void;
}) {
  const pathname = usePathname();
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-foreground"
        >
          <Aperture className="size-5" strokeWidth={1.5} />
          <span className="text-base font-semibold tracking-tight">
            StudioSpace
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(isActive(link.href, pathname, hash), "py-1")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Account menu"
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full"
                  />
                }
              >
                <UserAvatar user={user} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2 py-1.5">
                    <p className="text-sm font-medium text-foreground">
                      {user.name}
                    </p>
                    {user.email && (
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {accountLinks.map(({ href, label, icon: Icon }) => (
                  <DropdownMenuItem key={href} render={<Link href={href} />}>
                    <Icon />
                    {label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-1.5 md:flex">
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Log in
              </Link>
              <Link href="/register" className={buttonVariants({ size: "sm" })}>
                Register
              </Link>
            </div>
          )}

          <Sheet>
            <SheetTrigger
              aria-label="Open menu"
              className="md:hidden"
              render={<Button variant="ghost" size="icon-sm" />}
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 sm:max-w-xs">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <SheetDescription className="sr-only">
                Browse StudioSpace
              </SheetDescription>
              <nav className="flex flex-col gap-2 pt-10" aria-label="Mobile">
                {links.map((link) => (
                  <SheetClose
                    key={link.href}
                    nativeButton={false}
                    render={
                      <Link
                        href={link.href}
                        className={linkClass(
                          isActive(link.href, pathname, hash),
                          "py-2 text-base",
                        )}
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-4 pb-2">
                <Separator />
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-1">
                      <UserAvatar user={user} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {user.name}
                        </p>
                        {user.email && (
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <nav className="flex flex-col gap-1" aria-label="Account">
                      {accountLinks.map(({ href, label, icon: Icon }) => (
                        <SheetClose
                          key={href}
                          nativeButton={false}
                          render={
                            <Link
                              href={href}
                              className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            />
                          }
                        >
                          <Icon />
                          {label}
                        </SheetClose>
                      ))}
                    </nav>
                    <Button
                      variant="ghost"
                      className="justify-start gap-2"
                      onClick={onLogout}
                    >
                      <LogOut />
                      Log out
                    </Button>
                  </>
                ) : (
                  <div className="grid gap-2">
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link href="/register" className={buttonVariants()} />
                      }
                    >
                      Register
                    </SheetClose>
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/login"
                          className={buttonVariants({ variant: "outline" })}
                        />
                      }
                    >
                      Log in
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
