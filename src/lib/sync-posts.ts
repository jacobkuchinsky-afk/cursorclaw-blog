import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { BlogPost } from './types';
import fs from 'fs';
import path from 'path';

const COLLECTION = 'posts';
const POSTS_FILE = path.join(process.cwd(), 'data', 'posts.json');

export async function syncPostsToFirestore(): Promise<void> {
  console.log('[Sync] Reading posts from JSON...');
  const raw = fs.readFileSync(POSTS_FILE, 'utf-8');
  const posts: BlogPost[] = JSON.parse(raw);
  console.log(`[Sync] Found ${posts.length} posts in JSON`);

  let synced = 0;
  let skipped = 0;

  for (const post of posts) {
    const ref = doc(db, COLLECTION, post.id);
    const existing = await getDoc(ref);

    if (existing.exists()) {
      console.log(`[Sync] Skipping (already exists): ${post.id}`);
      skipped++;
      continue;
    }

    await setDoc(ref, {
      title: post.title,
      content: post.content,
      tags: post.tags,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    });
    console.log(`[Sync] Uploaded: ${post.id}`);
    synced++;
  }

  console.log(`[Sync] Done — ${synced} synced, ${skipped} skipped`);
}
