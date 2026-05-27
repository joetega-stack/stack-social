import { apiFetch } from "@/lib/api";
import { Exo } from "next/font/google";

//
export async function getUsers() {
    const res = await apiFetch("/users")
}

export async function getCurrentUser() {
    const res = await apiFetch("/users/current")
    return res
}

export async function getUserProfile(id) {
    const res =await apiFetch(`/user/${id}`)
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

export async function getFollowers() {
    return await apiFetch("/me/followers")
}

export async function getFollowing() {
    return await apiFetch("/me/following")
}

export async function updatePrivacy() {
    return await apiFetch("/privacy", null, "PATCH")
}

export async function selfDeleteAccount() {
    return await apiFetch(`/me/delete`,null,"DELETE")
}
