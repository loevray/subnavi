export type ExploreSectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

export type ExploreSectionBadge = {
  label: string;
  tone?: 'default' | 'accent';
};

function getBadgeClassName(tone: ExploreSectionBadge['tone'] = 'default') {
  if (tone === 'accent') {
    return 'rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-700';
  }

  return 'rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700';
}

export default function ExploreFeedSection({
  copy,
  badges = [],
  isHomeFeed,
  children,
  footer,
}: {
  copy: ExploreSectionCopy;
  badges?: ExploreSectionBadge[];
  isHomeFeed: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section
      id="event-list"
      className="rounded-[32px] border border-slate-200/80 bg-white/90 px-5 py-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:px-6 lg:px-8 lg:py-8"
    >
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{copy.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-[2.35rem]">
            {copy.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{copy.description}</p>
        </div>

        {!isHomeFeed && badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {badges.map(({ label, tone = 'default' }) => (
              <span key={label} className={getBadgeClassName(tone)}>
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {children}
      {footer}
    </section>
  );
}
