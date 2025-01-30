import { onServerReady, runCommand } from "@/services/webcontainer";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";

export function Preview() {
  const [previewURL, setPreviewURL] = useState<string>("");

  useEffect(() => {
    startDevServer();
  }, []);

  async function startDevServer() {
    try {
      onServerReady((port, url) => {
        console.log(`Server is ready on port ${port}, URL = ${url}`);
        setPreviewURL(url);
      });

      // const devProc = await runCommand("npm", ["run", "dev"]);

      // devProc?.output.pipeTo(
      //   new WritableStream({
      //     write(data) {
      //       console.log("[DEV LOG]", data);
      //     },
      //   })
      // );
    } catch (error) {
      console.error("Error starting dev server:", error);
    }
  }

  return (
    <div className="flex flex-col size-full select-none">
      <section className="flex gap-3 px-6 py-2 justify-between items-center bg-topbar-background text-topbar-foreground text-sm border-b border-border h-9 select-none">
        <InputText
          value={previewURL ?? ""}
          className="h-6 rounded-sm w-full"
          disabled
        />
        <Button text className="rounded-none" disabled={previewURL.length < 1}>
          <i
            className="pi pi-times hover:text-indigo-400"
            onClick={() => setPreviewURL("")}
          ></i>
        </Button>
      </section>
      {previewURL ? (
        <iframe
          src={previewURL}
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
        />
      ) : (
        <div className="bg-preview-background size-full flex flex-col items-center gap-6">
          <img
            src="/codehaven-full.png"
            width="50%"
            className="mx-auto mt-[20%] grayscale opacity-50 dark:invert"
            draggable={false}
          />

          <section>
            <div className="text-tertiary">Developed by: Jeremias Villane</div>
          </section>
        </div>
      )}
    </div>
  );
}
