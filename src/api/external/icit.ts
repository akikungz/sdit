import { env } from "@sdit/env";

export interface AuthApiResponse {
    api_status_code: number;
    userInfo: {
        username: string;
        displayname: string;
        firstname_en: string;
        lastname_en: string;
        account_type: "students" | "alumni" | "personel";
    }
}

export async function auth(username: string, password: string) {
    try {
        const response = await fetch(`${env.AUTH_API}/user-authen`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${env.AUTH_API_KEY}`
            },
            body: JSON.stringify({ username, password, scopes: "student,alumni,personel" }),
        });

        if (!response.ok) throw new Error("Error connecting to the authentication service");

        const data: AuthApiResponse = await response.json();
        if (data.api_status_code !== 202) return { error: "Invalid credentials" }

        return {
            username: data.userInfo.username,
            display_name: data.userInfo.displayname,
            first_name: data.userInfo.firstname_en,
            last_name: data.userInfo.lastname_en,
            account_type: data.userInfo.account_type,
        }
    } catch (err) {
        return { error: "Error connecting to the authentication service" }
    }
}

export async function getUser(username: string) {
    try {
        const response = await fetch(`${env.AUTH_API}/user-info`, {
            headers: {
                "Authorization": `Bearer ${env.AUTH_API_KEY}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ username }),
        });

        if (!response.ok) throw new Error("Error connecting to the data service");

        const data: AuthApiResponse = await response.json();
        if (data.api_status_code !== 201) return { error: "Invalid credentials" }

        return {
            username: data.userInfo.username,
            display_name: data.userInfo.displayname,
            first_name: data.userInfo.firstname_en,
            last_name: data.userInfo.lastname_en,
            account_type: data.userInfo.account_type,
        }
    } catch (err) {
        return { error: "Error connecting to the data service" }
    }
}