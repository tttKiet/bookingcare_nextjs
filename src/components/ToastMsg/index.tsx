"use client";
import { ToasterProps } from "react-hot-toast/headless";
import { Toaster, useToasterStore, toast } from "react-hot-toast";
import { useEffect } from "react";

const TOAST_LIMIT = 3;
export default function ToastMsg(props: ToasterProps) {
  const { toasts } = useToasterStore();
  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit?
      .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) for no exit animation
  }, [toasts]);
  return <Toaster {...props} />;
}
