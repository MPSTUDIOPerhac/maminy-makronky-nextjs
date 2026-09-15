"use client";

import { useEffect, useState } from "react";

export default function Year() {
  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return <span>{year}</span>;
}
