'use client';

import { Editor } from '@workspace/next-blog/*';
import { Suspense } from 'react';

export default function EditorPage() {
  return (
    <Suspense>
      <Editor />
    </Suspense>
  );
}
