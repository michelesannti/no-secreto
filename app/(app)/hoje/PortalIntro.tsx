"use client";

import { useEffect, useState } from "react";

export default function PortalIntro({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showPortal, setShowPortal] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPortal(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (showPortal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f9f5e9]">

        <img
          src="/logo.png"
          alt="No Secreto"
          className="h-44 animate-pulse"
        />

      </div>
    );
  }

  return <>{children}</>;
}