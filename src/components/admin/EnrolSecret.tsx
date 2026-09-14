"use client";

import { useState } from "react";

/**
 * The manual entry key, with a copy button.
 *
 * A QR cannot be scanned by the device showing it, so anyone setting this up
 * on a phone, or on a desktop with a password manager holding their codes,
 * needs the key itself rather than the picture of it.
 */
export function EnrolSecret({ secret }: { secret: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked, which is fine: the key is on screen to be typed.
    }
  };

  return (
    <div className="text-center">
      <p className="eyebrow text-ink-45">Or enter this key by hand</p>
      <p className="mt-2 text-[15px] font-semibold break-all select-all">{secret}</p>
      <button
        type="button"
        onClick={copy}
        className="mt-3 inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-[14px] transition-colors duration-150 hover:border-ink"
      >
        {copied ? "Copied" : "Copy key"}
      </button>
    </div>
  );
}
