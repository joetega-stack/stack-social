import { apiFetch } from "@/lib/api";

//admin
export async function getUsers() {
    const res = await apiFetch("/users")
}

export async function getCurrentUser() {
   return await apiFetch("/users/current")
}

export async function getUserProfile(id) {
    if (!id) {
        throw new Error("User Id is required")
    }
    return await apiFetch(`/user/${id}`)
}

export async function updateUserProfile(postData) {
    const profileImage = postData.profile_image || postData.profile_url || null;
    const coverPhoto = postData.cover_photo || postData.cover_image || null;

    return await apiFetch(
        "/update-profile",
        {
            username: postData.username?.trim() || null,
            email: postData.email?.trim() || null,
            bio: postData.bio?.trim() || null,
            password: postData.password?.trim() || null,
            profile_image: profileImage,
            cover_photo: coverPhoto,
            // Keep both keys for backend compatibility.
            cover_image: coverPhoto,
        },
        "PATCH",
    )
}

export async function followUser(id) {
    return await apiFetch(`/follow/${id}`,null,"post")
}

export async function getAllUsers() {
    return await apiFetch("/all/users")
}

//

export async function getFollowers(id) {
    return await apiFetch(`followers/${id}`)
}

export async function getFollowing(id) {
    return await apiFetch(`following/${id}`)
}

export async function updatePrivacy() {
    return await apiFetch("/privacy", null, "PATCH")
}

export async function selfDeleteAccount() {
    return await apiFetch(`/me/delete`,null,"DELETE")
}

export async function startChat(targetUserId) {
    return await apiFetch(`/chat/start/${targetUserId}`,null, "POST")
}

export async function sendMessage(conversationId,content) {
    return await apiFetch(`/chat/${conversationId}/message`,{content}, "POST")
}

export async function getMessages(conversationId) {
    return await apiFetch(`/chat/${conversationId}/messages`)
}