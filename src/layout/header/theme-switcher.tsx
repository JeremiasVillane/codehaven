import { useTheme } from "@/hooks";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="flex border-1 p-1 px-1.5 md:px-3 align-center justify-center focus-visible:outline-[#b1b3f8]"
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
