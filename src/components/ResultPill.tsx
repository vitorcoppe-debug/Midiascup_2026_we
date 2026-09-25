import { cn } from '@/lib/utils'

export type MatchResult = 'V' | 'E' | 'D'

export function ResultPill({ result }: { result: MatchResult }) {
  const styles: Record<MatchResult, string> = {
    V: 'bg-success/15 text-success',
    E: 'bg-warning/15 text-warning',
    D: 'bg-destructive/15 text-destructive',
  }
  const labels: Record<MatchResult, string> = { V: 'Vitória', E: 'Empate', D: 'Derrota' }

  return (
    <span
      title={labels[result]}
      className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold', styles[result])}
    >
      {result}
    </span>
  )
}
