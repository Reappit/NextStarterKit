'use client';

import dynamic from 'next/dynamic';
import '../node_modules/@mdxeditor/editor/dist/style.css';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import { Edit3, Eye } from 'lucide-react';

const EditorComp = dynamic(() => import('./InitializedMDXEditor'), {
  ssr: false,
});

function Editor() {
  const [content, setContent] = useState('');
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="h-5 w-5" />
          Content Editor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-4">
            <EditorComp markdown={''} />
            <div className="text-muted-foreground mt-2 text-sm">
              {content.length} characters,{' '}
              {content.split(/\s+/).filter(word => word.length > 0).length}{' '}
              words
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <div className="bg-background min-h-[500px] rounded-lg border p-4">
              {content ? (
                <div className="prose prose-sm max-w-none" />
              ) : (
                <p className="text-muted-foreground">No content to preview</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
export default Editor;
