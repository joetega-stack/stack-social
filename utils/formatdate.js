import dayjs from "dayjs";

export function formatDate(dateString) {
    const now = dayjs()
    const date = dayjs(dateString)

    const minutes = now.diff(date,"minute")
    const hours = now.diff(date,"hour")
    const days = now.diff(date,"day")
    const years = now.diff(date, "year")
    
    if (minutes < 1) return "now"
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    if (years < 1) return date.format("MMM D")
    
    return date.format("MMM D, YYYY")
}