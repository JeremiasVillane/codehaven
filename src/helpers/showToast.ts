import { Toast } from "primereact/toast";

export function showToast(
  toast: React.MutableRefObject<Toast>,
  detail: string,
  severity: "success" | "info" | "warn" | "error" = "info"
) {
  toast.current?.show({ severity, summary: severity.toUpperCase(), detail });
}
