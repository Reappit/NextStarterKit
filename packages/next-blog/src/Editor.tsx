'use client';

import dynamic from 'next/dynamic';
import '../node_modules/@mdxeditor/editor/dist/style.css';
import './editor.css';

import { useState } from 'react';
import { Card, CardContent } from '@workspace/ui/components/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import { Badge, Edit3, Eye, FileText, Save } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  getCharacterCountColor,
  SeoData,
  seoLimits,
  ValidationErrors,
} from '@/src/utils/slug-validators';

const EditorComp = dynamic(() => import('./InitializedMDXEditor'), {
  ssr: false,
});

function Title() {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [content, setContent] = useState('');
  const [seoData, setSeoData] = useState<SeoData>({
    title: '',
    description: '',
    keywords: '',
    author: '',
    slug: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    canonicalUrl: '',
  });

  const handleTitleChange = (value: any) => {};
  return (
    <div className="space-y-2">
      <Label htmlFor="title">Title *</Label>
      <Input
        id="title"
        value={seoData.title}
        onChange={e => handleTitleChange(e.target.value)}
        placeholder="Enter article title"
        className={errors.title ? 'border-red-500' : ''}
      />
      <div className="flex items-center justify-between text-sm">
        <span className={getCharacterCountColor('title', seoData.title.length)}>
          {seoData.title.length}/{seoLimits.title.max}
        </span>
        <Badge
          variant={
            seoData.title.length >= seoLimits.title.min &&
            seoData.title.length <= seoLimits.title.optimal
              ? 'default'
              : 'secondary'
          }
        >
          {seoData.title.length >= seoLimits.title.min &&
          seoData.title.length <= seoLimits.title.optimal
            ? 'Optimal'
            : 'Needs work'}
        </Badge>
      </div>
      {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
    </div>
  );
}

function Editor() {
  const [content, setContent] = useState('');
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Content Editor</h1>
        </div>
        <Button onClick={() => {}} className="flex items-center gap-2">
          <Save className="h-20 w-20" />
          Save Slug
        </Button>
      </div>
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-4">
          <Card className="py-0">
            <CardContent className="px-0">
              <EditorComp markdown={''} />
              <div className="text-muted-foreground mt-2 px-6 text-sm">
                {content.length} characters,{' '}
                {content.split(/\s+/).filter(word => word.length > 0).length}{' '}
                words
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="mt-4">
          seo
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
    </div>
  );
}
export default Editor;
