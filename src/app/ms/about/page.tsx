import { AboutView, aboutMetadata } from "@/views/about";

export const metadata = aboutMetadata("ms");

export default function Page() {
  return <AboutView lang="ms" />;
}
