import { type ReactNode } from "react";
import Head from "next/head";
import DottedGridBackground from "../components/DottedGridBackground";
import clsx from "clsx";
import Script from "next/script";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const DefaultLayout = (props: LayoutProps) => {
  const description =
    "Assemble, configure, and deploy autonomous AI Agents in your browser.";
  return (
    <div
      className={clsx("flex flex-col min-h-screen bg-gradient-to-b from-[#2B2B2B] to-[#1F1F1F]", props.className)}
      aria-label="AgentGPT: Autonomous AI in your browser"
    >
      <Head>
        <title>AgentGPT</title>
        <meta name="description" content={description} />
        <meta name="twitter:site" content="@AgentGPT" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AgentGPT 🤖" />
        <meta name="twitter:description" content={description} />
        <meta
          name="twitter:image"
          content="https://agentgpt.reworkd.ai/banner.png"
        />
        <meta name="twitter:image:width" content="1280" />
        <meta name="twitter:image:height" content="640" />
        <meta property="og:title" content="AgentGPT: Autonomous AI in your browser 🤖" />
        <meta
          property="og:description"
          content="Assemble, configure, and deploy autonomous AI Agents in your browser."
        />
        <meta property="og:url" content="https://agentgpt.reworkd.ai/" />
        <meta
          property="og:image"
          content="https://agentgpt.reworkd.ai/banner.png"
        />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="640" />
        <meta property="og:type" content="website" />
        <meta
          name="google-site-verification"
          content="sG4QDkC8g2oxKSopgJdIe2hQ_SaJDaEaBjwCXZNkNWA"
        />
        <link rel="icon" href="/favicon.ico" />
        <Script
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
          data-domain="agentgpt.reworkd.ai"
        />
      </Head>
      {React.Children.map(props.children, (child, index) => (
        <DottedGridBackground key={index} className={props.
