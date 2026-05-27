import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

export function saveToken(token) {
    Cookies.set("access_token", token, {
        path: "/",
        sameSite: "Lax"
    })
}

export function getToken() {
    return Cookies.get("access_token")
}

export function getDecodedToken() {
    const token = getToken()

    if (!token) {
        console.log("no token found")
        return null
    }

    const decoded = jwtDecode(token)
    console.log("id", decoded) 
    return decoded
}

// export function saveToken(token) {
//     document.cookie = `access_token=${token}; path=/; SameSite=Lax`
// }