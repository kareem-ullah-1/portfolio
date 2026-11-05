import { siGithub, siGitlab, siWhatsapp } from 'simple-icons';

export function SocialIcon({ id, className = 'size-5' }: { id: string; className?: string }) {
  const icon = id === 'github' ? siGithub : id === 'gitlab' ? siGitlab : id === 'whatsapp' ? siWhatsapp : null;
  if (icon) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d={icon.path} />
      </svg>
    );
  }
  // simple-icons no longer ships a LinkedIn mark, so use a neutral "in" badge.
  return (
    <span
      className={`${className} grid place-items-center rounded-[4px] border border-current text-[0.6rem] leading-none font-bold`}
      aria-hidden="true"
    >
      in
    </span>
  );
}
