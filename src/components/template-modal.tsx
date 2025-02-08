import { TEMPLATES } from "@/constants";
import { useApp } from "@/contexts";
import { Dialog } from "primereact/dialog";
import { handleSelectTemplate } from "./template-modal-handlers";

export function TemplateModal() {
  const { showTemplateModal, setShowTemplateModal } = useApp();

  return (
    <Dialog
      headerClassName="p-3 bg-sidebar-background"
      visible={showTemplateModal}
      onHide={() => {
        if (!showTemplateModal) return;
        setShowTemplateModal(false);
      }}
      resizable={false}
    >
      <article className="sm:max-w-[900px] bg-sidebar-background">
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Choose a template
            </h2>
            <p className="text-muted-foreground">
              Select a template to bootstrap your new project
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="relative p-6 rounded-lg border bg-header-background transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                onClick={() => handleSelectTemplate(template.id)}
              >
                {template.icon}
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {template.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {template.tech.map((tech: string) => (
                    <span
                      key={tech}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      </article>
    </Dialog>
  );
}
