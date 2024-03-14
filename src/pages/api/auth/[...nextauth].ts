export default {
  // Your auth options here
};


import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

export default NextAuth(authOptions);
