import NextAuth from "next-auth";
import NaverProvider from "next-auth/providers/naver";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/firebase";
import { getDocs, query, where, collection, addDoc } from "firebase/firestore";

export const authOptions = {
  secret: '968416519848645165',
  debug: true,
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
        try {
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
            console.error("Invalid credentials during authorize.");
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          console.error("Error during authorize callback:", error);
          throw error;
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
            console.error("Invalid credentials in signIn.");
            return false;
          }
          return true;
        } else if (['naver', 'google', 'github'].includes(account.provider)) {
          let email;

          if (account.provider === 'naver') {
            const naverProfile = profile?.response;
            if (!naverProfile || !naverProfile.email) {
              console.log("Naver Profile:", profile);
              return false;
            }
            email = naverProfile.email;
          } else {
            email = user.email;
          }

          const q = query(
            collection(db, "userInfo"),
            where("info.email", "==", email)
          );
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            const userRef = collection(db, "userInfo");
            const userInfo = {
              id: account.provider === 'naver' ? profile.response.id : user.id,
              name: account.provider === 'naver' ? profile.response.name : user.name,
              email: email,
              nickname: account.provider === 'naver' ? profile.response.nickname : user.name,
              provider: account.provider,
              image: account.provider === 'naver' ? '/img_member_profile.svg' : user.image,
            };

            try {
              await addDoc(userRef, { info: userInfo });
              console.log(`${account.provider} user added to Firestore:`, userInfo);
            } catch (error) {
              console.error(`Error adding user to Firestore (${account.provider}):`, error);
              throw new Error("Failed to add user to Firestore");
            }
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error during signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user, account, profile }) {
      try {
        if (account) {
          token.accessToken = account.access_token;
        } else if (user) {
          token.accessToken = user.id;
        }
        return token;
      } catch (error) {
        console.error("Error during jwt callback:", error);
        throw error;
      }
    },

    async session({ session, token }) {
      try {
        session.accessToken = token.accessToken;
        return session;
      } catch (error) {
        console.error("Error during session callback:", error);
        throw error;
      }
    }
  }
};

export default NextAuth(authOptions);
