import React, { useEffect, useRef, useState } from "react";
import PopIn from "./motions/popin";
import Expand from "./motions/expand";
import htmlToImage from "html-to-image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import Button from "./Button";
import { useRouter } from "next/router";
import WindowButton from "./WindowButton";
import FadeIn from "./motions/FadeIn";
import Message from "./Message";

interface ChatWindowProps {
  messages: Message[];
  children?: React.ReactNode;
  className?: string;
  title: string;
  showDonation: boolean;
}

const messageListId = "chat-window-message-list";

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  children,
  className,
  title,
  showDonation,
}) => {
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    setHasUserScrolled(scrollTop < scrollHeight - clientHeight - 10);
  };

  useEffect(() => {
    if (scrollRef.current) {
      if (!hasUserScrolled) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [hasUserScrolled]);

  return (
    <div
      className={
        "border-translucent flex w-full flex-col rounded-2xl border-2 border-white/20 bg-zinc-900 text-white shadow-2xl drop-shadow-lg " +
        (className ?? "")
      }
    >
      <MacWindowHeader title={title} messages={messages} />
      <div
        className="window-heights mb-2 mr-2"
        ref={scrollRef}
        onScroll={handleScroll}
        id={messageListId}
      >
        {messages.map((message, index) => (
          <FadeIn key={`${index}-${message.type}`}>
            <ChatMessage message={message} />
          </FadeIn>
        ))}
        {children}

        {messages.length === 0 && (
          <>
            <Expand delay={0.8} type="spring">
              <ChatMessage
                message={{
                  type: "system",
                  value:
                    "> Create an agent by adding a name / goal, and hitting deploy!",
                }}
              />
            </Expand>
            <Expand delay={0.9} type="spring">
              <ChatMessage
                message={{
                  type: "system",
                  value:
                    "📢 You can provide your own OpenAI API key in the settings tab for increased limits!",
                }}
              />
              {showDonation && (
                <Expand delay={0.7} type="spring">
                  <DonationMessage />
                </Expand>
              )}
            </Expand>
          </>
        )}
      </div>
    </div>
  );
};

interface HeaderProps {
  title: string;
  messages: Message[];
}

const MacWindowHeader: React.FC<HeaderProps> = (props) => {
  const saveElementAsImage = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      htmlToImage
        .toJpeg(element)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "agent-gpt-output.png";
          link.click();
        })
        .catch(console.error);
    }
  };

  const copyElementText = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      navigator.clipboard.writeText(element.innerText);
    }
  };

  return (
    <div className="flex items-center gap-1 overflow-hidden rounded-t-3xl p-3">
      <PopIn delay={0.4}>
        <div className="h-3 w-3 rounded-full bg-red-500" />
      </PopIn>
      <PopIn delay={0.5}>
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
      </PopIn>
      <PopIn delay={0.6}>
        <div className="h-3 w-3 rounded-full bg-green-500" />
      </PopIn>
      <div className="flex flex-grow font-mono text-sm font-bold text-gray-600 sm:ml-2">
        {props.title}
      </div>
      <WindowButton
        delay={0.7}
        onClick={(): void => saveElementAsImage(messageListId)}
        icon={<FaImage size={12} />}
        text={
