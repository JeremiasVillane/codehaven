import { useWebContainer } from "@/contexts";
import { useEffect, useState } from "react";

export function PreviewBlank() {
  const { isBooted, isPopulated, isInstalled, error } = useWebContainer();
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    const handleShowSeeding = () => setShowProgress(true);
    window.addEventListener("seeding", handleShowSeeding);

    return () => {
      window.removeEventListener("seeding", handleShowSeeding);
    };
  }, []);

  const container: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1.4fr 0.6fr",
    gridTemplateRows: "1fr 1fr 1fr",
    gap: "0 0",
    gridAutoFlow: "row",
  };

  return (
    <div className="bg-preview-background size-full flex flex-col items-center gap-6">
      <img
        src="/codehaven-full.png"
        width="50%"
        className="mx-auto mt-[20%] grayscale opacity-50 dark:invert"
        draggable={false}
      />

      <div className="bg-tertiary/10 h-0.5 w-[75%]" />

      {error ? (
        <section className="text-red-500">
          <strong>Error:</strong> {error}
        </section>
      ) : (
        <section
          className="text-tertiary-foreground text-right"
          style={container}
        >
          <article className="text-sm md:text-base">
            <div>WebContainer initialized:</div>
            {showProgress && (
              <>
                <div>Loading project:</div>
                <div>Initializing project:</div>
              </>
            )}
          </article>

          <article>
            {[
              isBooted,
              ...(showProgress ? [isPopulated, isInstalled] : []),
            ].map((ele, idx) => (
              <div key={idx}>
                {ele ? (
                  <i className="pi pi-check-circle text-sm md:text-base text-green-600" />
                ) : (
                  <i className="pi pi-spin pi-cog text-sm md:text-base text-indigo-600" />
                )}
              </div>
            ))}
          </article>
        </section>
      )}
    </div>
  );
}
