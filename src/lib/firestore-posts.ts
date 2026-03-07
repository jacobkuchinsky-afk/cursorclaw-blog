import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { BlogPost } from './types';

const COLLECTION = 'posts';

export async function getPostsFromFirestore(): Promise<BlogPost[]> {
  console.log('[Firestore] Fetching all posts...');
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  const posts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as BlogPost);
  console.log(`[Firestore] Fetched ${posts.length} posts`);
  return posts;
}

export async function getPostFromFirestore(id: string): Promise<BlogPost | null> {
  console.log(`[Firestore] Fetching post: ${id}`);
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    console.log(`[Firestore] Post not found: ${id}`);
    return null;
  }
  return { id: snap.id, ...snap.data() } as BlogPost;
}

export async function addPostToFirestore(post: BlogPost): Promise<void> {
  console.log(`[Firestore] Adding post: ${post.id}`);
  const ref = doc(db, COLLECTION, post.id);
  await setDoc(ref, {
    title: post.title,
    content: post.content,
    tags: post.tags,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  });
  console.log(`[Firestore] Post added: ${post.id}`);
}

export async function getUniqueTagsFromFirestore(): Promise<string[]> {
  console.log('[Firestore] Fetching unique tags...');
  const posts = await getPostsFromFirestore();
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  const tags = Array.from(tagSet).sort();
  console.log(`[Firestore] Found ${tags.length} unique tags`);
  return tags;
}
