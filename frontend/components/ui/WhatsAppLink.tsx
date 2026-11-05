import { SocialIcon } from '@/components/ui/SocialIcon';
import { site } from '@/lib/site';

/** Renders nothing until a valid WhatsApp number is configured. */
export function WhatsAppLink({ className, children }: { className?: string; children?: React.ReactNode }) {
  if (!site.whatsappUrl) return null;
  return (
    <a
      href={site.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Kareem on WhatsApp (opens in a new tab)"
      className={className}
    >
      <SocialIcon id="whatsapp" className="size-5 shrink-0" />
      {children}
    </a>
  );
}
