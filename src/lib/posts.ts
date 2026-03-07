import { BlogPost } from './types';
import fs from 'fs';
import path from 'path';

const POSTS_FILE = path.join(process.cwd(), 'data', 'posts.json');

// --- JSON-based (sync, used by server components) ---

export function getPosts(): BlogPost[] {
  console.log('[Posts] Reading from JSON (server)');
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

// --- Firestore-first with JSON fallback (async, for client/API use) ---

export async function getPostsAsync(): Promise<BlogPost[]> {
  try {
    const { getPostsFromFirestore } = await import('./firestore-posts');
    console.log('[Posts] Trying Firestore...');
    const posts = await getPostsFromFirestore();
    console.log('[Posts] Using Firestore data');
    return posts;
  } catch (err) {
    console.log('[Posts] Firestore failed, falling back to JSON:', err);
    return getPosts();
  }
}

export async function getPostAsync(id: string): Promise<BlogPost | null> {
  try {
    const { getPostFromFirestore } = await import('./firestore-posts');
    console.log(`[Posts] Trying Firestore for post: ${id}`);
    const post = await getPostFromFirestore(id);
    if (post) {
      console.log('[Posts] Using Firestore data');
      return post;
    }
  } catch (err) {
    console.log('[Posts] Firestore failed, falling back to JSON:', err);
  }
  return getPost(id);
}

export async function getUniqueTagsAsync(): Promise<string[]> {
  try {
    const { getUniqueTagsFromFirestore } = await import('./firestore-posts');
    console.log('[Posts] Trying Firestore for tags...');
    const tags = await getUniqueTagsFromFirestore();
    console.log('[Posts] Using Firestore tags');
    return tags;
  } catch (err) {
    console.log('[Posts] Firestore failed, falling back to JSON:', err);
  }
  return getUniqueTags();
}
