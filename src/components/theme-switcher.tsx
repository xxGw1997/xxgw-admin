import { useTheme } from "./theme-provider";
import { SunIcon, MoonIcon } from "lucide-react";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div onClick={toggleTheme} className="cursor-pointer">
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </div>
  );
};

export default ThemeSwitcher;
