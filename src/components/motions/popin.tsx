import { motion, Variants } from "framer-motion";
import type { PropsWithChildren, ReactNode } from "react";

interface PopInProps extends PropsWithChildren {
  className?: string;
  delay?: number;
  initialScale?: number;
  finalScale?: number;
}

const popInVariants: Variants = {
  initial: { scale: (props: PopInProps) => props.initialScale || 0 },
  animate: { scale: (props: PopInProps) => props.finalScale || 1 },
  transition: { duration: 0.5, type: "spring", delay: (props: PopInProps) => props.delay || 0 },
};

const PopIn = (props: PopInProps) => (
  <motion.div variants={popInVariants} custom={props} {...props}>
    {props.children}
  </motion.div>
);

PopIn.displayName = "PopIn";
export default PopIn;
