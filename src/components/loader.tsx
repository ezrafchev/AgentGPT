import React from "react";
import { Ring } from "@uiball/loaders";

interface LoaderProps {
  className?: string;
  size?: number;
  speed?: number;
  lineWeight?: number;
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({
  className,
  size = 16,
  speed = 2,
  lineWeight = 7,
  color = "white",
}) => {
  return (
    <div className={className} aria-label="Loading">
      <Ring key={size + speed + lineWeight + color} size={size} speed={speed} color={color} lineWeight={lineWeight} />
    </div>
  );
};

export default Loader;
