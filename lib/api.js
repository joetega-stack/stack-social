import Cookies from "js-cookie";
import { getToken } from "@/lib/auth";

const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "/api/backend").replace(/\/+$/, "")


export async function apiFetch(path = "", body, method="GET") {
    const token = getToken();
    const url = `${baseUrl}/${path.replace(/^\/+/, "")}`;
    let res;

    try {
        res = await fetch(url, {
            method: method.toUpperCase(),
            headers: {
                "Content-Type": "application/json",
                ...(token && {Authorization: `Bearer ${token}`}),
            },
            ...(body !== undefined && {body: JSON.stringify(body)}),
        })

        console.log("Request url", url)
    } catch (err) {
        throw new Error(
            `Network error ${err.message}. Backend may be unavailable.`,
        );
    }
    
    const contentType = res.headers.get("content-type") || ""
    const data = contentType.includes("application/json")
        ? await res.json()
        : await res.text()
    
    if (!res.ok) {
        const message =
            typeof data === "object"
                ? data?.detail || data?.message || JSON.stringify(data) || "Request failed"
                : String(data) || "Reuest failed";

        if (res.status === 401 || res.status === 403) {
            Cookies.remove("access_token", { path: "/" });
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
            throw new Error(message || "Unauthorized");
        }

        console.error("API ERROR", message);
        throw new Error(message);
    }


    return data 
  
}


// import Cookies from "js-cookie";

// const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL?.replace(/\/+$/, "")
// if (!baseUrl) {
//     throw new Error("NEXT_PUBLIC_SERVER_BASE_URL is not set");

// }


// export async function apiFetch(path = "", body ={}, method="GET") {
//     const token = Cookies.get("access_token");
    
//     const res = await fetch(`${baseUrl}/${path.replace(/^\/+/, "")}`, {
//         method: method.toUpperCase(),
//         headers: {
//             "Content-Type": "application/json",
//             ...(token && {Authorization: `Bearer ${token}`}),
//         },
//         ...(body && {body: JSON.stringify(body)}),
//     })
    
//     const contentType = res.headers.get("content-type") || ""
//     const data = contentType.includes("application/json")
//         ? await res.json()
//         : await res.text()
    
//     if (!res.ok) {
//         if (res.status === 401) window.location.href = "/login"

//         throw new Error(
//             typeof data === "object" && data?.detail
//                 ? data.detail
//                 : `Request failed with status ${res.status}`
//         )
//     }


//     return data 
  
// }

