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
      <p className="overflow-scroll">{text}</p>
      <button onClick={copyToClipboard} className="flex text-blue-500">
        <LuClipboardCopy />
        <span className="ml-2 -mt-1">Copier</span>
      </button>
    </div>
  );
}
