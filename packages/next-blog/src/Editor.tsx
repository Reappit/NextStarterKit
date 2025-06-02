'use client';

import dynamic from 'next/dynamic';
import '../node_modules/@mdxeditor/editor/dist/style.css';
import './editor.css';
import { Form, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useEffect, useState } from 'react';
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

import { Badge } from '@workspace/ui/components/badge';
import { Textarea } from '@workspace/ui/components/textarea';
import { Separator } from '@workspace/ui/components/separator';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { z } from 'zod';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { CharacterCount } from './components/CharacterCount';
import GoogleSearchPreview from './components/GoogleSearchPreview';

// const EditorComp = dynamic(() => import('./InitializedMDXEditor'), {
//   ssr: false,
// });

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
  const [activeTab, setActiveTab] = useState('edit');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      keywords: '',
      author: '',
      slug: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      canonicalUrl: '',
      content: '',
    },
    mode: 'onChange',
  });

  const {
    watch,
    setValue,
    formState: { errors, isValid },
  } = form;

  // Watch form values for real-time updates
  const watchedValues = watch();

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Auto-generate slug when title changes
  useEffect(() => {
    if (watchedValues.title && !watchedValues.slug) {
      const slug = generateSlug(watchedValues.title);
      setValue('slug', slug);
    }
  }, [watchedValues.title, watchedValues.slug, setValue]);

  // Auto-populate OG fields
  useEffect(() => {
    if (watchedValues.title && !watchedValues.ogTitle) {
      setValue('ogTitle', watchedValues.title);
    }
  }, [watchedValues.title, watchedValues.ogTitle, setValue]);

  useEffect(() => {
    if (watchedValues.description && !watchedValues.ogDescription) {
      setValue('ogDescription', watchedValues.description);
    }
  }, [watchedValues.description, watchedValues.ogDescription, setValue]);

  const renderMarkdown = (markdown: string) => {
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\[([^\]]+)\]$$([^)]+)$$/gim, '<a href="$2">$1</a>')
      .replace(/\n/gim, '<br>');
  };

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    // Handle form submission
  };

  const getSEOScore = () => {
    const hasRequiredFields =
      watchedValues.title && watchedValues.description && watchedValues.slug;
    const hasOptimalLength =
      watchedValues.title.length >= 30 &&
      watchedValues.title.length <= 55 &&
      watchedValues.description.length >= 120 &&
      watchedValues.description.length <= 155;
    const hasNoErrors = Object.keys(errors).length === 0;

    if (hasRequiredFields && hasOptimalLength && hasNoErrors)
      return 'Excellent';
    if (hasRequiredFields && hasNoErrors) return 'Good';
    if (hasRequiredFields) return 'Fair';
    return 'Needs improvement';
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Markdown Editor</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isValid ? 'default' : 'destructive'}>
            {isValid ? 'Valid' : 'Invalid'}
          </Badge>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Article
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* SEO Fields */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                SEO Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter article title" {...field} />
                    </FormControl>
                    <div className="space-y-1">
                      <CharacterCount
                        current={field.value.length}
                        min={30}
                        max={60}
                        optimal={55}
                      />
                      <FormDescription>
                        Optimal length: 30-55 characters. This appears as the
                        clickable headline in search results.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Meta Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter meta description"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <CharacterCount
                        current={field.value.length}
                        min={120}
                        max={160}
                        optimal={155}
                      />
                      <FormDescription>
                        Optimal length: 120-155 characters. This appears below
                        the title in search results.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* URL Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug *</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="url-slug" {...field} />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setValue('slug', generateSlug(watchedValues.title))
                          }
                        >
                          Generate
                        </Button>
                      </div>
                    </FormControl>
                    <div className="space-y-1">
                      <CharacterCount current={field.value.length} max={75} />
                      <FormDescription>
                        URL-friendly version of your title. Use lowercase
                        letters, numbers, and hyphens only.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Additional SEO Fields */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="keyword1, keyword2, keyword3"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated keywords relevant to your content.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Author name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="canonicalUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canonical URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/article"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The preferred URL for this content to avoid duplicate
                        content issues.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Open Graph Fields */}
              <div className="space-y-4">
                <h4 className="font-medium">Open Graph (Social Media)</h4>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="ogTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OG Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Open Graph title" {...field} />
                        </FormControl>
                        <FormDescription>
                          Title for social media shares (auto-filled from main
                          title).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ogImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OG Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Image that appears when shared on social media.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="ogDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OG Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Open Graph description"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Description for social media shares (auto-filled from
                        meta description).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* SEO Score */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  SEO Score: <strong>{getSEOScore()}</strong>
                  {!isValid && ' - Please fix validation errors above.'}
                </AlertDescription>
              </Alert>

              {/* Google Search Preview */}
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 font-medium">
                  <Eye className="h-4 w-4" />
                  Google Search Preview
                </h4>
                <GoogleSearchPreview
                  title={watchedValues.title}
                  description={watchedValues.description}
                  slug={watchedValues.slug}
                />
                <p className="text-muted-foreground text-xs">
                  This is how your article will appear in Google search results
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Markdown Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Content Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit" className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="mt-4">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="# Your Article Title

Write your markdown content here...

## Section 1

This is a paragraph with **bold** and *italic* text.

- List item 1
- List item 2
- List item 3

[Link text](https://example.com)

\`\`\`javascript
const example = 'code block';
\`\`\`"
                            className="min-h-[500px] font-mono"
                            {...field}
                          />
                        </FormControl>
                        <div className="text-muted-foreground flex items-center justify-between text-sm">
                          <span>
                            {field.value.length} characters,{' '}
                            {
                              field.value
                                .split(/\s+/)
                                .filter(word => word.length > 0).length
                            }{' '}
                            words
                          </span>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="preview" className="mt-4">
                  <div className="bg-background min-h-[500px] rounded-lg border p-4">
                    {watchedValues.content ? (
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(watchedValues.content),
                        }}
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        No content to preview
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
export default Editor;
