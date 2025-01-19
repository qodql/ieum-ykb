import NextAuth from "next-auth";
import NaverProvider from "next-auth/providers/naver";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/firebase";
import { getDocs, query, where, collection, addDoc } from "firebase/firestore";

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
          scope: "email name nickname",
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const q = query(
          collection(db, "userInfo"),
          where("info.email", "==", credentials.email),
          where("info.password", "==", credentials.password)
        );
        const querySnapshot = await getDocs(q);
        let user = null;
        querySnapshot.docs.map((doc) => {
          user = doc.data();
        });
        if (user) {
          return user.info;
        } else {
          throw new Error('Invalid credentials');
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        if (account.provider === 'credentials') {
          const q = query(
            collection(db, "userInfo"),
            where("info.email", "==", credentials.email),
            where("info.password", "==", credentials.password)
          );
          const querySnapshot = await getDocs(q);
          if (querySnapshot.empty) {
            console.error('Invalid credentials during sign-in');
            return false;
          }
          return true;
        } else if (['naver', 'google', 'github'].includes(account.provider)) {
          let email;

          // 네이버 프로필 확인 및 처리
          if (account.provider === 'naver') {
            const naverProfile = profile?.response;
            if (!naverProfile || !naverProfile.email) {
              console.error('Naver profile is missing email information.');
              throw new Error('Naver authentication failed: No email found.');
            }
            email = naverProfile.email;
          } else {
            email = user.email;
          }

          // Firebase Firestore에서 사용자 확인
          const q = query(
            collection(db, "userInfo"),
            where("info.email", "==", email)
          );
          const querySnapshot = await getDocs(q);

          // Firestore에 사용자 추가
          if (querySnapshot.empty) {
            const userRef = collection(db, "userInfo");
            if (account.provider === 'google' || account.provider === 'github') {
              await addDoc(userRef, {
                info: {
                  id: user.id,
                  nickname: user.name,
                  email: user.email,
                  provider: account.provider
                }
              });
            } else if (account.provider === 'naver') {
              try {
                await addDoc(userRef, {
                  info: {
                    id: profile.response.id,
                    name: profile.response.name,
                    email: profile.response.email,
                    nickname: profile.response.nickname,
                    phonenum: profile.response.mobile,
                    provider: account.provider,
                    image: '/img_member_profile.svg'
                  }
                });
                console.log("Naver user added to Firestore successfully");
              } catch (error) {
                console.error("Error adding Naver user to Firestore:", error);
                throw new Error('Failed to add user to Firestore');
              }
            }
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error during signIn callback:', error);
        return false;
      }
    },

    async jwt({ token, user, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
      } else if (user) {
        token.accessToken = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    }
  }
};

export default NextAuth(authOptions);
