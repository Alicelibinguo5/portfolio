'use client'

type AdminTokenFieldProps = {
  value: string
  onChange: (value: string) => void
}

export function AdminTokenField({ value, onChange }: AdminTokenFieldProps) {
  return (
    <div>
      <label htmlFor="admin-token" className="block text-sm font-medium text-forest mb-2">Admin token</label>
      <input
        id="admin-token"
        type="password"
        autoComplete="current-password"
        className="input-botanical"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Required to publish; saved in this browser"
        required
      />
    </div>
  )
}
