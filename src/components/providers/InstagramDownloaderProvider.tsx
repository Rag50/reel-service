"use client";

import React from "react";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";

export function InstagramDownloaderProvider({ children }: { children: React.ReactNode }) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
} 