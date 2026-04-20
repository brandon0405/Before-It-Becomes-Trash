"use client";

import Image from "next/image";
import Link from "next/link";

import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAppLanguage } from "@/hooks/use-app-language";
import type { AppLanguage } from "@/lib/i18n";

type HomeCopy = {
  eyebrow: string;
  title: string;
  description: string;
  login: string;
  dashboard: string;
  demo: string;
  card1Title: string;
  card1Body: string;
  card2Title: string;
  card2Body: string;
  card3Title: string;
  card3Body: string;
  card4Title: string;
  card4Body: string;
};

const HOME_COPY: Record<AppLanguage, HomeCopy> = {
  en: {
    eyebrow: "Earth Day Challenge",
    title: "Before It Becomes Trash",
    description:
      "A platform to decide what to do with damaged objects before throwing them away: analyze with AI, save rescues, earn eco badges, and leave symbolic records on Solana Devnet.",
    login: "Log in with Auth0",
    dashboard: "View dashboard",
    demo: "Continue with demo",
    card1Title: "Eco assistant",
    card1Body: "Gemini provides structured diagnosis and recommendation.",
    card2Title: "Rescue logbook",
    card2Body: "Each case is stored in Supabase per authenticated user.",
    card3Title: "Verifiable achievements",
    card3Body: "Records are written to Solana Devnet with memo proof.",
    card4Title: "Local fallback",
    card4Body: "SQLite backup in development for graceful degradation.",
  },
  es: {
    eyebrow: "Desafío del Día de la Tierra",
    title: "Before It Becomes Trash",
    description:
      "Plataforma para decidir qué hacer con objetos dañados antes de tirarlos: analizar con IA, guardar rescates, ganar badges ecológicos y dejar constancias simbólicas en Solana Devnet.",
    login: "Iniciar sesión con Auth0",
    dashboard: "Ver dashboard",
    demo: "Continuar con demo",
    card1Title: "Asistente ecológico",
    card1Body: "Gemini genera diagnóstico y recomendación estructurada.",
    card2Title: "Diario de rescates",
    card2Body: "Cada caso se persiste en Supabase por usuario autenticado.",
    card3Title: "Logros verificables",
    card3Body: "Las constancias se registran en Solana Devnet con memo.",
    card4Title: "Fallback local",
    card4Body: "Respaldo SQLite en desarrollo para degradación razonable.",
  },
  hi: {
    eyebrow: "Earth Day Challenge",
    title: "Before It Becomes Trash",
    description:
      "Kharab vastuon ko phenkne se pehle kya karna hai uska faisla karne ka platform: AI se analysis karein, rescues save karein, eco badges paayen, aur Solana Devnet par symbolic records banayen.",
    login: "Auth0 se login karein",
    dashboard: "Dashboard dekhen",
    demo: "Demo continue karein",
    card1Title: "Eco assistant",
    card1Body: "Gemini structured diagnosis aur recommendation deta hai.",
    card2Title: "Rescue logbook",
    card2Body: "Har case authenticated user ke liye Supabase me save hota hai.",
    card3Title: "Verifiable achievements",
    card3Body: "Records Solana Devnet par memo proof ke saath likhe jate hain.",
    card4Title: "Local fallback",
    card4Body: "Development me graceful fallback ke liye SQLite backup.",
  },
  zh: {
    eyebrow: "地球日挑战",
    title: "Before It Becomes Trash",
    description:
      "在丢弃受损物品前帮助你做决定的平台：使用 AI 分析、保存修复记录、获得环保徽章，并在 Solana Devnet 留下象征性记录。",
    login: "使用 Auth0 登录",
    dashboard: "查看仪表盘",
    demo: "进入演示模式",
    card1Title: "环保助手",
    card1Body: "Gemini 提供结构化诊断与建议。",
    card2Title: "修复日志",
    card2Body: "每个案例按用户存储在 Supabase 中。",
    card3Title: "可验证成就",
    card3Body: "记录通过 memo 写入 Solana Devnet。",
    card4Title: "本地回退",
    card4Body: "开发环境提供 SQLite 备份以保证降级可用。",
  },
  ar: {
    eyebrow: "تحدي يوم الارض",
    title: "Before It Becomes Trash",
    description:
      "منصة تساعدك على تقرير ما يجب فعله مع العناصر التالفة قبل رميها: تحليل بالذكاء الاصطناعي، حفظ حالات الانقاذ، كسب شارات بيئية، وتسجيل اثر رمزي على Solana Devnet.",
    login: "تسجيل الدخول عبر Auth0",
    dashboard: "عرض لوحة التحكم",
    demo: "متابعة بوضع تجريبي",
    card1Title: "مساعد بيئي",
    card1Body: "Gemini يقدم تشخيصا وتوصية بشكل منظم.",
    card2Title: "سجل الانقاذ",
    card2Body: "يتم حفظ كل حالة في Supabase لكل مستخدم موثق.",
    card3Title: "انجازات قابلة للتحقق",
    card3Body: "يتم تسجيل الحالات في Solana Devnet باستخدام memo.",
    card4Title: "وضع احتياطي محلي",
    card4Body: "نسخة SQLite احتياطية في التطوير لضمان عمل مناسب عند التراجع.",
  },
  fr: {
    eyebrow: "Defi Jour de la Terre",
    title: "Before It Becomes Trash",
    description:
      "Plateforme pour decider quoi faire des objets endommages avant de les jeter : analyser avec IA, enregistrer des sauvetages, gagner des badges eco et laisser des traces symboliques sur Solana Devnet.",
    login: "Se connecter avec Auth0",
    dashboard: "Voir le tableau de bord",
    demo: "Continuer en mode demo",
    card1Title: "Assistant eco",
    card1Body: "Gemini produit un diagnostic et une recommandation structures.",
    card2Title: "Journal de sauvetage",
    card2Body: "Chaque cas est persiste dans Supabase par utilisateur authentifie.",
    card3Title: "Succes verifiables",
    card3Body: "Les preuves sont enregistrees sur Solana Devnet avec memo.",
    card4Title: "Fallback local",
    card4Body: "Sauvegarde SQLite en developpement pour une degradation maitrisee.",
  },
  pt: {
    eyebrow: "Desafio do Dia da Terra",
    title: "Before It Becomes Trash",
    description:
      "Plataforma para decidir o que fazer com objetos danificados antes de descarta-los: analisar com IA, salvar resgates, ganhar badges ecologicos e deixar registros simbolicos na Solana Devnet.",
    login: "Entrar com Auth0",
    dashboard: "Ver dashboard",
    demo: "Continuar com demo",
    card1Title: "Assistente ecologico",
    card1Body: "Gemini gera diagnostico e recomendacao estruturada.",
    card2Title: "Diario de resgates",
    card2Body: "Cada caso e salvo no Supabase por usuario autenticado.",
    card3Title: "Conquistas verificaveis",
    card3Body: "Os registros sao gravados na Solana Devnet com memo.",
    card4Title: "Fallback local",
    card4Body: "Backup em SQLite no desenvolvimento para degradacao controlada.",
  },
};

