'use client'

import { BlobImg } from '@/components/session/BlobImg'
import { useI18n } from '@/lib/i18n'

interface RewardOverlayProps {
  photo?: Blob
  filename?: string
  onNext: () => void
  onExit: () => void
}

export function RewardOverlay({ photo, filename, onNext, onExit }: RewardOverlayProps) {
  const { t } = useI18n()
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center gap-8 bg-white">
      <button
        onClick={onExit}
        aria-label={t('exit_game')}
        className="absolute right-5 top-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-700 hover:bg-slate-200 active:scale-95 shadow-md transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        ✕
      </button>

      {photo && filename ? (
        <BlobImg
          blob={photo}
          filename={filename}
          className="max-h-[75vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
        />
      ) : (
        <p className="text-2xl font-bold text-slate-700">{t('well_done')}</p>
      )}

      <p className="text-5xl font-bold text-green-600">{t('great_job')}</p>

      <button
        onClick={onNext}
        className="absolute bottom-8 right-8 flex h-16 items-center gap-3 rounded-full bg-green-600 px-8 text-xl font-bold text-white shadow-lg hover:bg-green-700 active:scale-95 transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
      >
        {t('next')} →
      </button>
    </div>
  )
}
