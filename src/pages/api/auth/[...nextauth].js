import NextAuth from "next-auth";
import NaverProvider from "next-auth/providers/naver";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { db } from "@/lib/firebase";
import { getDocs, query, where, collection, addDoc } from "firebase/firestore";
import CredentialsProvider from "next-auth/providers/credentials";

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
    })
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === 'credentials') {
        // 자체 로그인 처리
        const q = query(
          collection(db, "userInfo"),
          where("info.email", "==", credentials.email),
          where("info.password", "==", credentials.password)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          throw new Error('Invalid credentials');
        }
        return true;
      } else if (account.provider === 'naver' || account.provider === 'google' || account.provider === 'github') {
        // 외부 로그인 제공자 처리
        let email;
  
        if (account.provider === 'naver') {
          email = profile.response.email;
        } else if (account.provider === 'google' || account.provider === 'github') {
          email = user.email;
        }
  
        const q = query(
          collection(db, "userInfo"),
          where("info.email", "==", email)
        );
        const querySnapshot = await getDocs(q);
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
                  nickName: profile.response.nickname,
                  phoneNum: profile.response.mobile,
                  provider: account.provider,
                  image: '/img_member_profile.svg'
                }
              });
  
              console.log("Documents added successfully");
            } catch (error) {
              console.error("Error adding documents: ", error);
              throw new Error('Failed to add documents');
            }
          }
        }
        return true;
      }
      return false;
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