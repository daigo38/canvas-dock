import { AppShell } from "@/components/app/AppShell";
import { readGlobalConfig, listProjects } from "@/lib/config";
import { THEMES } from "@/lib/themes";
import { SettingsForm } from "./SettingsForm";
import { ProjectsList } from "./ProjectsList";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [config, projects] = await Promise.all([readGlobalConfig(), listProjects()]);

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Settings</h1>
      <p className="text-sm text-muted-foreground mb-8">Global defaults and project overrides.</p>

      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Global</h2>
        <SettingsForm config={config} themes={THEMES} />
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Projects</h2>
        <ProjectsList projects={projects} themes={THEMES} />
      </section>
    </AppShell>
  );
}
