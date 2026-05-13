import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../lib/ThemeProvider";
import { Button } from "./button";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}
