import { useEffect } from "react";

export default function ThemeScript() {
  useEffect(() => {
    try {
      const mode = localStorage.getItem("darkMode");
      if (
        mode === "true" ||
        (mode === null &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
      }
    } catch (e) {}
  }, []);

  return null;
}
