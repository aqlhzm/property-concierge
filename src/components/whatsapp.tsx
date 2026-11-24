import type { WhatsAppContext } from "@/data/types";
import { whatsappHref } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./whatsapp-icon";

export { WhatsAppIcon };

type Vars = Parameters<typeof whatsappHref>[1];

export function WhatsAppLink({
  context,
  vars,
  children,
  className = "btn btn-primary",
}: {
  context: WhatsAppContext;
  vars?: Vars;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href={whatsappHref(context, vars)} target="_blank" rel="noopener noreferrer" className={className}>
      <WhatsAppIcon size={18} />
      {children}
    </a>
  );
}

export { WhatsAppFloat } from "./whatsapp-float";
