"use client";

import { useCallback } from "react";
import { LuClipboardCopy } from "react-icons/lu";

export default function LoginInfo({
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
      <p>{text}</p>
      <button onClick={copyToClipboard} className="flex text-blue-500 mt-3">
        <LuClipboardCopy />
        <span className="ml-2 -mt-1">Copier</span>
      </button>
    </div>
  );
}
