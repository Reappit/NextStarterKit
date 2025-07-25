import { Editor } from '@reappit/blog/editor';
import { Suspense } from 'react';

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id } = await searchParams;
  return (
    <Suspense>
      <Editor slugId={id} />
    </Suspense>
  );
}
