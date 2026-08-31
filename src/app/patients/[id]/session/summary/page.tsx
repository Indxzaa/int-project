'use client'

import { use, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSession } from '@/lib/db/queries'
import { Session } from '@/lib/types'
import { Header } from '@/components/ui/Header'
import { Layout } from '@/components/ui/Layout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

function formatDuration(start: string, end?: string) {
  if (!end) return '—'
  const ms = new Date(end).getTime() - new Date(start).getTime()
  const mins = Math.floor(ms / 60000)
  const secs = Math.floor((ms % 60000) / 1000)
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
}

export default function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('sessionId')
  const from = searchParams.get('from')
  const backPath = from === 'patient' || from === 'role'
    ? `/patients/${id}/patient-mode/games`
    : `/patients/${id}`
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    if (sessionId) getSession(sessionId).then(s => setSession(s ?? null))
  }, [sessionId])

  if (!session) return null

  return (
    <>
      <Header title="Session Summary" onBack={() => router.push(backPath)} />
      <Layout className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3 pt-6 text-center">
          <span className="text-6xl">🧠</span>
          <h2 className="text-2xl font-bold text-slate-900">Session Complete</h2>
          <p className="text-slate-500">Great work! Here&apos;s how the session went.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="flex flex-col items-center gap-1 p-5">
            <span className="text-3xl font-bold text-blue-600">{session.photosViewed.length}</span>
            <span className="text-sm text-slate-500">Photos Shown</span>
          </Card>
          <Card className="flex flex-col items-center gap-1 p-5">
            <span className="text-3xl font-bold text-purple-600">{formatDuration(session.startedAt, session.endedAt)}</span>
            <span className="text-sm text-slate-500">Duration</span>
          </Card>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Button size="lg" className="w-full" onClick={() => router.push(`/patients/${id}/session${from === 'patient' || from === 'role' ? `?from=${from}` : ''}`)}>
            ▶ Start Another Session
          </Button>
          <Button variant="secondary" size="lg" className="w-full" onClick={() => router.push(backPath)}>
            {(from === 'patient' || from === 'role') ? 'Back to Games' : 'Back to Profile'}
          </Button>
          {from !== 'patient' && from !== 'role' && (
            <Button variant="ghost" size="lg" className="w-full" onClick={() => router.push('/caregiver')}>
              Home
            </Button>
          )}
        </div>
      </Layout>
    </>
  )
}
