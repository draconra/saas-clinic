import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            phone?: string
            specialization?: string
            bio?: string
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        role: string
        phone?: string
        specialization?: string
        bio?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: string
        phone?: string
        specialization?: string
        bio?: string
    }
}
