"use client";

import { ReactNode } from "react";
import AppProviders from "@/components/AppProviders";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  return (
    <AppProviders>
      <SmoothScroll />
      <Navbar />
      <main className="lg:pl-24">
        {children}
        <Footer />
      </main>
    </AppProviders>
  );
};

export default AppShell;
