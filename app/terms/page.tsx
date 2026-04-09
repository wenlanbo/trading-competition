import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms and Conditions — Trading Competition',
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
        Terms and Conditions
      </h1>
      <p className="mb-8 text-sm text-text-secondary">
        42 Trading Competition
      </p>

      <ol className="list-none space-y-5">
        <TermsItem number={1}>
          42 Trading Contest (the &ldquo;Competition&rdquo;) will take place
          during the period of{' '}
          <strong className="text-white">April 10, 00:00 UTC → April 20, 12:00 UTC</strong>{' '}
          (the &ldquo;Competition Period&rdquo;).
        </TermsItem>

        <TermsItem number={2}>
          Participants may trade across all eligible markets on 42 during the
          Competition Period.
          <SubItem>
            Eligible markets are defined as those markets launched after the
            start of the Competition Period and are the only ones that will be
            considered for participation and scoring.
          </SubItem>
        </TermsItem>

        <TermsItem number={3}>
          A minimum of{' '}
          <strong className="text-white">$25 in trading volume</strong> is
          required to qualify for the competition.
        </TermsItem>

        <TermsItem number={4}>
          <a
            href="https://trading-competition.42.space/"
            className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition-colors hover:text-brand3 hover:decoration-brand3/30"
          >
            Rankings
          </a>{' '}
          will be determined based on realized PnL, with trading volume used as
          a tiebreaker.
          <SubItem>
            PnL from markets that have not ended, been resolved or finalized by
            the conclusion of the Competition Period shall not be counted.
          </SubItem>
        </TermsItem>

        <TermsItem number={5}>
          Any abusive or manipulative activity, including but not limited to
          botting or cheating, shall result in immediate disqualification.
        </TermsItem>

        <TermsItem number={6}>
          Final results shall be confirmed within{' '}
          <strong className="text-white">three (3) business days</strong>{' '}
          following the end of the Competition Period.
        </TermsItem>

        <TermsItem number={7}>
          The top{' '}
          <strong className="text-white">five (5) traders</strong> will share a
          total prize pool of{' '}
          <strong className="text-white">$1,000</strong>, allocated as follows:
          <div className="mt-3 grid grid-cols-5 gap-2">
            <PrizeCard place="1st" amount="$400" />
            <PrizeCard place="2nd" amount="$250" />
            <PrizeCard place="3rd" amount="$175" />
            <PrizeCard place="4th" amount="$100" />
            <PrizeCard place="5th" amount="$75" />
          </div>
        </TermsItem>

        <TermsItem number={8}>
          Rewards will be distributed within{' '}
          <strong className="text-white">two (2) business days</strong> after
          the winners are officially announced.
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
      <div className="pt-0.5 text-sm leading-relaxed text-white/70">
        {children}
      </div>
    </li>
  )
}

function SubItem({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 border-l-2 border-brand2/20 pl-3 text-xs leading-relaxed text-white/50">
      {children}
    </p>
  )
}

function PrizeCard({ place, amount }: { place: string; amount: string }) {
  return (
    <div className="rounded-lg border border-brand2/20 bg-brand2/5 py-2 text-center">
      <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
        {place}
      </p>
      <p className="text-sm font-bold text-white">{amount}</p>
    </div>
  )
}
