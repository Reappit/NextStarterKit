'use client';

import type { ForwardedRef } from 'react';

import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  AdmonitionDirectiveDescriptor,
  codeBlockPlugin,
  codeMirrorPlugin,
  directivesPlugin,
  frontmatterPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  tablePlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import EditorToolbar from '@/src/EditorToolbar';

const editorPlugins = () => [
  toolbarPlugin({
    toolbarContents: () => <EditorToolbar onSave={() => {}} />,
  }),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
  quotePlugin(),
  listsPlugin(),
  thematicBreakPlugin(),
  linkPlugin(),
  linkDialogPlugin(),
  // imagePlugin({
  //   imageUploadHandler,
  // }),
  tablePlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: 'ts' }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      ts: 'TypeScript',
      js: 'JavaScript',
      css: 'CSS',
      txt: 'text',
    },
  }),
  directivesPlugin({
    directiveDescriptors: [AdmonitionDirectiveDescriptor],
  }),
  markdownShortcutPlugin(),
  frontmatterPlugin(),
];

function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[...editorPlugins()]}
      {...props}
      ref={editorRef}
      contentEditableClassName="prose"
      className="editor-root mt-[1.19em] w-full"
    />
  );
}

export default InitializedMDXEditor;
