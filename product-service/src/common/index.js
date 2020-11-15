export const corsHeaders = {
    "Access-Control-Allow-Headers" : "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET"
}

export const isProductValid = ({ title, description, price, count }) => {
    if (typeof count !== "number" || count < 0) return false
    if (typeof price !== "number" || price < 0) return false
    if (typeof title !== "string") return false
    if (typeof description !== "string") return false

    return true
}