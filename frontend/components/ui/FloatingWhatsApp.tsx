import { WhatsAppLink } from '@/components/ui/WhatsAppLink';

export function FloatingWhatsApp() {
  return (
    <div className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40">
      <WhatsAppLink className="grid size-12 place-items-center rounded-full glass-pill text-[#25d366] hover:text-[#3ee98a]" />
    </div>
  );
}
