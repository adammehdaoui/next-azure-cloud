"use client";

import { LuClipboardCopy } from "react-icons/lu";
import { useCallback } from "react";

export default function Login({
  text,
  textToCopy,
}: {
  text: string;
  textToCopy: string;
}) {
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(textToCopy);
  }, [textToCopy]);

  return (
    <div>
      <p className="overflow-scroll">{text}</p>
      <button onClick={copyToClipboard} className="flex text-blue-500">
        <LuClipboardCopy />
        <span className="ml-2 -mt-1">Copier</span>
      </button>
    </div>
  );
}
