'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import db from '@/lib/db'
import { useI18n } from '@/lib/i18n'
import { Header } from '@/components/ui/Header'
import { Layout } from '@/components/ui/Layout'
import { Card } from '@/components/ui/Card'

const WEEKLY_DATA = [
  { week: 'W1', completionTime: 5.2, accuracy: 74, gamesPlayed: 6 },
  { week: 'W2', completionTime: 4.8, accuracy: 78, gamesPlayed: 8 },
  { week: 'W3', completionTime: 4.5, accuracy: 80, gamesPlayed: 9 },
  { week: 'W4', completionTime: 4.1, accuracy: 83, gamesPlayed: 11 },
  { week: 'W5', completionTime: 3.9, accuracy: 85, gamesPlayed: 13 },
  { week: 'W6', completionTime: 3.6, accuracy: 88, gamesPlayed: 14 },
  { week: 'W7', completionTime: 3.3, accuracy: 90, gamesPlayed: 16 },
  { week: 'W8', completionTime: 3.0, accuracy: 92, gamesPlayed: 18 },
]

const GAME_STATS = [
  { icon: '🔌', name: 'connect_wires',  games: 23, avgTime: '3m 02s', accuracy: 92, trend: 'up' },
  { icon: '🧩', name: 'matching_picture', games: 15, avgTime: '4m 15s', accuracy: 81, trend: 'up' },
  { icon: '🖼️', name: 'match_right_picture', games: 18, avgTime: '3m 48s', accuracy: 86, trend: 'stable' },
  { icon: '🔴', name: 'red_dot_memory',  games: 31, avgTime: '2m 30s', accuracy: 88, trend: 'up' },
]

const RECENT_SESSIONS = [
  { date: 'Jul 28, 2026', gameKey: 'red_dot_memory',           duration: '18 min', accuracy: 91 },
  { date: 'Jul 27, 2026', gameKey: 'connect_wires',            duration: '22 min', accuracy: 94 },
  { date: 'Jul 25, 2026', gameKey: 'match_right_picture',      duration: '15 min', accuracy: 83 },
  { date: 'Jul 24, 2026', gameKey: 'matching_picture',         duration: '20 min', accuracy: 78 },
  { date: 'Jul 22, 2026', gameKey: 'red_dot_memory',           duration: '16 min', accuracy: 89 },
  { date: 'Jul 20, 2026', gameKey: 'connect_wires',            duration: '25 min', accuracy: 90 },
]

const DOCTOR_NOTES = [
  {
    date: 'Jul 28, 2026',
    author: 'Dr. S. Nakamura',
    note_en: 'Patient completed 3 sessions this week with consistently shorter completion times across all games. Average accuracy reached 91% in Red Dot Memory. Attention span during structured activities has noticeably increased — sessions that previously ended early due to fatigue are now being completed in full.',
    note_th: 'ผู้ป่วยทำเซสชันสำเร็จ 3 ครั้งในสัปดาห์นี้ โดยใช้เวลาทำแต่ละเกมสั้นลงอย่างต่อเนื่อง ความแม่นยำเฉลี่ยในเกมจุดแดงจำลองถึง 91% ช่วงความสนใจในกิจกรรมที่มีโครงสร้างเพิ่มขึ้นอย่างเห็นได้ชัด — เซสชันที่เคยหยุดก่อนเวลาเนื่องจากความเหนื่อยล้า现在สามารถทำได้จนจบ',
  },
  {
    date: 'Jul 14, 2026',
    author: 'Dr. S. Nakamura',
    note_en: 'Significant improvement in participation frequency over the past two weeks — patient initiated game sessions without prompting on two occasions. Accuracy in Connect the Wires has risen from 78% to 92% over 8 weeks. Caregiver reports patient expresses enjoyment during photo-based activities.',
    note_th: 'มีการปรับปรุงอย่างมีนัยสำคัญในความถี่ของการมีส่วนร่วมในช่วงสองสัปดาห์ที่ผ่านมา — ผู้ป่วยเริ่มทำเกมด้วยตนเองโดยไม่ต้องกระตุ้น 2 ครั้ง ความแม่นยำในเกมเชื่อมสายไฟเพิ่มขึ้นจาก 78% เป็น 92% ใน 8 สัปดาห์ ผู้ดูแลรายงานว่าผู้ป่วยแสดงความเพลิดเพลินในกิจกรรมที่ใช้รูปภาพ',
  },
  {
    date: 'Jun 30, 2026',
    author: 'Dr. A. Lim',
    note_en: 'Baseline session recorded. Patient required full prompting to initiate and struggled to complete more than 2 rounds before disengaging. Recommend daily short sessions (10–15 min) with immediate positive reinforcement. Use familiar photographs to improve initial engagement.',
    note_th: 'บันทึกเซสชันฐาน ผู้ป่วยต้องได้รับการกระตุ้นเต็มที่เพื่อเริ่มทำและทำได้ไม่เกิน 2 รอบก่อนจะหยุด แนะนำเซสชันสั้นๆ ทุกวัน (10-15 นาที) พร้อมการเสริมแรงบวกทันที ใช้รูปภาพที่คุ้นเคยเพื่อเพิ่มการมีส่วนร่วมในเบื้องต้น',
  },
]

const levelStyles: Record<string, string> = {
  mild:     'bg-green-50 text-green-700 border-green-200',
  moderate: 'bg-amber-50 text-amber-700 border-amber-200',
  severe:   'bg-red-50 text-red-700 border-red-200',
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up')   return <span className="font-bold text-green-600">↑</span>
  if (trend === 'down') return <span className="font-bold text-red-500">↓</span>
  return <span className="text-slate-400">→</span>
}

