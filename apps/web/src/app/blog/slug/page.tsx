import { slugService } from '@reappit/blog';

export default async function () {
  const slugs = await slugService.getSlugById(4);
  console.log(slugs)
  return (
    <div>
      <h1>Blog Post</h1>
      <p>This is a placeholder for the blog post content.</p>
    </div>
  );
}
