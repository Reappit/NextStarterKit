'use client';

import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorProps,
  AdmonitionDirectiveDescriptor,
  codeBlockPlugin,
  codeMirrorPlugin,
  directivesPlugin,
  frontmatterPlugin,
  linkDialogPlugin,
  linkPlugin,
  tablePlugin,
  // toolbarPlugin,
} from '@mdxeditor/editor';
// import EditorToolbar from '@/src/EditorToolbar';

const editorPlugins = () => [
  // toolbarPlugin({
  //   toolbarContents: () => <EditorToolbar onSave={() => {}} />,
  // }),
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

function InitializedMDXEditor(props: MDXEditorProps) {
  return (
    <MDXEditor
      plugins={editorPlugins()}
      {...props}
      contentEditableClassName="prose"
    />
  );
}

export default InitializedMDXEditor;