export function HomeClient() {
  const { language } = useAppLanguage();
  const copy = HOME_COPY[language];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-14 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-emerald-300/60 bg-gradient-to-br from-sky-100/75 via-emerald-100/65 to-amber-100/70 p-8 shadow-soft backdrop-blur dark:border-slate-700/80 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-800/90 sm:p-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-emerald-700/95 dark:text-emerald-300">
              {copy.eyebrow}
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.03em] text-emerald-950 dark:text-slate-100 sm:text-6xl lg:text-7xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-3xl text-[1.02rem] leading-relaxed text-emerald-900/90 dark:text-slate-300 sm:text-xl sm:leading-8">
              {copy.description}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 lg:items-end lg:pt-1">
            <Image
              src="/images/pngtree-earth-globe-surrounded-by-green-leaves-symbolizing-environmental-protection-and-sustainability-png-image_11989157.png"
              alt="Planet care illustration"
              width={192}
              height={192}
              className="h-28 w-28 object-contain opacity-95 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40"
              priority
            />
            <div className="flex w-full flex-wrap justify-center gap-2 lg:justify-end">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="/auth/login?returnTo=/dashboard"
            className="rounded-xl bg-emerald-700 px-5 py-3 text-[0.95rem] font-semibold tracking-tight text-white transition hover:bg-emerald-800"
          >
            {copy.login}
          </a>
          <Link
            href="/dashboard"
            className="rounded-xl border border-emerald-300/80 bg-white/65 px-5 py-3 text-[0.95rem] font-semibold tracking-tight text-emerald-900 transition hover:border-emerald-500 hover:bg-white dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            {copy.dashboard}
          </Link>
          <Link
            href="/demo"
            className="rounded-xl border border-sky-300/80 bg-sky-50/80 px-5 py-3 text-[0.95rem] font-semibold tracking-tight text-sky-900 transition hover:border-sky-500 hover:bg-sky-100 dark:border-sky-700 dark:bg-sky-950/30 dark:text-sky-100 dark:hover:bg-sky-950/50"
          >
            {copy.demo}
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl border border-sky-200/80 bg-white/65 p-4 dark:border-sky-900/70 dark:bg-slate-900/65">
            <h2 className="text-[0.98rem] font-semibold tracking-tight text-sky-900 dark:text-sky-100">{copy.card1Title}</h2>
            <p className="mt-2 text-[0.94rem] leading-6 text-slate-700 dark:text-slate-300">{copy.card1Body}</p>
          </article>
          <article className="rounded-2xl border border-emerald-200/80 bg-white/65 p-4 dark:border-emerald-900/70 dark:bg-slate-900/65">
            <h2 className="text-[0.98rem] font-semibold tracking-tight text-emerald-900 dark:text-emerald-100">{copy.card2Title}</h2>
            <p className="mt-2 text-[0.94rem] leading-6 text-slate-700 dark:text-slate-300">{copy.card2Body}</p>
          </article>
          <article className="rounded-2xl border border-amber-200/80 bg-white/65 p-4 dark:border-amber-900/70 dark:bg-slate-900/65">
            <h2 className="text-[0.98rem] font-semibold tracking-tight text-amber-900 dark:text-amber-100">{copy.card3Title}</h2>
            <p className="mt-2 text-[0.94rem] leading-6 text-slate-700 dark:text-slate-300">{copy.card3Body}</p>
          </article>
          <article className="rounded-2xl border border-emerald-200/80 bg-white/65 p-4 dark:border-emerald-900/70 dark:bg-slate-900/65">
            <h2 className="text-[0.98rem] font-semibold tracking-tight text-emerald-900 dark:text-emerald-100">{copy.card4Title}</h2>
            <p className="mt-2 text-[0.94rem] leading-6 text-slate-700 dark:text-slate-300">{copy.card4Body}</p>
          </article>
        </div>
      </section>

      <footer className="mt-8 rounded-2xl border border-emerald-200/70 bg-white/60 px-4 py-4 text-sm text-emerald-950/90 shadow-soft backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-200 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-center leading-relaxed sm:text-left">
            Developed by{" "}
            <a
              href="https://dev.to/brandon0405"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-emerald-700 underline decoration-emerald-400/80 underline-offset-4 transition hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200"
            >
              Brandon0405
            </a>{" "}
            - Built with <span className="font-semibold text-sky-500">hope</span> for the DEV Weekend Challenge!
          </p>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/brandon0405"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/80 bg-white/80 text-emerald-900 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:bg-white dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.21.68-.48v-1.69c-2.78.6-3.37-1.18-3.37-1.18-.45-1.14-1.11-1.45-1.11-1.45-.9-.62.07-.61.07-.61 1 .07 1.52 1.02 1.52 1.02.88 1.51 2.31 1.07 2.88.82.09-.65.34-1.07.62-1.31-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.02-2.68-.1-.25-.44-1.28.1-2.67 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.8a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.54 1.39.2 2.42.1 2.67.63.7 1.02 1.59 1.02 2.68 0 3.84-2.33 4.69-4.56 4.94.35.3.67.9.67 1.82v2.7c0 .27.18.57.69.48A10 10 0 0 0 12 2Z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/brandon-castillo-94367435b/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/80 bg-white/80 text-emerald-900 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:bg-white dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M6.94 8.5A1.94 1.94 0 1 1 6.94 4.62a1.94 1.94 0 0 1 0 3.88ZM5.27 9.98h3.34V20H5.27V9.98Zm5.24 0h3.2v1.37h.05c.45-.85 1.53-1.74 3.15-1.74 3.37 0 3.99 2.22 3.99 5.11V20h-3.34v-4.69c0-1.12-.02-2.56-1.56-2.56-1.56 0-1.8 1.22-1.8 2.48V20h-3.34V9.98Z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
