"use client";

import { Box } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [ip, setIp] = useState<string | null>(null);

  // get ip
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        setIp(data.ip);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">{`Good morning, Amin ${ip}`}</h1>
      <Box className="text-3xl font-bold underline">{`Here is list features developed in this project`}</Box>
      <Link href="/check-npm-package">{`Check npm package`}</Link>
    </div>
  );
}
