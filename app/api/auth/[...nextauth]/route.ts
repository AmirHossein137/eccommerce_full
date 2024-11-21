import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/utils/connectDB";
import UserModel from "@/models/user.model";
import { verifyPassword } from "@/utils/auth";

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials){
        try {
          await connectDB();
          const { email, password } = credentials as {
            email: string;
            password: string;
          };
          if (!email || !password) {
            throw new Error("Please enter valid information");
          }
          const user = await UserModel.findOne({ email });
          if (!user) {
            throw new Error("Please create an account first");
          }
          const isValid = await verifyPassword({
            password,
            hashedPassword: user.password,
          });

          if (!isValid) {
            throw new Error("UserName or Password Is wrong");
          }

          return { email };
        } catch (err) {
          console.log(err);
          throw new Error("A problem has occurred on the server");
        }
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
