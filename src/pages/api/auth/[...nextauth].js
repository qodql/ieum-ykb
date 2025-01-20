import NextAuth from "next-auth";
import NaverProvider from "next-auth/providers/naver";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/firebase";
import { getDocs, query, where, collection, addDoc } from "firebase/firestore";

export const authOptions = {
  secret: "968416519848645165",
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "email name nickname",
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize callback triggered");

        try {
          const q = query(
            collection(db, "userInfo"),
            where("info.email", "==", credentials.email),
            where("info.password", "==", credentials.password)
          );
          const querySnapshot = await getDocs(q);

          let user = null;
          querySnapshot.docs.forEach((doc) => {
            user = doc.data();
          });

          if (user) {
            return user.info;
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          console.error("Error during authorize callback:", error);
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback triggered");
      if (["naver", "google", "github"].includes(account.provider)) {
        let email;

        if (account.provider === "naver") {
          console.log("Naver Profile:", profile);

          const naverProfile = profile?.response;
          if (!naverProfile) {
            console.error("No response from Naver API");
            return false;
          }
          if (!naverProfile.email) {
            console.error("Email is missing in Naver profile");
            return false;
          }

          email = naverProfile.email;
        } else {
          email = user.email;
        }

        // Firestore에서 사용자 조회
        const q = query(collection(db, "userInfo"), where("info.email", "==", email));
        console.log("Firestore query initiated for email:", email);

        let querySnapshot;
        try {
          querySnapshot = await getDocs(q);
          if (querySnapshot.empty) {
            console.log("User not found, adding new user to Firestore.");
          }
        } catch (error) {
          console.error("Firestore query failed:", error);
          return false;
        }

        // Firestore에 사용자 정보 추가
        if (querySnapshot.empty) {
          const userInfo = {
            id: account.provider === "naver" ? profile.response.id : user.id,
            name: account.provider === "naver" ? profile.response.name : user.name,
            email,
            nickname: account.provider === "naver" ? profile.response.nickname : user.name,
            provider: account.provider,
            image: account.provider === "naver" ? "/img_member_profile.svg" : user.image,
          };

          try {
            console.log("Adding new user to Firestore:", userInfo);
            await addDoc(collection(db, "userInfo"), { info: userInfo });
            console.log(`${account.provider} user added to Firestore:`, userInfo);
          } catch (error) {
            console.error("Failed to save user to Firestore:", error);
            return false;
          }
        }

        return true;
      }
      return false; // 지원하지 않는 제공자의 경우 false 반환
    },

    async jwt({ token, account, profile }) {
      console.log("JWT callback triggered");
      try {
        if (account) {
          if (account.provider === "naver" && (!profile?.response || !profile.response.email)) {
            console.error("Invalid Naver profile during JWT callback");
            return {};
          }
          token.accessToken = account.access_token;
        }
        return token;
      } catch (error) {
        console.error("Error during JWT callback:", error);
        return token;
      }
    },

    async session({ session, token }) {
      console.log("Session callback triggered");
      try {
        if (!token || !token.accessToken) {
          console.error("Session error: No access token found");
          return null;
        }
        session.accessToken = token.accessToken;
        return session;
      } catch (error) {
        console.error("Error during session callback:", error);
        return null;
      }
    },
  },

  pages: {
    error: "에러", 
  },
};

export default NextAuth(authOptions);
