import React, { useState, useEffect, ReactNode } from "react";
export interface DelayProps {
  children: ReactNode;
  delay?: number;
}
export const Delay = ({ children, delay = 150 }: DelayProps) => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setDone(true), delay);
    return () => clearTimeout(showTimer);
  });

  return done && <>{children}</>;
};
