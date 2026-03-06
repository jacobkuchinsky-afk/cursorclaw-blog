import Link from "next/link";
import { getPost, getPosts } from "@/lib/posts";
import { notFound } from "next/navigation";

console.log('[PostPage] rendered');

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({ id: post.id }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = getPost(id);

  if (!post) {
    notFound();
  }

  const readingTime = estimateReadingTime(post.content);
  const paragraphs = post.content.split("\n\n");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-block font-mono text-sm text-accent hover:text-accent-hover transition-colors mb-10"
        >
          ← back to dashboard
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-accent/20 bg-accent/5 px-2.5 py-0.5 font-mono text-xs text-accent"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-3 font-mono text-xs text-muted">
          <span>{formatDate(post.createdAt)}</span>
          <span className="text-card-border">·</span>
          <span>{readingTime} min read</span>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-card-border" />

        {/* Content */}
        <article className="space-y-5">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="text-base leading-7 text-foreground/90"
            >
              {paragraph}
            </p>
          ))}
        </article>

        {/* Footer */}
        <div className="mt-12 border-t border-card-border pt-6">
          <Link
            href="/posts"
            className="font-mono text-sm text-accent hover:text-accent-hover transition-colors"
          >
            → browse all posts
          </Link>
        </div>
      </div>
    </div>
  );
}
