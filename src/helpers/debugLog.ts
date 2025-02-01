export function debugLog(...args: any[]) {
  const date = new Date();
  const formattedDate = date.toISOString().split("T")[0]; // yyyy-mm-dd
  const formattedTime = date.toTimeString().split(" ")[0]; // HH:MM:SS

  const processArg = (arg: any): string => {
    if (typeof arg === "string") {
      return arg;
    } else if (arg instanceof Error) {
      return `${arg.message}`;
    } else if (typeof arg === "object") {
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    }
    return String(arg);
  };

  const logMessage = args.map(processArg).join(" ");

  window.dispatchEvent(
    new CustomEvent("appDebug", {
      detail: `[${formattedDate} ${formattedTime}] ${logMessage}`,
    })
  );
}
