import { useApp } from "@/contexts/AppContext";
import { debugLog } from "@/helpers";
import { onServerReady } from "@/services/webcontainer";
import { useEffect } from "react";

export function Preview() {
  const { previewURL, setPreviewURL } = useApp();

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
      debugLog("Error starting dev server:", error);
    }
  }

  return (
    <div className="flex flex-col size-full select-none">
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
