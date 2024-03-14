import { motion, Variants } from "framer-motion";
import type { PropsWithChildren, ReactNode } from "react";

interface FadeInProps extends PropsWithChildren {
  className?: string;
  delay?: number;
  initialPositionY?: number;
  finalPositionY?: number;
}

const fadeInVariants: Variants = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
};

const transitionVariants = {
  type: "spring",
  duration: 0.5,
};

const FadeIn = (props: FadeInProps) => {
  const { children, delay = 0.3, initialPositionY = -30, finalPositionY = 0 } = props;

  return (
    <motion.div
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
      transition={transitionVariants}
      custom={delay}
      className={props.className}
      style={{ y: initialPositionY, transition: `all ${transitionVariants.duration}s ease` }}
    >
      {children}
    </motion.div>
  );
};

FadeIn.displayName = "FadeIn";
export default FadeIn;
