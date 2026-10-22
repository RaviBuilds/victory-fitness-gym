import { business } from "@/lib/business";
import { instagramConfig } from "@/lib/instagram";
import { Container } from "@/components/ui/Container";
import { InstagramEmbed } from "@/components/instagram/InstagramEmbed";

/**
 * Instagram section — official Reel embeds with editorial framing.
 *
 * Server Component shell: header and layout are server-rendered. Only the
 * Instagram embed processing (InstagramEmbed) is a client island.
 *
 * ARCHITECTURE: All Instagram data (profile URL, handle, Reel URLs) lives
 * in lib/instagram.ts. Component receives zero hardcoded URLs.
 */
export function Instagram() {
  if (instagramConfig.items.length === 0) return null;

  return (
    <section
      className="factory-instagram-section"
      id="instagram"
      aria-labelledby="instagram-heading"
    >
      <Container>
        <div className="factory-instagram-header">
          <div>
            <div className="flex items-center gap-3">
              <span className="factory-eyebrow" aria-hidden="true">
                08
              </span>
              <span className="factory-eyebrow">Instagram</span>
            </div>
            <h2 id="instagram-heading" className="factory-instagram-heading">
              <span>Training. People.</span>
              <span>The gym in motion.</span>
            </h2>
          </div>

          <div className="factory-instagram-aside">
            <p className="factory-instagram-name">
              {instagramConfig.handle ?? business.name}
            </p>
            {/* The profile link renders only when a verified profile URL exists. */}
            {instagramConfig.profileUrl && (
              <a
                href={instagramConfig.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="factory-instagram-cta factory-focus"
              >
                View more on Instagram
                <svg
                  className="factory-instagram-cta-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>

        {/* Renders every supplied item. Snap rail below 1280px, three columns above. */}
        <div
          className="factory-instagram-grid"
          role="group"
          aria-label="Instagram Reels"
        >
          {instagramConfig.items.map((reel) => (
            <div key={reel.id} className="factory-instagram-grid-item">
              <InstagramEmbed reel={reel} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}