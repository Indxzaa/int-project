'use client'

import { Patient } from '@/lib/types'
import { Card } from '@/components/ui/Card'
import { BlobImg } from '@/components/session/BlobImg'

const levelStyles: Record<Patient['dementiaLevel'], string> = {
  mild: 'bg-green-50 text-green-700 border-green-200',
  moderate: 'bg-amber-50 text-amber-700 border-amber-200',
  severe: 'bg-red-50 text-red-700 border-red-200',
}

interface PatientCardProps {
  patient: Patient
  onClick?: () => void
  onDelete?: () => void
}

export function PatientCard({ patient, onClick, onDelete }: PatientCardProps) {
  return (
    <Card clickable={!!onClick} onClick={onClick} className="flex items-center gap-4 p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 overflow-hidden text-slate-500 text-xl">
        {patient.profilePhoto && patient.profileFilename
          ? <BlobImg blob={patient.profilePhoto} filename={patient.profileFilename} className="h-full w-full object-cover" />
          : '👤'
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-slate-900 truncate">{patient.name}</p>
        {patient.birthday && (
          <p className="text-sm text-slate-500">DOB: {patient.birthday}</p>
        )}
      </div>
      <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${levelStyles[patient.dementiaLevel]}`}>
        {patient.dementiaLevel}
      </span>
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          aria-label={`Delete ${patient.name}`}
        >
          🗑
        </button>
      )}
    </Card>
  )
}

