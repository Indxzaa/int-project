'use client'

import { useRouter } from 'next/navigation'

export default function RoleSelectPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 gap-8">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-slate-900">Memory Care</h1>
        <p className="mt-2 text-xl text-slate-500">Select your role to continue.</p>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-5">
        <button
          onClick={() => router.push('/caregiver')}
          className="flex flex-col items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-8 py-10 shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 transition-colors"
        >
          <span className="text-6xl">👨‍⚕️</span>
          <span className="text-2xl font-bold text-slate-900">Caregiver / Doctor</span>
        </button>
        <button
          onClick={() => router.push('/patient')}
          className="flex flex-col items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-8 py-10 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 transition-colors"
        >
          <span className="text-6xl">👤</span>
          <span className="text-2xl font-bold text-slate-900">Patient</span>
        </button>
      </div>
    </div>
  )
}
