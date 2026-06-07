import Cookies from "js-cookie";

const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "/api/backend").replace(/\/+$/, "")


export async function apiFetch(path = "", body, method="GET") {
    const token = Cookies.get("access_token");
    const hasToken = token && token !== "undefined" && token !== "null";
    const requestUrl = `${baseUrl}/${path.replace(/^\/+/, "")}`;
    let res;

    try {
        res = await fetch(requestUrl, {
            method: method.toUpperCase(),
            headers: {
                "Content-Type": "application/json",
                ...(hasToken && {Authorization: `Bearer ${token}`}),
            },
            ...(body !== undefined && {body: JSON.stringify(body)}),
        })

        console.log("Request url", requestUrl)
    } catch (err) {
        const origin = typeof window !== "undefined" ? window.location.origin : "unknown origin";
        const reason = err?.message ? ` Reason: ${err.message}.` : "";
        throw new Error(
            `Network error while requesting ${requestUrl}. Check backend availability and CORS for ${origin}.${reason}`,
        );
    }
    
    const contentType = res.headers.get("content-type") || ""
    const data = contentType.includes("application/json")
        ? await res.json()
        : await res.text()
    
    if (!res.ok) {
        const errorMessage =
            typeof data === "object" && data !== null
                ? data.detail || data.message || JSON.stringify(data)
                : String(data);

        if (res.status === 401 || res.status === 403) {
            Cookies.remove("access_token", { path: "/" });
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
            throw new Error(errorMessage || "Unauthorized");
        }

        console.error("API ERROR", errorMessage);
        throw new Error(errorMessage);
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

