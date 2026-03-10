import { ArrowRightIcon, FileCodeIcon, PrinterIcon, SettingsIcon, SparkIcon } from '../common/ActionIcons';

interface LandingPageProps {
  onGetStarted: () => void;
}

const revealStyle = (delayMs: number) => ({ animationDelay: `${delayMs}ms` });
const animatedFeatures = [
  'GST Auto Tax Engine',
  'Live Invoice Preview',
  'One-click PDF Export',
  'JSON Backup & Restore',
  'Multi-page Print Layout',
  'UPI + Bank Payment Blocks',
];

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  return (
    <div className="mx-auto flex h-full max-w-[1320px] flex-col px-4 pb-20 pt-4 sm:px-6 lg:px-8">
      <section className="landing-shell relative flex h-full min-h-0 flex-col overflow-hidden rounded-[34px] border border-[#f8f7f3]/65 bg-[#ece9e1] p-5 shadow-[0_28px_70px_rgba(0,0,0,0.28)] sm:p-8 lg:p-10 xl:justify-center">
        <div className="landing-orb landing-orb-left" aria-hidden />
        <div className="landing-orb landing-orb-right" aria-hidden />
        <div className="landing-scanline" aria-hidden />

        <div className="mx-auto w-full max-w-4xl text-center">
          <p
            className="landing-reveal bg-gradient-to-r from-[#0d1328] via-[#1d64df] to-[#0d1328] bg-clip-text text-[clamp(2.2rem,8vw,5.8rem)] font-extrabold leading-none tracking-tight text-transparent"
            style={revealStyle(0)}
          >
            QuikInvoice
          </p>

          <span
            className="landing-reveal inline-flex items-center gap-2 rounded-full border border-[#d8d3c6] bg-white/70 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#595142]"
            style={revealStyle(30)}
          >
            <SparkIcon className="h-3.5 w-3.5 text-[#1b66d9]" />
            QuikInvoice • Fast GST Invoicing
          </span>

          <div
            className="landing-reveal landing-feature-marquee mt-4"
            style={revealStyle(70)}
            aria-label="QuikInvoice feature highlights"
          >
            <div className="landing-feature-track">
              {animatedFeatures.map((feature) => (
                <span key={`feature-a-${feature}`} className="landing-feature-chip">
                  <SparkIcon className="h-3 w-3 text-[#1f6fe8]" />
                  {feature}
                </span>
              ))}
              {animatedFeatures.map((feature) => (
                <span key={`feature-b-${feature}`} className="landing-feature-chip">
                  <SparkIcon className="h-3 w-3 text-[#1f6fe8]" />
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <h1
            className="landing-reveal mt-4 bg-gradient-to-r from-[#0f1220] via-[#1d5fd8] to-[#0f1220] bg-clip-text text-balance text-2xl font-semibold leading-tight tracking-tight text-transparent sm:text-4xl"
            style={revealStyle(110)}
          >
            Create and send professional invoices online
          </h1>

          <p
            className="landing-reveal mx-auto mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-[#413d35] sm:text-lg"
            style={revealStyle(150)}
          >
            Build clean GST-ready invoices, add discounts and taxes, export PDF, and share drafts with JSON in minutes.
          </p>

          <div
            className="landing-reveal mt-5 flex flex-wrap items-center justify-center gap-3"
            style={revealStyle(200)}
          >
            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0f5fd6] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(15,95,214,0.35)] transition hover:bg-[#0b52bc]"
            >
              <SparkIcon className="h-4 w-4" />
              Get started for free
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <article
            className="landing-reveal landing-showcase-card bg-gradient-to-br from-[#f7f5ef] to-[#dbd7cd]"
            style={revealStyle(240)}
          >
            <div className="mx-auto mt-4 h-[62%] max-h-[215px] min-h-[140px] w-[min(165px,72%)] rounded-[24px] bg-[#090d13] p-3 shadow-[0_14px_34px_rgba(0,0,0,0.38)]">
              <div className="h-full rounded-[18px] bg-white p-3">
                <div className="h-2.5 w-10 rounded-full bg-[#2f78ec]/80" />
                <div className="mt-4 h-2 w-24 rounded-full bg-[#e0e0e3]" />
                <div className="mt-2 h-2 w-16 rounded-full bg-[#ececef]" />
                <div className="mt-5 grid grid-cols-4 gap-2">
                  <span className="h-11 rounded-md border border-[#cbd7ef] bg-[#f2f7ff]" />
                  <span className="h-11 rounded-md border border-[#e6e6e9] bg-[#fbfbfc]" />
                  <span className="h-11 rounded-md border border-[#e6e6e9] bg-[#fbfbfc]" />
                  <span className="h-11 rounded-md border border-[#e6e6e9] bg-[#fbfbfc]" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-2 left-1/2 w-[88%] -translate-x-1/2 rounded-2xl border border-[#cfcabf] bg-[#f6f3ec] p-3 shadow-[0_12px_30px_rgba(25,25,25,0.12)]">
              <p className="text-[11px] font-semibold text-[#3e3a33]">Choose Template</p>
              <p className="mt-1 text-[10px] text-[#797468]">Standard, spreadsheet, compact</p>
            </div>
          </article>

          <article
            className="landing-reveal landing-showcase-card hidden bg-gradient-to-br from-[#ebe8df] to-[#d9d4c8] sm:block"
            style={revealStyle(300)}
          >
            <div className="mx-auto mt-4 h-[62%] max-h-[205px] min-h-[135px] w-[88%] rounded-2xl border border-[#99948a] bg-[#171b23] p-2 shadow-[0_14px_34px_rgba(0,0,0,0.28)]">
              <div className="h-full rounded-xl bg-[#f8fafc] p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#f36b6b]" />
                  <span className="h-2 w-2 rounded-full bg-[#e7d35c]" />
                  <span className="h-2 w-2 rounded-full bg-[#69d26f]" />
                </div>
                <div className="mt-3 grid grid-cols-[56px_1fr] gap-2">
                  <div className="space-y-2">
                    <span className="block h-2 rounded bg-[#d9deea]" />
                    <span className="block h-2 rounded bg-[#d9deea]" />
                    <span className="block h-2 rounded bg-[#d9deea]" />
                  </div>
                  <div className="space-y-2">
                    <span className="block h-3 rounded bg-[#eaf0ff]" />
                    <span className="block h-10 rounded bg-[#f4f6fb]" />
                    <span className="block h-8 rounded bg-[#f4f6fb]" />
                  </div>
                </div>
              </div>
            </div>
            <p className="absolute bottom-3 left-4 text-xs font-medium text-[#5b564a]">Desktop invoice editor</p>
          </article>

          <article
            className="landing-reveal landing-showcase-card hidden bg-gradient-to-br from-[#f2efe6] to-[#ddd8cc] lg:block"
            style={revealStyle(360)}
          >
            <div className="mx-auto mt-4 w-[88%] rounded-2xl border border-[#d6d2c7] bg-white p-4 shadow-[0_12px_30px_rgba(25,25,25,0.12)]">
              <p className="text-[11px] text-[#6d6a62]">Total Amount</p>
              <p className="mt-1 text-2xl font-semibold text-[#1b1b1a]">₹4,296.00</p>
              <div className="mt-4 grid grid-cols-4 gap-2 text-[#4f4a40]">
                <span className="inline-flex h-8 items-center justify-center rounded-md bg-[#f2f4f8]"><PrinterIcon className="h-4 w-4" /></span>
                <span className="inline-flex h-8 items-center justify-center rounded-md bg-[#f2f4f8]"><SparkIcon className="h-4 w-4" /></span>
                <span className="inline-flex h-8 items-center justify-center rounded-md bg-[#f2f4f8]"><FileCodeIcon className="h-4 w-4" /></span>
                <span className="inline-flex h-8 items-center justify-center rounded-md bg-[#f2f4f8]"><SettingsIcon className="h-4 w-4" /></span>
              </div>
              <button
                type="button"
                onClick={onGetStarted}
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-[#0f5fd6] px-3 py-2 text-xs font-semibold text-white"
              >
                Send via Mail
              </button>
            </div>
          </article>

          <article
            className="landing-reveal landing-showcase-card hidden bg-gradient-to-br from-[#ebe8df] via-[#dfdbd0] to-[#d5d0c4] xl:block"
            style={revealStyle(420)}
          >
            <div className="mx-auto mt-4 h-[66%] max-h-[230px] min-h-[150px] w-[min(170px,72%)] rotate-[9deg] rounded-[26px] border border-[#a59f95] bg-[#10151d] p-3 shadow-[0_20px_35px_rgba(0,0,0,0.25)]">
              <div className="h-full rounded-[18px] bg-white p-4">
                <div className="mx-auto h-8 w-8 rounded-full bg-[#1671ee]" />
                <p className="mt-3 text-center text-xs font-medium text-[#5d5a53]">Amount received</p>
                <p className="mt-1 text-center text-lg font-semibold text-[#121212]">₹4,296.00</p>
                <div className="mt-4 space-y-2">
                  <span className="block h-2 rounded-full bg-[#ececf0]" />
                  <span className="block h-2 rounded-full bg-[#ececf0]" />
                  <span className="block h-2 rounded-full bg-[#ececf0]" />
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};
