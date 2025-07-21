'use client';

import { Editor } from '@reappit/blog/editor';
import { Suspense } from 'react';

export default function EditorPage() {
  return (
    <Suspense>
      <Editor />
    </Suspense>
  );
}
