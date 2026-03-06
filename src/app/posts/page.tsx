import { getPosts, getUniqueTags } from "@/lib/posts";
import PostList from "./post-list";

console.log('[AllPostsPage] rendered');

export default function AllPostsPage() {
  const posts = getPosts();
  const tags = getUniqueTags();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-mono text-2xl font-bold text-foreground mb-1">
          All Posts
        </h1>
        <p className="font-mono text-sm text-muted mb-8">
          {posts.length} entries in the log
        </p>

        <PostList initialPosts={posts} allTags={tags} />
      </div>
    </div>
  );
}
