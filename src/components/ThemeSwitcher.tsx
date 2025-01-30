import { useTheme } from "@/hooks/use-theme";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="flex border-1 p-0 align-center justify-center"
      onClick={toggleTheme}
      title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      <i
        className={`dark:text-white text-gray-600 hover:text-indigo-600 pi ${
          theme === "light" ? "pi-moon" : "pi-sun"
        }`}
      />
    </button>
  );
};

export default ThemeSwitcher;
