import { apiFetch } from "@/lib/api";

export async function createPost(postData) {
  return await apiFetch(
    "/posts/create",
    {
      content: postData.content?.trim() || null,
      media_url: postData.media_url || null,
      visibility: postData.visibility || "public",
    },
    "POST",
  );
}

//
export async function getPost() {
  const res = await apiFetch(`/posts/me`);
}

export async function getUserPosts(user_id) {
  return await apiFetch(`/posts/user/${user_id}`);
}

export async function getFriendPosts(user_id) {
  const res = await apiFetch(`/posts/friend/${user_id}`);
  return res
}

export async function updatePost(post_id, content) {
  const res = await apiFetch(`/posts/update/${post_id}`, { content }, "PUT");
  return res
}

export async function deletePost(post_id) {
  const res = await apiFetch(`/posts/delete/${post_id}`, null, "DELETE");
  return res;
}

export async function publicFeed() {
  const res = await apiFetch("/posts/feed/public");
  return res;
}

//
export async function followingFeed() {
  const res= await apiFetch("/posts/feed/following");
  return res
}

export async function likePost(post_id) {
  return await apiFetch(`/posts/${post_id}/like`, undefined, "POST");
}

export async function getPostLikes(post_id) {
  const res = await apiFetch(`/posts/${post_id}/likes`);
  return res
}

export async function commentPost(post_id, content) {
  return await apiFetch(`/posts/${post_id}/comment`, { content }, "post");
}
export async function getComments(post_id) {
  const res = await apiFetch(`/posts/${post_id}/comments`);
  return res;
}
