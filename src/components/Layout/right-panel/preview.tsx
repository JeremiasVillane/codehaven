export function Preview({ previewURL }: { previewURL: string }) {
  return (
    <div className="flex flex-col size-full select-none overflow-y-auto">
      <iframe
        src={previewURL}
        className="w-full h-full border-none"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
}
