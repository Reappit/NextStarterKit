import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeAdmonitionType,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  type EditorInFocus,
  InsertAdmonition,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  Separator,
  ShowSandpackInfo,
  type DirectiveNode,
} from '@mdxeditor/editor';

function whenInAdmonition(editorInFocus: EditorInFocus | null) {
  const node = editorInFocus?.rootNode;
  if (!node || node.getType() !== 'directive') {
    return false;
  }

  return ['note', 'tip', 'danger', 'info', 'caution'].includes(
    (node as DirectiveNode).getMdastNode().name
  );
}

export default function EditorToolbar({ onSave }: { onSave: () => void }) {
  return (
    <ConditionalContents
      options={[
        {
          when: editor => editor?.editorType === 'codeblock',
          contents: () => <ChangeCodeMirrorLanguage />,
        },
        {
          when: editor => editor?.editorType === 'sandpack',
          contents: () => <ShowSandpackInfo />,
        },
        {
          fallback: () => (
            <>
              <BoldItalicUnderlineToggles />
              <CodeToggle />
              <Separator />
              <ListsToggle />
              <Separator />
              <ConditionalContents
                options={[
                  {
                    when: whenInAdmonition,
                    contents: () => <ChangeAdmonitionType />,
                  },
                  { fallback: () => <BlockTypeSelect /> },
                ]}
              />
              <Separator />
              <CreateLink />
              <InsertImage />
              <Separator />
              <InsertTable />
              <InsertThematicBreak />
              <Separator />
              <InsertCodeBlock />
              <ConditionalContents
                options={[
                  {
                    when: editorInFocus => !whenInAdmonition(editorInFocus),
                    contents: () => (
                      <>
                        <Separator />
                        <InsertAdmonition />
                      </>
                    ),
                  },
                ]}
              />
            </>
          ),
        },
      ]}
    />
  );
}
