import type { Metadata } from "next";
import { site } from "@/data/content";

export const metadata: Metadata = { title: "Privacy notice", robots: { index: false } };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-[84px] sm:px-8 sm:pt-32">
      <p className="eyebrow">Privacy</p>
      <h1 className="t-title mt-2">Privacy notice</h1>
      {site.privacyNotice ? (
        <div className="mt-8 space-y-4 text-[16px] whitespace-pre-line text-muted">{site.privacyNotice}</div>
      ) : (
        <div className="card mt-8 space-y-4 p-7 text-[16px] text-muted">
          <p>
            When you send an enquiry, {site.consultantName} uses the details you provide (your name, phone number, email
            and the information in your message) only to respond to that enquiry and to help you with your property
            search.
          </p>
          <p>You can ask for your details to be corrected or deleted at any time by contacting {site.consultantName} on WhatsApp.</p>
          <p>
            This site uses privacy-friendly page analytics that do not use cookies or collect personal information.
          </p>
          <p className="text-[13px] text-subtle">
            Consent wording version {site.consentVersion}. A full notice under the Personal Data Protection Act 2010 will be
            published here.
          </p>
        </div>
      )}
    </div>
  );
}
