"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";

console.log('[PostList] rendered');

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PostList({
  initialPosts,
  allTags,
}: {
  initialPosts: BlogPost[];
  allTags: string[];
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? initialPosts.filter((p) => p.tags.includes(activeTag))
    : initialPosts;

  return (
    <>
      {/* Back Link */}
      <Link
        href="/"
        className="inline-block font-mono text-sm text-accent hover:text-accent-hover transition-colors mb-8"
      >
        ← back to dashboard
      </Link>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTag(null)}
          className={`rounded-full border px-3 py-1 font-mono text-xs transition-all duration-200 cursor-pointer ${
            activeTag === null
              ? "border-accent bg-accent/10 text-accent"
              : "border-card-border bg-card text-muted hover:border-accent/30 hover:text-foreground"
          }`}
        >
          all
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`rounded-full border px-3 py-1 font-mono text-xs transition-all duration-200 cursor-pointer ${
              activeTag === tag
                ? "border-accent bg-accent/10 text-accent"
                : "border-card-border bg-card text-muted hover:border-accent/30 hover:text-foreground"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Filtered Count */}
      <p className="font-mono text-xs text-muted mb-4">
        showing {filtered.length} of {initialPosts.length}
      </p>

      {/* Post Cards */}
      <div className="flex flex-col gap-4">
        {filtered.map((post) => (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <article className="group rounded-lg border border-card-border bg-card p-5 transition-all duration-200 hover:border-accent/50 hover:shadow-[0_0_15px_rgba(34,197,94,0.05)]">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors duration-200">
                {post.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {post.content.slice(0, 150)}…
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-muted/70">
                  {formatDate(post.createdAt)}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-accent/20 bg-accent/5 px-2.5 py-0.5 font-mono text-xs text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center font-mono text-sm text-muted">
          no posts with tag &quot;{activeTag}&quot;
        </p>
      )}
    </>
  );
}
