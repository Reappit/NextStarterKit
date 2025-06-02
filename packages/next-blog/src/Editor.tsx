'use client';

import dynamic from 'next/dynamic';
import '../node_modules/@mdxeditor/editor/dist/style.css';
import './editor.css';

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
import { AlertCircle, Edit3, Eye, FileText, Save } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  getCharacterCountColor,
  SeoData,
  seoLimits,
  ValidationErrors,
} from '@/src/utils/slug-validators';
import { Badge } from '@workspace/ui/components/badge';
import { Textarea } from '@workspace/ui/components/textarea';
import { Separator } from '@workspace/ui/components/separator';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { z } from 'zod';

const EditorComp = dynamic(() => import('./InitializedMDXEditor'), {
  ssr: false,
});

const formSchema = z.object({
  title: z
    .string()
    .min(30, 'Title must be at least 30 characters')
    .max(60, 'Title must not exceed 60 characters')
    .refine(val => val.trim().length > 0, 'Title is required'),
  description: z
    .string()
    .min(120, 'Description must be at least 120 characters')
    .max(160, 'Description must not exceed 160 characters')
    .refine(val => val.trim().length > 0, 'Description is required'),
  keywords: z
    .string()
    .max(200, 'Keywords must not exceed 200 characters')
    .optional(),
  author: z
    .string()
    .max(100, 'Author name must not exceed 100 characters')
    .optional(),
  slug: z
    .string()
    .max(75, 'Slug must not exceed 75 characters')
    .regex(
      /^[a-z0-9-]*$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    )
    .refine(val => val.trim().length > 0, 'Slug is required'),
  ogTitle: z
    .string()
    .max(60, 'OG Title must not exceed 60 characters')
    .optional(),
  ogDescription: z
    .string()
    .max(160, 'OG Description must not exceed 160 characters')
    .optional(),
  ogImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  canonicalUrl: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  content: z.string().min(1, 'Content is required'),
});

type FormData = z.infer<typeof formSchema>;


function Editor() {
  const [content, setContent] = useState('');
  const seoData = {
    title: '',
    description: '',
    keywords: '',
    author: '',
    slug: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    canonicalUrl: '',
  };
  const errors = [];
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
          <TabsTrigger value="base" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Editor
          </TabsTrigger>

          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="base" className="mt-4">
          <Card>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={seoData.title}
                  onChange={e => {}}
                  placeholder="Enter article title"
                  className={errors.title ? 'border-red-500' : ''}
                />
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={getCharacterCountColor(
                      'title',
                      seoData.title.length
                    )}
                  >
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
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Meta Description *</Label>
                <Textarea
                  id="description"
                  value={seoData.description}
                  onChange={e => {}}
                  placeholder="Enter meta description"
                  rows={3}
                  className={errors.description ? 'border-red-500' : ''}
                />
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={getCharacterCountColor(
                      'description',
                      seoData.description.length
                    )}
                  >
                    {seoData.description.length}/{seoLimits.description.max}
                  </span>
                  <Badge
                    variant={
                      seoData.description.length >= seoLimits.description.min &&
                      seoData.description.length <=
                        seoLimits.description.optimal
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {seoData.description.length >= seoLimits.description.min &&
                    seoData.description.length <= seoLimits.description.optimal
                      ? 'Optimal'
                      : 'Needs work'}
                  </Badge>
                </div>
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* URL Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={seoData.slug}
                  onChange={e => {}}
                  placeholder="url-slug"
                  className={errors.slug ? 'border-red-500' : ''}
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {seoData.slug.length}/{seoLimits.slug.max}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    Generate
                  </Button>
                </div>
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug}</p>
                )}
              </div>

              <Separator />

              {/* Additional SEO Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    value={seoData.keywords}
                    onChange={e => {}}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={seoData.author}
                    onChange={e => {}}
                    placeholder="Author name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canonicalUrl">Canonical URL</Label>
                  <Input
                    id="canonicalUrl"
                    value={seoData.canonicalUrl}
                    onChange={e => {}}
                    placeholder="https://example.com/article"
                  />
                </div>
              </div>

              <Separator />

              {/* Open Graph Fields */}
              <div className="space-y-4">
                <h4 className="font-medium">Open Graph</h4>

                <div className="space-y-2">
                  <Label htmlFor="ogTitle">OG Title</Label>
                  <Input
                    id="ogTitle"
                    value={seoData.ogTitle}
                    onChange={e => {}}
                    placeholder="Open Graph title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ogDescription">OG Description</Label>
                  <Textarea
                    id="ogDescription"
                    value={seoData.ogDescription}
                    onChange={e => {}}
                    placeholder="Open Graph description"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ogImage">OG Image URL</Label>
                  <Input
                    id="ogImage"
                    value={seoData.ogImage}
                    onChange={e => {}}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* SEO Score */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  SEO Score:{' '}
                  {Object.keys(errors).length === 0 &&
                  seoData.title &&
                  seoData.description
                    ? 'Good'
                    : 'Needs improvement'}
                </AlertDescription>
              </Alert>

              {/* Google Search Preview */}
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 font-medium">
                  <Eye className="h-4 w-4" />
                  Google Search Preview
                </h4>
                {/*<GoogleSearchPreview title={seoData.title} description={seoData.description} slug={seoData.slug} />*/}
                <p className="text-muted-foreground text-xs">
                  This is how your article will appear in Google search results
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
