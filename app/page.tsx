import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-4xl flex-col gap-8 px-6 py-10 sm:flex-row sm:px-10">
        {/* Sidebar */}
        <aside className="flex w-full flex-col items-center gap-4 sm:w-64 sm:items-start">
          <Image
            className="rounded-full border border-black/[.08] object-cover dark:border-white/[.145]"
            src="/animal.jpeg"
            alt="mora-go's avatar"
            width={260}
            height={260}
            priority
          />
          <div>
            <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
              mora-go (Hyun-woo Yoo)
            </h1>
          </div>
          <a
            href="https://github.com/mora-go"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-md border border-solid border-black/[.15] px-4 py-1.5 text-center text-sm font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.2] dark:text-zinc-50 dark:hover:bg-white/[.08]"
          >
            Follow
          </a>
          <ul className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <li className="flex items-center gap-2">
              <span className="font-semibold text-black dark:text-zinc-50">3</span>
              followers{" "}
              <span className="text-zinc-400">·</span>{" "}
              <span className="font-semibold text-black dark:text-zinc-50">2</span>
              following
            </li>
            <li>@mora-house</li>
            <li>Earth</li>
          </ul>          
        </aside>

        {/* Content */}
        <section className="flex flex-1 flex-col gap-6">         
          <div className="rounded-md border border-solid border-black/[.1] p-4 dark:border-white/[.15]">
            <h2 className="mb-2 text-base font-semibold text-black dark:text-zinc-50">
              Contribution activity
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              1 contribution in the last year. Recent activity was made to{" "}
              <a
                href="https://github.com/org-mora-go/web-notepad"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-zinc-950 underline dark:text-zinc-50"
              >
                org-mora-go/web-notepad
              </a>
              .
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
