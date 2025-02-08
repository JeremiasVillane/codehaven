import { getAppContext } from "@/contexts";
import { boilerplateLoader } from "@/helpers";
import { getEditorSettings } from "@/layout/middle-panel/code-editor-helpers";

export const handleSelectTemplate = async (templateId: string) => {
  const { autoRunStartupScript } = getEditorSettings();

  getAppContext().setShowTemplateModal(false);
  if (autoRunStartupScript === "on") getAppContext().setActivePanel("preview");

  await boilerplateLoader(templateId);
};
