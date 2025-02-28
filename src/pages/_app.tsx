import type { AppProps, AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";
import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";

type PageProps = AppProps & {
  session: Session | null;
};

const MyApp: AppType<PageProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      {session && <Analytics />}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
