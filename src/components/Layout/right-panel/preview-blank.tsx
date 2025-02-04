export function PreviewBlank() {
  return (
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
  );
}