function AccuracyBadge({ value }: { value: number }) {
  const color = value >= 90 ? 'text-green-600' : value >= 80 ? 'text-amber-600' : 'text-red-500'
  return <span className={`font-semibold ${color}`}>{value}%</span>
}

export default function HistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { t, lang } = useI18n()
  const patient = useLiveQuery(() => db.patients.get(id), [id])
  const [editableNotes, setEditableNotes] = useState(() =>
    DOCTOR_NOTES.map(n => lang === 'th' ? n.note_th : n.note_en)
  )

  if (!patient) return null

  const totalGames = GAME_STATS.reduce((sum, g) => sum + g.games, 0)

  return (
    <>
      <Header title={t('patient_history')} onBack={() => router.push(`/patients/${id}`)} onHome={() => router.push('/caregiver')} />
      <Layout className="flex flex-col gap-8 pb-12">

        {/* Patient Summary */}
        <Card className="p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{patient.name}</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {t('chart_no')} #{String(patient.chartNo).padStart(4, '0')} · {patient.age} {t('yrs')} · {t(patient.gender as 'male' | 'female' | 'other')}
            </p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-sm font-semibold capitalize ${levelStyles[patient.dementiaLevel]}`}>
            {t(patient.dementiaLevel)} {t('dementia')}
          </span>
        </Card>

        {/* Overview Stats */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">{t('overview')}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card className="p-5 flex flex-col gap-1">
              <p className="text-3xl font-bold text-blue-600">{totalGames}</p>
              <p className="text-sm text-slate-500">{t('total_games')}</p>
            </Card>
            <Card className="p-5 flex flex-col gap-1">
              <p className="text-3xl font-bold text-purple-600">3:00</p>
              <p className="text-sm text-slate-500">{t('avg_completion')}</p>
            </Card>
            <Card className="p-5 flex flex-col gap-1">
              <p className="text-3xl font-bold text-green-600">89%</p>
              <p className="text-sm text-slate-500">{t('overall_accuracy')}</p>
            </Card>
            <Card className="p-5 flex flex-col gap-1">
              <p className="text-3xl font-bold text-amber-600">8</p>
              <p className="text-sm text-slate-500">{t('active_weeks')}</p>
            </Card>
          </div>
        </section>

        {/* Mini-Game Performance */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">{t('mini_game_performance')}</h2>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold text-slate-600">{t('game')}</th>
                    <th className="px-5 py-3 text-right font-semibold text-slate-600">{t('games_played')}</th>
                    <th className="px-5 py-3 text-right font-semibold text-slate-600">{t('avg_time')}</th>
                    <th className="px-5 py-3 text-right font-semibold text-slate-600">{t('accuracy')}</th>
                    <th className="px-5 py-3 text-center font-semibold text-slate-600">{t('trend')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {GAME_STATS.map(g => (
                    <tr key={g.name} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{g.icon}</span>
                          <span className="font-medium text-slate-900">{t(g.name as any)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right text-slate-700">{g.games}</td>
                      <td className="px-5 py-4 text-right text-slate-700">{g.avgTime}</td>
                      <td className="px-5 py-4 text-right"><AccuracyBadge value={g.accuracy} /></td>
                      <td className="px-5 py-4 text-center"><TrendIcon trend={g.trend} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Recent Sessions */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">{t('recent_sessions')}</h2>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold text-slate-600">{t('date')}</th>
                    <th className="px-5 py-3 text-left font-semibold text-slate-600">{t('game')}</th>
                    <th className="px-5 py-3 text-right font-semibold text-slate-600">{t('duration')}</th>
                    <th className="px-5 py-3 text-right font-semibold text-slate-600">{t('accuracy')}</th>
                    <th className="px-5 py-3 text-center font-semibold text-slate-600">{t('status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {RECENT_SESSIONS.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-5 py-4 text-slate-500">{s.date}</td>
                      <td className="px-5 py-4 font-medium text-slate-900">{t(s.gameKey as any)}</td>
                      <td className="px-5 py-4 text-right text-slate-700">{s.duration}</td>
                      <td className="px-5 py-4 text-right"><AccuracyBadge value={s.accuracy} /></td>
                      <td className="px-5 py-4 text-center">
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">{t('completed')}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Doctor Notes */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">{t('doctor_notes')}</h2>
          <div className="flex flex-col gap-4">
            {DOCTOR_NOTES.map((note, i) => (
              <Card key={i} className="p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900">{note.author}</span>
                  <span className="text-slate-400">{note.date}</span>
                </div>
                <textarea
                  value={editableNotes[i]}
                  onChange={(e) => setEditableNotes(prev => prev.map((n, j) => j === i ? e.target.value : n))}
                  className="text-sm leading-relaxed text-slate-600 resize-none border border-slate-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </Card>
            ))}
          </div>
        </section>

        {/* Weekly Progress */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">{t('weekly_progress')}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Card className="p-5">
              <h3 className="mb-4 text-base font-semibold text-slate-700">{t('avg_completion_time')}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={WEEKLY_DATA} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[2, 6]} />
                  <Tooltip formatter={(v) => [`${v} min`, 'Avg Time']} />
                  <Line type="monotone" dataKey="completionTime" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5">
              <h3 className="mb-4 text-base font-semibold text-slate-700">{t('accuracy_chart')}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={WEEKLY_DATA} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[60, 100]} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Accuracy']} />
                  <Line type="monotone" dataKey="accuracy" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5 sm:col-span-2">
              <h3 className="mb-4 text-base font-semibold text-slate-700">{t('games_played_week')}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={WEEKLY_DATA} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [v, 'Games']} />
                  <Bar dataKey="gamesPlayed" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </section>

      </Layout>
    </>
  )
}
