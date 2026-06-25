import ClientClassroom from "./ClientClassroom";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ClientClassroom roomId={resolvedParams.id} />;
}
