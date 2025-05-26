'use client';

import dynamic from 'next/dynamic';
import '@workspace/next-blog/styles.css';
import { Suspense } from 'react';

const EditorComp = dynamic(() => import('@workspace/next-blog/editor'), {
  ssr: false,
});

export default function EditorPage() {
  return (
    <div className="h-[1000px] bg-white">
      <Suspense fallback={null}>
        <EditorComp markdown={''} />
      </Suspense>
    </div>
  );
}
