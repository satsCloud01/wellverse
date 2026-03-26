import { useState } from 'react'
import { api } from '../api'
import { C } from '../tokens'
import Btn from '../components/Btn'

const STEPS = ['Your Details', 'Your Practice', 'Why WellVerse?']

function Inp({ label, ph, value, onChange }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-mist tracking-wider uppercase mb-2">{label}</p>
      <input
        className="w-full px-4 py-3 bg-white/[.05] border border-white/[.12] rounded-[10px] text-sm text-parchment font-body outline-none placeholder:text-mist"
        placeholder={ph}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

function Ta({ label, ph, value, onChange }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-mist tracking-wider uppercase mb-2">{label}</p>
      <textarea
        className="w-full px-4 py-3 bg-white/[.05] border border-white/[.12] rounded-[10px] text-sm text-parchment font-body outline-none resize-none h-24 placeholder:text-mist"
        placeholder={ph}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default function Apply() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', city_country: '',
    role_specialty: '', qualifications: '', years_practice: '', website: '',
    why_wellverse: '', approach: '', first_session: '',
  })

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async () => {
    try {
      await api.submitApplication(form)
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="px-[6%] py-32 text-center max-w-[600px] mx-auto">
        <div className="text-[48px] mb-5">✓</div>
        <h1 className="font-display text-4xl font-light text-parchment mb-4">Application submitted!</h1>
        <p className="text-base text-mist leading-[1.8]">We'll review your application and get back to you within 5 business days. First 90 days: zero commission.</p>
      </div>
    )
  }

  return (
    <div className="px-[6%] py-20 max-w-[740px] mx-auto">
      <div className="text-center mb-11">
        <p className="text-[11px] font-bold tracking-[3px] text-pine uppercase mb-3">Guide Application</p>
        <h1 className="font-display font-light mb-3" style={{ fontSize: 'clamp(30px,4.5vw,52px)' }}>
          Apply to join <em className="text-pine">WellVerse.</em>
        </h1>
        <p className="text-sm text-mist max-w-[380px] mx-auto leading-[1.8]">
          Reviewed weekly. Reply within 5 business days. Zero commission for 90 days.
        </p>
      </div>

      <div className="flex mb-7 bg-white/[.03] rounded-xl p-[3px]">
        {STEPS.map((st, i) => (
          <button
            key={st}
            onClick={() => setStep(i)}
            className={`flex-1 py-2.5 text-[13px] font-medium rounded-[9px] border-none cursor-pointer transition-all ${step === i ? 'bg-teal text-white' : 'bg-transparent text-mist'}`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="bg-white/[.03] border border-white/[.08] rounded-[18px] p-8">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <Inp label="Full Name" ph="Your full name" value={form.full_name} onChange={set('full_name')} />
            <Inp label="Email" ph="your@email.com" value={form.email} onChange={set('email')} />
            <Inp label="Phone" ph="Optional" value={form.phone} onChange={set('phone')} />
            <Inp label="City & Country" ph="e.g. London, UK" value={form.city_country} onChange={set('city_country')} />
          </div>
        )}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Inp label="Role / Specialty" ph="e.g. Psychological Coach, Personal Trainer..." value={form.role_specialty} onChange={set('role_specialty')} />
            <Ta label="Qualifications" ph="List certifications and issuing bodies..." value={form.qualifications} onChange={set('qualifications')} />
            <Inp label="Years of Practice" ph="e.g. 7 years" value={form.years_practice} onChange={set('years_practice')} />
            <Inp label="Website or Profile" ph="LinkedIn, personal site — optional" value={form.website} onChange={set('website')} />
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <Ta label="Why WellVerse?" ph="What draws you to this platform?" value={form.why_wellverse} onChange={set('why_wellverse')} />
            <Ta label="Your Approach" ph="What makes your approach distinctive?" value={form.approach} onChange={set('approach')} />
            <Ta label="First Session" ph="Walk us through how you onboard a new client." value={form.first_session} onChange={set('first_session')} />
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4">
        {step > 0 ? <Btn v="outline" onClick={() => setStep((s) => s - 1)}>← Back</Btn> : <div />}
        {step < 2 ? (
          <Btn v="teal" onClick={() => setStep((s) => s + 1)}>Next →</Btn>
        ) : (
          <Btn v="teal" onClick={handleSubmit}>Submit →</Btn>
        )}
      </div>
    </div>
  )
}
