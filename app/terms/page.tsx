import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Conditions — Trading Competition',
  description: '42 Trading Competition Terms and Conditions',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-brand"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Leaderboard
      </Link>

      <h1 className="mb-2 bg-gradient-to-r from-[#d745ff] via-[#de8bf3] to-[#d745ff] bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl">
        Terms &amp; Conditions
      </h1>
      <p className="mb-8 text-sm text-text-secondary">
        42 Trading Competition — Phase 1
      </p>

      <ol className="list-none space-y-5">
        <TermsItem number={1}>
          The phase 1 of 42 Trading Contest (the &ldquo;Competition&rdquo;) will take place
          during the period of{' '}
          <strong className="text-white">April [x], 00:00 UTC → April [x], 12:00 UTC</strong>{' '}
          (the &ldquo;Competition Period&rdquo;).
        </TermsItem>

        <TermsItem number={2}>
          Participants may trade across all eligible markets on 42 during the
          Competition Period. Eligible markets are defined as those launched after
          the start of the Competition Period and are the only markets that will be
          considered for participation and scoring.
        </TermsItem>

        <TermsItem number={3}>
          A minimum of{' '}
          <strong className="text-white">$25 in trading volume</strong> is required
          to qualify for participation.
        </TermsItem>

        <TermsItem number={4}>
          <a
            href="https://trading-competition.42.space/"
            className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition-colors hover:text-brand3 hover:decoration-brand3/30"
          >
            Rankings
          </a>{' '}
          shall be determined based on realized PnL, with trading volume used as a
          tiebreaker.
        </TermsItem>

        <TermsItem number={5}>
          PnL from markets that have not ended, been resolved or finalized by the
          conclusion of the Competition Period shall not be counted.
        </TermsItem>

        <TermsItem number={6}>
          Any abusive or manipulative activity, including but not limited to
          botting or cheating, shall result in immediate disqualification.
        </TermsItem>

        <TermsItem number={7}>
          Final results shall be confirmed within{' '}
          <strong className="text-white">three (3) business days</strong> following
          the end of the Competition Period.
        </TermsItem>

        <TermsItem number={8}>
          The top{' '}
          <strong className="text-white">five (5) traders</strong> shall advance to
          the final round.
        </TermsItem>

        <TermsItem number={9}>
          42 reserves the right, at its sole discretion, to amend, modify, or
          update these Terms and Conditions at any time without prior notice.
        </TermsItem>
      </ol>
    </div>
  )
}

function TermsItem({
  number,
  children,
}: {
  number: number
  children: React.ReactNode
}) {
  return (
    <li className="flex gap-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand2/30 bg-brand2/10 text-xs font-semibold text-brand3">
        {number}
      </span>
      <p className="pt-0.5 text-sm leading-relaxed text-white/70">{children}</p>
    </li>
  )
}
