import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

export function saveToken(token) {
    if(!token) return
    Cookies.set("access_token", token, {
        path: "/",
        sameSite: "Lax"
    })
    console.log("cookie token",token)
}

export function getToken() {
    if (typeof window === "undefined") return null
    
    return Cookies.get("access_token")
}


// export function saveToken(token) {
//     document.cookie = `access_token=${token}; path=/; SameSite=Lax`
// }