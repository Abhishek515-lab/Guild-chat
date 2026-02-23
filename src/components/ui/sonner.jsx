import React from "react";
import { Toaster as Sonner, toast } from "sonner";
import { useTheme } from "../../contexts/ThemeContext";

const Toaster = (props) => {
  const { theme } = useTheme();

  // Sonner sirf "light" ya "dark" support karta hai
  const sonnerTheme = theme === "light" ? "light" : "dark";

  return (
    <Sonner
      theme={sonnerTheme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]-background group-[.toaster]-foreground group-[.toaster]-border group-[.toaster]-lg",
          description: "group-[.toast]-muted-foreground",
          actionButton:
            "group-[.toast]-primary group-[.toast]-primary-foreground",
          cancelButton:
            "group-[.toast]-muted group-[.toast]-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };