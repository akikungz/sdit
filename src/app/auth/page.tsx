import { type GetServerSidePropsContext } from "next";
import Image from "next/image";
import { getCsrfToken } from "next-auth/react"

import { cn } from "@sdit/lib/utils";
import AnimatedGridPattern from "@sdit/components/decorator/AnimatedGridPatten";

export default async function AuthPage(ctx: GetServerSidePropsContext) {
    const csrfToken = await getCsrfToken(ctx);

    return (
        <main className="w-screen h-screen flex items-center justify-center relative px-4">
            <AnimatedGridPattern 
                className={
                    cn(
                        "absolute w-full h-full -z-10",
                        "opacity-30"
                    )
                }
            />
            <div
                className={
                    cn(
                        "w-full max-w-96 px-8 py-12 bg-neutral-900/90 rounded-lg shadow-lg",
                        "flex flex-col items-center space-y-4"
                    )
                }
            >
                <Image src="/images/logo-it-dept.png" alt="IT Department@FITM" className={cn("w-1/3")} width={200} height={200} />
                <h1 className="text-2xl font-medium">Sign in</h1>
                
                <form
                    className="w-full space-y-4"
                    method="post"
                    action="/api/auth/callback/credentials"
                >
                    <input type="hidden" name="csrfToken" defaultValue={csrfToken} />
                    <div
                        className={
                            cn(
                                "w-full",
                                "flex flex-col justify-center space-y-1"
                            )
                        }
                    >
                        <label htmlFor="username" className="text-gray-300">ICIT Account</label>
                        <input
                            className={
                                cn(
                                    "w-full border border-gray-300",
                                    "px-4 py-2",
                                    "placeholder-gray-400 border-x-0 border-t-0 border-b-neutral-600",
                                    "text-white bg-neutral-900/10",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:rounded-md"
                                )
                            }
                            type="text"
                            name="username"
                            placeholder="s6xxxxxxxxxxxx"
                        />
                    </div>
                    <div
                        className={
                            cn(
                                "w-full",
                                "flex flex-col justify-center space-y-1"
                            )
                        }
                    >
                        <label htmlFor="password" className="text-gray-300">Password</label>
                        <input
                            className={
                                cn(
                                    "w-full border border-gray-300",
                                    "px-4 py-2",
                                    "placeholder-gray-400 border-x-0 border-t-0 border-b-neutral-600",
                                    "text-white bg-neutral-900/10",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:rounded-md"
                                )
                            }
                            type="password"
                            name="password"
                            placeholder="********"
                        />
                    </div>
                    <button
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md"
                        type="submit"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </main>
    );
}