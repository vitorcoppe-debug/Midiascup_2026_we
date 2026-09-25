import type { Match } from '@/types'

// IDs fixos do mata-mata: sempre existem 4 jogos (gerados no seed), e o admin só
// precisa preencher/gerar os confrontos conforme a fase 1 e as semifinais terminam.
export const BRACKET_IDS = {
  sf1: 'sf1',
  sf2: 'sf2',
  final: 'final',
  terceiro: 'terceiro',
} as const

export function isFase1Complete(matches: Match[]) {
  const fase1 = matches.filter((m) => m.phase === 'fase1')
  return fase1.length > 0 && fase1.every((m) => m.status === 'realizado')
}

export type WinnerSide = 'home' | 'away' | null

export function winningSide(match: Match | undefined): WinnerSide {
  if (!match || match.status !== 'realizado' || match.homeScore === null || match.awayScore === null) return null
  if (match.homeScore === match.awayScore) return null
  return match.homeScore > match.awayScore ? 'home' : 'away'
}

export function winnerTeamId(match: Match | undefined): string | null {
  const side = winningSide(match)
  if (!side || !match) return null
  return side === 'home' ? match.homeTeamId : match.awayTeamId
}

export function loserTeamId(match: Match | undefined): string | null {
  const side = winningSide(match)
  if (!side || !match) return null
  return side === 'home' ? match.awayTeamId : match.homeTeamId
}
