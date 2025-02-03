export function Preview({ previewURL }: { previewURL: string }) {
  // const { previewURL, setPreviewURL } = useApp();

  // useEffect(() => {
  //   startDevServer();
  // }, []);

  // async function startDevServer() {
  //   try {
  //     webContainerService.onServerReady((_port, url) => {
  //       setPreviewURL(url);
  //     });
  //   } catch (error) {
  //     debugLog("[PREVIEW] Error starting dev server:", error);
  //   }
  // }

  return (
    <div className="flex flex-col size-full select-none overflow-y-auto">
      {previewURL ? (
        <iframe
          src={previewURL}
          className="w-full h-full border-none"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
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
