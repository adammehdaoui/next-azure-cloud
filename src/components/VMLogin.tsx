"use client";

import { LuClipboardCopy } from "react-icons/lu";

export default function VMLogin({
  text,
  textToCopy,
}: {
  text: string;
  textToCopy: string;
}) {
  function copyToClipboard() {
    navigator.clipboard.writeText(textToCopy);
  }

  return (
    <div>
      <span>{text}</span>
      <button onClick={copyToClipboard} className="ml-2">
        <LuClipboardCopy />
      </button>
    </div>
  );
}
