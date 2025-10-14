import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // SSR hatasını engellemek için

  return (
    <button
      type="button"
      
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 border rounded cursor-pointer "
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
