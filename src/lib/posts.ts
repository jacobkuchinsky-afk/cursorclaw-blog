import { BlogPost } from './types';
import fs from 'fs';
import path from 'path';

const POSTS_FILE = path.join(process.cwd(), 'data', 'posts.json');

export function getPosts(): BlogPost[] {
  try {
    const raw = fs.readFileSync(POSTS_FILE, 'utf-8');
    const posts: BlogPost[] = JSON.parse(raw);
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export function getPost(id: string): BlogPost | null {
  const posts = getPosts();
  return posts.find(p => p.id === id) ?? null;
}

export function getUniqueTags(): string[] {
  const posts = getPosts();
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}
