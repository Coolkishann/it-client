"use client";

import { Sun, Moon, Bell, Search, User, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useAuthStore } from "@/src/store/authStore";

export default function Topbar() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="flex h-20 items-center justify-between px-6 md:px-10 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
      
      {/* Search */}
      <div className="hidden md:flex w-full max-w-sm relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search..."
          className="pl-11 pr-4 py-2 bg-secondary/50 border-none focus:ring-2 focus:ring-primary/20 rounded-xl transition-all w-full"
        />
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Notifications */}
        {/* <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-primary hover:bg-secondary rounded-xl transition-all"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive animate-pulse" />
        </Button> */}

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-primary hover:bg-secondary rounded-xl transition-all"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 fill-current" />
          ) : (
            <Moon className="h-5 w-5 fill-current" />
          )}
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">

          <div className="text-right hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-foreground leading-none">
              {user?.name ?? "Guest"}
            </span>
            <span className="text-xs text-muted-foreground">
              {user?.role ?? "User"}
            </span>
          </div>

          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20 shadow-md">
            <User className="h-5 w-5" />
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-muted-foreground hover:text-destructive hover:bg-secondary rounded-xl transition-all"
          >
            <LogOut className="h-5 w-5" />
          </Button>

        </div>
      </div>
    </header>
  );
}