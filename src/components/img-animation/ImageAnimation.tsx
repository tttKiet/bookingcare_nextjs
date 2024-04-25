"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Image, ImageProps } from "@nextui-org/image";
import { InternalForwardRefRenderFunction } from "@nextui-org/system";

const hiddenMask = `repeating-linear-gradient(to right,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 30px,rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)`;
const visibleMask = `repeating-linear-gradient(to right,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 0px,rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)`;
interface Props extends ImageProps {
  delay?: number;
  duration?: number;
}
export function ImageAnimation({ ...props }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={
        isLoaded && isInView
          ? { WebkitMaskImage: visibleMask, maskImage: visibleMask, opacity: 1 }
          : { WebkitMaskImage: hiddenMask, maskImage: hiddenMask, opacity: 0 }
      }
      transition={{ duration: props.duration || 1, delay: props.delay || 1 }}
      viewport={{ once: true }}
      onViewportEnter={() => setIsInView(true)}
    >
      <Image onLoad={() => setIsLoaded(true)} {...props} />
    </motion.div>
  );
}
