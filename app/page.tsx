"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import WelcomeScreen from "@/components/WelcomeScreen";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleLoadingComplete = () => {
    setShowWelcome(false);
    window.location.href = "/login-new";
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {showWelcome && (
        <WelcomeScreen
          key="welcome"
          onLoadingComplete={handleLoadingComplete}
        />
      )}
    </AnimatePresence>
  );
}
