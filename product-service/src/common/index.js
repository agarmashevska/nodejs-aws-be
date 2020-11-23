export const corsHeaders = {
    "Access-Control-Allow-Headers" : "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET"
}

export const isProductValid = ({ title, description, price, count }) => {
    if (Number(count) < 0) return false
    if (Number(price) < 0) return false
    if (typeof title !== "string") return false
    if (typeof description !== "string") return false

    return true
}