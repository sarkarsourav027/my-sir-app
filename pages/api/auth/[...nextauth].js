import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        AppleProvider({
            clientId: process.env.APPLE_ID,
            clientSecret: process.env.APPLE_SECRET
        }),
        CredentialsProvider({
            async authorize(credentials, req) {
                try {
                    const res = await fetch(process.env.API_BASE_URL + 'user/login', {
                        method: 'POST',
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const user = await res.json()


                    if (user.status && user) {
                        // Resolve the promise with the user object
                        return {user: user.data.profile};
                    } else {
                        // Reject the promise with an error message
                        return Promise.reject(new Error('Invalid credentials'));
                    }

                } catch (error) {
                    // Reject the promise with the caught error
                    return Promise.reject(error);
                }
            },
        })
    ],
    pages: {
        signIn: "/",
    },
    callbacks: {
        async jwt({token, user, account, profile}) {

            if (account !== undefined && account.provider === "google") {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}user/sociallogin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: profile.email,
                        fullname: profile.name,
                        device_type: 'web',
                        provider: account.provider,
                        providerId: account.providerAccountId
                    }),
                });

                const userdata = await res.json()

                // console.log('-------google-------')
                // console.log(userdata)
                // If no error and we have user data, return it
                if (res.ok && userdata) {
                    user && (token.user = userdata.data.profile);
                }
            }

            return { ...token, ...user };
        },

        async session({session, token}) {
            // console.log(token)
            session.expires = Date.now() + 604800000;
            session.user = token.user;  // Setting token in session

            return session;
        },
    },
    debug: process.env.ENVIRONMENT === 'development',
}

export default NextAuth(authOptions)