// Regra adicionada ao campeonato: nos últimos 2 minutos de cada partida da fase 1
// rola um mini-game, que depende do horário do jogo (Jogo 1 a 4 do cronograma).
export interface MiniGameRule {
  label: string
  rule: string
}

const MINIGAME_BY_TIME: Record<string, MiniGameRule> = {
  '20:30': { label: 'Jogo 1', rule: '3x3 Minas' },
  '21:00': { label: 'Jogo 2', rule: 'Pênalti B/C Level' },
  '21:30': { label: 'Jogo 3', rule: 'Gol de Homem vale 2' },
  '22:00': { label: 'Jogo 4', rule: 'Pênalti B/C Level' },
}

export const MINIGAME_LIST = Object.values(MINIGAME_BY_TIME)

export function miniGameForTime(time?: string): MiniGameRule | undefined {
  if (!time) return undefined
  return MINIGAME_BY_TIME[time]
}
