import { useAuth } from "@/app/auth/auth-context";
import { usePathname } from "next/navigation";

import { Book, BookUser, LogOut, Settings, User, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const auth = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="m-2">
                <ThemeToggle />
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {auth?.user?.isAdmin && (
                <Link
                  href="/app/admin-user-management"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive("/app/admin-user-management")
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <BookUser className="mr-2 h-4 w-4" />
                  User Management
                </Link>
              )}
              <Link
                href="/app/questions"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/app/questions")
                    ? "border-primary"
                    : "border-transparent"
                }`}
              >
                <Book className="mr-2 h-4 w-4" />
                Questions
              </Link>
              <Link
                href="/app/matching"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/app/matching")
                    ? "border-primary"
                    : "border-transparent"
                }`}
              >
                <Users className="mr-2 h-4 w-4" />
                Matching
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-5 w-5 fill-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    // TODO: Make page path app/user-settings instead of app/user-settings/:id
                    href={`/app/user-settings/${auth?.user?.id}`}
                    className="flex items-center"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={auth?.logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="inline-flex items-center justify-center p-2 rounded-md text-foreground/60 hover:text-foreground/80 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {auth?.user?.isAdmin && (
                  <DropdownMenuItem>
                    <Link
                      href="/app/admin-user-management"
                      className="flex items-center"
                    >
                      <BookUser className="mr-2 h-4 w-4" />
                      <span>User Management</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Link href="/app/questions" className="flex items-center">
                    <Book className="mr-2 h-4 w-4" />
                    <span>Questions</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/app/matching" className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Matching</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    // TODO: Make page path app/user-settings instead of app/user-settings/:id
                    href={`/app/user-settings/${auth?.user?.id}`}
                    className="flex items-center"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={auth?.logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
