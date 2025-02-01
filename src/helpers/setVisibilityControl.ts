export function setVisibilityControl(
  panelStyle: string,
  visible: boolean,
  isMobile: boolean
) {
  const styleId = `visibilityControl-${panelStyle}`;
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  const overrideStyles =
    visible && isMobile
      ? `
    width: 100vw !important;
    height: 100vh !important;
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    margin: 0 !important;
  `
      : "";

  styleEl.innerHTML = `
    .dock-panel.dock-style-${panelStyle} {
      display: ${visible ? "unset" : "none"} !important;
      ${overrideStyles}
    }
  `;
}
