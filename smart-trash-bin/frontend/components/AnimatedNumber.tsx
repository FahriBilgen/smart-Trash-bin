"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function AnimatedNumber({ value, precision = 0 }: { value: number, precision?: number }) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      setDisplay(Number(latest.toFixed(precision)));
    });
  }, [spring, precision]);

  return <>{display}</>;
}
