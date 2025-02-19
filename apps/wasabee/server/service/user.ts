import { pg } from "@/lib/db"

export const userService = {
    async getUser  (data: {
        provider: string,
    }) {
        const res = await pg`SELECT * FROM fto_project WHERE provider = ${data.provider}`
        return res?.[0]
    }
}