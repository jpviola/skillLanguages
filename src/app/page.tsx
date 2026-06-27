"use client";
import Link from "next/link";
import {
  GraduationCap,
  Languages,
  MessageCircle,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  FlaskConical,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const STEPS = [
  { icon: GraduationCap, key: "step1" },
  { icon: MessageCircle, key: "step2" },
  { icon: RefreshCw, key: "step3" },
];

export default function Landing() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-page">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2 font-bold text-ink">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white">
            <GraduationCap size={18} />
          </span>
          SkillPath AI
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/onboard"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            {t("landing.getStarted")}
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-24">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
          <Languages size={13} /> {t("landing.badge")}
        </span>
        <h1 className="mt-5 text-4xl font-bold leading-tight text-ink sm:text-5xl">
          {t("landing.heroPre")} <span className="text-primary">{t("landing.heroEm")}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">{t("landing.sub")}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/onboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90"
          >
            {t("landing.ctaBuild")} <ArrowRight size={16} />
          </Link>
          <Link
            href="/onboard?demo=1"
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-6 py-3 text-sm font-semibold text-ink hover:border-primary/40"
          >
            <FlaskConical size={16} /> {t("landing.ctaDemo")}
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-ink-soft">
          {["landing.chip1", "landing.chip2", "landing.chip3"].map((k) => (
            <span key={k} className="inline-flex items-center gap-1">
              <CheckCircle2 size={14} className="text-emerald-500" /> {t(k)}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-ink">{t("landing.howItWorks")}</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={i} className="card p-6">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary-light text-primary">
                <s.icon size={20} />
              </div>
              <h3 className="mt-4 font-semibold text-ink">{t(`${s.key}.title`)}</h3>
              <p className="mt-1 text-sm text-ink-soft">{t(`${s.key}.text`)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
