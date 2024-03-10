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
      <button onClick={copyToClipboard} className="-mt-5 ml-3">
        <LuClipboardCopy />
      </button>
    </div>
  );
}
