import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock } from 'lucide-react'

// Proteção simples só para evitar edição acidental por quem tem o link público.
// Não é segurança de verdade — ao subir para o Lovable, troque por autenticação real (Supabase Auth).
const PASSWORD_KEY = 'midias-cup-admin-password'
const SESSION_KEY = 'midias-cup-admin-authed'
const DEFAULT_PASSWORD = 'midiascup2026'

function getPassword() {
  return window.localStorage.getItem(PASSWORD_KEY) ?? DEFAULT_PASSWORD
}

export function AdminGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(() => window.sessionStorage.getItem(SESSION_KEY) === '1')
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  if (authed) return <>{children}</>

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input === getPassword()) {
      window.sessionStorage.setItem(SESSION_KEY, '1')
      setAuthed(true)
    } else {
      setError(true)
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <Card>
        <CardHeader className="items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <CardTitle className="text-base">Área restrita</CardTitle>
          <p className="text-sm text-muted-foreground">Senha para editar os dados do campeonato.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Senha</Label>
              <Input
                id="admin-password"
                type="password"
                autoFocus
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setError(false)
                }}
              />
              {error && <p className="text-xs text-destructive">Senha incorreta.</p>}
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
            <p className="text-center text-xs text-muted-foreground">Senha padrão: {DEFAULT_PASSWORD}</p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
