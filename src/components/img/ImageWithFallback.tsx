"use client";

import React, { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";
import fallbackSrc from "../../assets/images/image_fallback-removebg.png";
const ImageWithFallback = ({ src, className, ...rest }: ImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [classImg, setClassImg] = useState(className);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);
  return (
    <Image
      {...rest}
      className={classImg}
      src={imgSrc}
      onLoadingComplete={(result) => {
        if (result.naturalWidth === 0) {
          // Broken image
          setImgSrc(fallbackSrc);
          setClassImg((p) => p + " shadow-none");
        }
      }}
      onError={() => {
        setImgSrc(fallbackSrc);
        setClassImg((p) => p + " shadow-none");
      }}
    />
  );
};

export default ImageWithFallback;
