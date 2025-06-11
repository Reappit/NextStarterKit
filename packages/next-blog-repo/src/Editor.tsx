'use client';

// import dynamic from 'next/dynamic';
import '../node_modules/@mdxeditor/editor/dist/style.css';
import './editor.css';
import { useForm } from 'react-hook-form';
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
import {
  AlertCircle,
  BookOpen,
  Edit3,
  Eye,
  FileText,
  Save,
  Search,
} from 'lucide-react';
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
  Form,
} from '@workspace/ui/components/form';
import { CharacterCount } from './components/CharacterCount';
import GoogleSearchPreview from './components/GoogleSearchPreview';
import { Checkbox } from '@workspace/ui/components/checkbox';

// const EditorComp = dynamic(() => import('./InitializedMDXEditor'), {
//   ssr: false,
// });

const formSchema = z.object({
  // SEO & Metadata fields
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

  // Story Content fields
  storySummary: z
    .string()
    .min(50, 'Story summary must be at least 50 characters')
    .max(300, 'Story summary must not exceed 300 characters')
    .refine(val => val.trim().length > 0, 'Story summary is required'),
  storySlug: z
    .string()
    .max(100, 'Story slug must not exceed 100 characters')
    .regex(
      /^[a-z0-9-]*$/,
      'Story slug can only contain lowercase letters, numbers, and hyphens'
    )
    .refine(val => val.trim().length > 0, 'Story slug is required'),
  content: z.string().min(1, 'Content is required'),
  genre: z.string().max(50, 'Genre must not exceed 50 characters').optional(),
  readingTime: z
    .string()
    .max(20, 'Reading time must not exceed 20 characters')
    .optional(),
  published: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

function Editor() {
  const [activeMainTab, setActiveMainTab] = useState('seo');
  const [activeContentTab, setActiveContentTab] = useState('edit');

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
      storySummary: '',
      storySlug: '',
      content: '',
      genre: '',
      readingTime: '',
      published: false,
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

  // Generate story slug from title
  const generateStorySlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 100); // Limit to 100 characters
  };

  // Calculate reading time based on content
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).filter(word => word.length > 0).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Auto-generate slug when title changes
  useEffect(() => {
    if (watchedValues.title && !watchedValues.slug) {
      const slug = generateSlug(watchedValues.title);
      setValue('slug', slug);
    }
  }, [watchedValues.title, watchedValues.slug, setValue]);

  // Auto-generate story slug when title changes
  useEffect(() => {
    if (watchedValues.title && !watchedValues.storySlug) {
      const storySlug = generateStorySlug(watchedValues.title);
      setValue('storySlug', storySlug);
    }
  }, [watchedValues.title, watchedValues.storySlug, setValue]);

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

  // Auto-calculate reading time
  useEffect(() => {
    if (watchedValues.content && !watchedValues.readingTime) {
      const readingTime = calculateReadingTime(watchedValues.content);
      setValue('readingTime', readingTime);
    }
  }, [watchedValues.content, watchedValues.readingTime, setValue]);

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
      <Form {...form}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Story Editor</h1>
          </div>
          <div className="flex items-center gap-4">
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={checked => {
                        if (!isValid && checked) {
                          // Don't allow checking if form is invalid
                          return;
                        }
                        field.onChange(checked);
                      }}
                      disabled={!isValid && !field.value}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer text-sm font-medium">
                    Published
                  </FormLabel>
                </FormItem>
              )}
            />
            <Badge variant={isValid ? 'default' : 'destructive'}>
              {isValid ? 'Valid' : 'Invalid'}
            </Badge>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Story
            </Button>
          </div>
        </div>

        {/* Warning when published but invalid */}
        {watchedValues.published && !isValid && (
          <Alert className="mb-6 border-yellow-500 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Warning:</strong> This story is marked as published but
              contains validation errors. Please fix the issues below or
              unpublish the story to prevent publishing invalid content.
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs
            value={activeMainTab}
            onValueChange={setActiveMainTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="seo" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                SEO & Metadata
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Story Content
              </TabsTrigger>
            </TabsList>

            {/* SEO & Metadata Tab */}
            <TabsContent value="seo" className="space-y-6">
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
                          <Input placeholder="Enter story title" {...field} />
                        </FormControl>
                        <div className="space-y-1">
                          <CharacterCount
                            current={field.value.length}
                            min={30}
                            max={60}
                            optimal={55}
                          />
                          <FormDescription>
                            Optimal length: 30-55 characters. This appears as
                            the clickable headline in search results.
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
                            placeholder="Enter meta description for search engines"
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
                            Optimal length: 120-155 characters. This appears
                            below the title in search results.
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
                                setValue(
                                  'slug',
                                  generateSlug(watchedValues.title)
                                )
                              }
                            >
                              Generate
                            </Button>
                          </div>
                        </FormControl>
                        <div className="space-y-1">
                          <CharacterCount
                            current={field.value.length}
                            max={75}
                          />
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
                              placeholder="fantasy, adventure, magic"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Comma-separated keywords relevant to your story.
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
                              placeholder="https://example.com/story"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The preferred URL for this content to avoid
                            duplicate content issues.
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
                              <Input
                                placeholder="Open Graph title"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Title for social media shares (auto-filled from
                              main title).
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
                                placeholder="https://example.com/story-cover.jpg"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Cover image that appears when shared on social
                              media.
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
                            Description for social media shares (auto-filled
                            from meta description).
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
                      This is how your story will appear in Google search
                      results
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Story Content Tab */}
            <TabsContent value="content" className="space-y-6">
              {/* Story Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Story Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Story Summary */}
                  <FormField
                    control={form.control}
                    name="storySummary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Story Summary *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write a compelling summary of your story that will engage readers..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <CharacterCount
                            current={field.value.length}
                            min={50}
                            max={300}
                            optimal={200}
                          />
                          <FormDescription>
                            A brief, engaging summary that hooks readers. This
                            appears on story listing pages.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Story Slug */}
                  <FormField
                    control={form.control}
                    name="storySlug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Story Slug *</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              placeholder="story-slug-for-internal-use"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setValue(
                                  'storySlug',
                                  generateStorySlug(watchedValues.title)
                                )
                              }
                            >
                              Generate
                            </Button>
                          </div>
                        </FormControl>
                        <div className="space-y-1">
                          <CharacterCount
                            current={field.value.length}
                            max={100}
                          />
                          <FormDescription>
                            Internal identifier for your story. Used for
                            categorization and internal linking.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Additional Story Fields */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="genre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Genre</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Fantasy, Sci-Fi, Romance..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Primary genre of your story.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="readingTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reading Time</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input placeholder="5 min read" {...field} />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setValue(
                                    'readingTime',
                                    calculateReadingTime(watchedValues.content)
                                  )
                                }
                              >
                                Calculate
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Estimated reading time (auto-calculated from
                            content).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="h-5 w-5" />
                    Story Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={activeContentTab}
                    onValueChange={setActiveContentTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="edit"
                        className="flex items-center gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Write
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
                                placeholder="# Chapter 1: The Beginning

Once upon a time, in a land far away...

## The Journey Begins

Write your story here using **markdown** formatting.

- Use *italics* for emphasis
- Use **bold** for strong emphasis
- Create [links](https://example.com) to references

> Use blockquotes for important passages

\`\`\`
// You can even include code blocks if needed
const magic = 'happens here';
\`\`\`"
                                className="h-[600px] resize-none overflow-y-auto font-mono"
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
                      <div className="bg-background h-[600px] overflow-y-auto rounded-lg border p-6">
                        {watchedValues.content ? (
                          <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: renderMarkdown(watchedValues.content),
                            }}
                          />
                        ) : (
                          <p className="text-muted-foreground">
                            No content to preview. Start writing your story in
                            the Write tab.
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
export default Editor;
