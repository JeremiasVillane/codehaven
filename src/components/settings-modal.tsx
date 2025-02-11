import { useApp } from "@/contexts";
import {
  getEditorSettings,
  persistSettings,
} from "@/layout/middle-panel/code-editor-helpers";
import { EditorSettings } from "@/types";
import { deepEqual } from "@/utils";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { useEffect, useState } from "react";

export function SettingsModal({ settings }: { settings: EditorSettings }) {
  const { showSettingsModal, setShowSettingsModal } = useApp();
  const [localSettings, setLocalSettings] = useState<EditorSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleNumberChange = (field: keyof EditorSettings, value: string) => {
    const numValue =
      field === "lineHeight" ? parseFloat(value) : parseInt(value);
    if (!isNaN(numValue)) {
      setLocalSettings((prev) => ({ ...prev, [field]: numValue }));
    }
  };

  const handleToggleChange = (field: keyof EditorSettings) => {
    setLocalSettings((prev) => ({
      ...prev,
      [field]: prev[field] === "on" ? "off" : "on",
    }));
  };

  const handleSave = () => {
    persistSettings(localSettings);
    const detail = { persistStorage: localSettings.persistStorage };
    window.dispatchEvent(new CustomEvent("persistStorageChange", { detail }));

    window.dispatchEvent(
      new CustomEvent("editorSettingsChange", { detail: localSettings })
    );
    setShowSettingsModal(false);
  };

  return (
    <Dialog
      header={
        <header>
          <div className="flex items-center gap-2.5 text-foreground">
            <i className="pi pi-cog text-lg" />
            Settings
          </div>
        </header>
      }
      headerClassName="p-3 bg-sidebar-background"
      visible={showSettingsModal}
      onHide={() => {
        if (!showSettingsModal) return;
        setShowSettingsModal(false);
      }}
      resizable={false}
      className="w-[90vw] md:w-[26rem]"
    >
      <article>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Editor</h3>
            <div className="grid gap-4 text-muted-foreground">
              <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="fontSize">Font Size</label>
                <InputText
                  id="fontSize"
                  type="number"
                  min={8}
                  max={32}
                  value={String(localSettings.fontSize)}
                  onChange={(e) =>
                    handleNumberChange("fontSize", e.target.value)
                  }
                  className="col-span-2"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="lineHeight">Line Height</label>
                <InputText
                  id="lineHeight"
                  type="number"
                  min={1}
                  max={2}
                  step={0.1}
                  value={String(localSettings.lineHeight)}
                  onChange={(e) =>
                    handleNumberChange("lineHeight", e.target.value)
                  }
                  className="col-span-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="wordWrap">Word Wrap</label>
                <SelectButton
                  id="wordWrap"
                  value={localSettings.wordWrap}
                  onChange={() => handleToggleChange("wordWrap")}
                  options={["on", "off"]}
                  className="custom-select"
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="minimap">Minimap</label>
                <SelectButton
                  id="minimap"
                  value={localSettings?.minimap?.enabled ? "on" : "off"}
                  onChange={(e) => {
                    setLocalSettings((prev) => ({
                      ...prev,
                      minimap: { enabled: e.value === "on" },
                    }));
                  }}
                  options={["on", "off"]}
                  className="custom-select"
                />
              </div>
            </div>
          </div>

          <div className="bg-tertiary/10 h-0.5" />

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Application</h3>
            {Object.entries({
              persistStorage: "Persist files using IndexedDB",
              autoLoadExample: "Auto load example project",
              autoRunStartupScript: "Auto run startup script on load",
            }).map(([setting, desc], idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-muted-foreground"
              >
                <label htmlFor={setting} className="w-2/3">
                  {desc}
                </label>
                <SelectButton
                  id={setting}
                  value={localSettings[setting]}
                  onChange={() =>
                    handleToggleChange(setting as keyof EditorSettings)
                  }
                  options={["on", "off"]}
                  className="custom-select"
                />
              </div>
            ))}
          </div>
        </div>

        <footer className="flex items-center gap-3 mt-3">
          <Button
            className="secondary-button"
            onClick={() => setShowSettingsModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="primary-button"
            onClick={handleSave}
            disabled={deepEqual(localSettings, getEditorSettings())}
          >
            Save changes
          </Button>
        </footer>
      </article>
    </Dialog>
  );
}
