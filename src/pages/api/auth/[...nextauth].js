import NextAuth from "next-auth";
import NaverProvider from "next-auth/providers/naver";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/firebase";
import { getDocs, query, where, collection, addDoc } from "firebase/firestore";
import { signOut } from "next-auth/react";

export const authOptions = {
  secret: '968416519848645165',
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
        if (['naver', 'google', 'github'].includes(account.provider)) {
          let email;

          if (account.provider === "naver") {
            console.log("Naver Profile:", profile);

            // 네이버 프로필 데이터 검증
            const naverProfile = profile?.response;
            if (!naverProfile) {
              console.error("No response from Naver API");
              await signOut(); // 세션 초기화
              return false;
            }
            if (!naverProfile.email) {
              console.error("Email is missing in Naver profile");
              await signOut(); // 세션 초기화
              return false;
            }

            email = naverProfile.email;
          } else {
            email = user.email;
          }

          // Firestore에서 사용자 조회
          const q = query(collection(db, "userInfo"), where("info.email", "==", email));
          const querySnapshot = await getDocs(q);

          // Firestore에 사용자 정보가 없으면 추가
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
              await addDoc(collection(db, "userInfo"), { info: userInfo });
              console.log(`${account.provider} user added to Firestore:`, userInfo);
            } catch (error) {
              console.error(`Failed to add user to Firestore (${account.provider}):`, error);
              throw new Error("Failed to save user in Firestore");
            }
          }
          return true; // 로그인 성공
        }
        return false; // 기타 제공자 처리 실패
      } catch (error) {
        console.error("Error during signIn callback:", error);
        await signOut(); // 세션 초기화
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    error: '에러발생', 
  },
};

export default NextAuth(authOptions);
