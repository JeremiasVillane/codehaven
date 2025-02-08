import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function CollaborationLinkButton() {
  const [collabLink, setCollabLink] = useState<string>("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    let room = searchParams.get("room");

    if (!room) {
      room = uuidv4();
      searchParams.set("room", room);

      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.replaceState(null, "", newUrl);
    }

    setCollabLink(window.location.href);
  }, []);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(collabLink);
      alert("¡Link copiado al portapapeles!");
    } catch (error) {
      alert("Error al copiar el link");
    }
  };

  return (
    <button onClick={handleCopyClick}>
      {collabLink
        ? "Copiar link de colaboración"
        : "Generar link de colaboración"}
    </button>
  );
}
