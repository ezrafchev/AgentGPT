import PopIn from "./motions/popin";
import React from "react";

type WindowButtonProps = {
  delay: number;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  icon: React.ReactElement<any>;
  text: string;
};

const WindowButton: React.FC<WindowButtonProps> = ({ delay, onClick, icon: Icon, text }) => {
  return (
    <PopIn key={text} delay={delay}>
      <div
        className="mr-1 flex cursor-pointer items-center gap-2 rounded-full border-2 border-white/30 p-1 px-2 text-xs hover:bg-white/10"
        onClick={onClick}
      >
        <Icon alt={`${text} icon`} />
        <p className="font-mono">{text}</p>
      </div>
    </PopIn>
  );
};

export default WindowButton;
