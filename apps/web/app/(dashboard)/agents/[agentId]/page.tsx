export default async function AgentPlaceholderPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;

  return (
    <div className="w-full flex flex-col items-center justify-center p-24 text-center">
      <div className="w-16 h-16 bg-muted flex items-center justify-center rounded-xl mb-6">
        <span className="text-2xl font-bold text-muted-foreground capitalize">{agentId[0]}</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4 capitalize">
        {agentId} Agent Workspace
      </h1>
      <p className="text-muted-foreground max-w-md">
        This workspace is currently under construction. Please complete the {agentId} configuration
        setup to access this dashboard.
      </p>
    </div>
  );
}
