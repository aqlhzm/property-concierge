import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center px-5 pt-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-[40px] leading-tight">This page isn’t here</h1>
      <p className="mt-3 text-[16px] text-muted">The link may be old, or the development may have been updated.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/projects" className="btn btn-primary">
          Browse developments
        </Link>
        <Link href="/" className="btn btn-ghost">
          Home
        </Link>
      </div>
    </div>
  );
}
