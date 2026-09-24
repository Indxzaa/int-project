'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import translations, { Lang, TranslationKey } from './translations'

export type { Lang, TranslationKey }

const STORAGE_KEY = 'memorycare_lang'

interface I18nContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'th' || stored === 'en') return stored
  } catch {}
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    setLangState(getInitialLang())
  }, [])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }, [])

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[lang][key] ?? translations.en[key] ?? key
    },
    [lang]
  )

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
