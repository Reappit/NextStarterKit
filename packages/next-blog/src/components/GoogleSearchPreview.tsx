export default function GoogleSearchPreview({
  title,
  description,
  slug,
  domain = 'example.com',
}: {
  title: string;
  description: string;
  slug: string;
  domain?: string;
}) {
  const url = `https://${domain}${slug ? `/${slug}` : ''}`;
  const displayUrl = `${domain}${slug ? ` › ${slug.replace(/-/g, ' ')}` : ''}`;

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="space-y-1">
        {/* Favicon and URL */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-blue-600">
            <span className="text-xs font-bold text-white">E</span>
          </div>
          <span className="text-gray-600">{displayUrl}</span>
        </div>

        {/* Title */}
        <h3 className="cursor-pointer text-xl font-normal leading-6 text-blue-600 hover:underline">
          {title || 'Your Article Title'}
        </h3>

        {/* Description */}
        <p className="max-w-2xl text-sm leading-5 text-gray-600">
          {description ||
            'Your meta description will appear here. Make it compelling to encourage clicks from search results.'}
        </p>
      </div>
    </div>
  );
}
