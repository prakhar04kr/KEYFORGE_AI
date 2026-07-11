import { useState, useEffect } from "react";

export function useUsername() {
  const [username, setUsernameState] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("keyforge_username");
    if (stored) {
      setUsernameState(stored);
    } else {
      setIsDialogOpen(true);
    }
  }, []);

  const setUsername = (name: string) => {
    const finalName = name.trim() || "Guest";
    localStorage.setItem("keyforge_username", finalName);
    setUsernameState(finalName);
    setIsDialogOpen(false);
  };

  return { username: username || "Guest", setUsername, isDialogOpen, setIsDialogOpen };
}
