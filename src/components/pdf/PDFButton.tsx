import WindowButton from "../WindowButton";
import { FaSave } from "react-icons/fa";
import { pdf } from "@react-pdf/renderer";
import React, { type FC } from "react";
import type { Message } from "../ChatWindow";
import MyDocument from "./MyDocument";

const PDFButton: FC<{ messages: Message[] }> = ({ messages }) => {
  const content = getContent(messages);

  const downloadPDF = async () => {
    try {
      const blob = await pdf(<MyDocument content={content} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "my-document.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <WindowButton
        delay={0.8}
        onClick={downloadPDF}
        icon={<FaSave size={12} />}
        text={"Save"}
      />
    </>
  );
};

const getContent = (messages: Message[]): string => {
  return messages
    .filter(message => message.type === "goal" || message.type === "task")
    .map(message => `${message.type}: ${message.value}`)
    .join("\n");
};

export default PDFButton;
