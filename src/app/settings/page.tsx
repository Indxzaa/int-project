'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useI18n, Lang, TranslationKey } from '@/lib/i18n'
import { useTheme, Theme } from '@/lib/theme'

const LANG_OPTIONS: { value: Lang; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'th', label: 'ไทย', flag: '🇹🇭' },
]

const THEME_OPTIONS: { value: Theme; label: TranslationKey; icon: string }[] = [
  { value: 'light', label: 'light', icon: '☀️' },
  { value: 'dark',  label: 'dark',  icon: '🌙' },
]

function SettingsInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang, setLang, t } = useI18n()
  const { theme, setTheme } = useTheme()

  const from = searchParams.get('from') ?? 'caregiver'
  const backPath =
    from === 'role' ? '/' :
    from === 'patient' ? '/patient'
    : '/caregiver'

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-6 pt-16 pb-12">
      <button
        onClick={() => router.push(backPath)}
        aria-label={t('back')}
        className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-600 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
      >
        ←
      </button>

      <h1 className="mb-10 text-4xl font-bold text-slate-900">{t('settings_title')}</h1>

      <div className="flex w-full max-w-md flex-col gap-10">
        {/* Language */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-slate-900">{t('language')}</h2>
          <div className="flex flex-col gap-3">
            {LANG_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setLang(opt.value)}
                className={`flex items-center gap-4 rounded-2xl border-2 px-6 py-5 text-left text-xl font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${
                  lang === opt.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                    : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-3xl">{opt.flag}</span>
                <span>{opt.label}</span>
                {lang === opt.value && <span className="ml-auto text-blue-500 text-2xl">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-slate-900">{t('theme')}</h2>
          <div className="flex flex-col gap-3">
            {THEME_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`flex items-center gap-4 rounded-2xl border-2 px-6 py-5 text-left text-xl font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${
                  theme === opt.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                    : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-3xl">{opt.icon}</span>
                <span>{t(opt.label)}</span>
                {theme === opt.value && <span className="ml-auto text-blue-500 text-2xl">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsInner />
    </Suspense>
  )
}
