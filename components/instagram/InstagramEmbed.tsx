"use client";

import { useEffect, useRef } from "react";
import type { InstagramReel } from "@/lib/instagram";

const EMBED_SCRIPT_ID = "instagram-embed-script";

/**
 * Official Instagram Reel embed. Client Component island handling the
 * Instagram embed script injection and processing.
 *
 * Uses Instagram's official embed.js to render genuine Instagram content
 * rather than fake thumbnails or scraped previews.
 */
export function InstagramEmbed({ reel }: { reel: InstagramReel }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Script already loaded: ask it to process this newly mounted blockquote.
    if (window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    // Script requested but still loading (sibling embeds mount together):
    // embed.js processes every blockquote on the page when it finishes, so
    // injecting a second copy is unnecessary.
    if (document.getElementById(EMBED_SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = EMBED_SCRIPT_ID;
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      className="factory-instagram-embed-wrapper"
    >
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={reel.url}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: "3px",
          boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
          margin: "1px",
          maxWidth: "540px",
          minWidth: "326px",
          padding: 0,
          width: "calc(100% - 2px)",
        }}
      >
        <a
          href={reel.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            background: "#FFFFFF",
            lineHeight: 0,
            padding: "0 0",
            textAlign: "center",
            textDecoration: "none",
            width: "100%",
          }}
        >
          View this post on Instagram
        </a>
      </blockquote>
    </div>
  );
}

// Extend window type for Instagram embed script
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}
