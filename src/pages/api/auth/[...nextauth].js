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
          scope: "email name nickname birthday mobile",
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
      try {
        console.log("Starting signIn callback");
        if (["naver", "google", "github"].includes(account.provider)) {
          let email;

          if (account.provider === "naver") {
            console.log("Naver Profile received:", profile);

            const fetchNaverProfileWithRetry = async (profile, retries = 3, delay = 1000) => {
              for (let attempt = 1; attempt <= retries; attempt++) {
                const response = profile?.response;
                if (response?.email) {
                  return response; // 정상 응답
                }
                console.warn(`Retrying Naver API response (${attempt}/${retries})...`);
                await new Promise((resolve) => setTimeout(resolve, delay)); // 대기
              }
              throw new Error("Failed to fetch Naver profile after retries.");
            };

            const naverProfile = await fetchNaverProfileWithRetry(profile);
            email = naverProfile.email;
          } else {
            email = user.email;
          }

          // Firestore에서 사용자 조회
          const q = query(collection(db, "userInfo"), where("info.email", "==", email));
          console.log("Firestore query initiated for email:", email);

          const querySnapshot = await getDocs(q);

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

          return true; // 모든 작업이 완료된 경우 true 반환
        }
        return false; // 지원하지 않는 제공자의 경우 false 반환
      } catch (error) {
        console.error("Error during signIn callback:", error);
        return false; // 에러 발생 시 false 반환
      }
    },

    async jwt({ token, account, profile }) {
      try {
        if (account) {
          token.accessToken = account.access_token;
        }
        return token;
      } catch (error) {
        console.error("Error during JWT callback:", error);
        return token;
      }
    },

    async session({ session, token }) {
      try {
        session.accessToken = token.accessToken;
        return session;
      } catch (error) {
        console.error("Error during session callback:", error);
        return null;
      }
    },
  },

  pages: {
    error: "/auth/error",
  },
};

export default NextAuth(authOptions);
