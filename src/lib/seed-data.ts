import type { ChampionshipData, Coach, Match, Player, PlayerMatchStat, Team } from '@/types'
import { BRACKET_IDS } from '@/lib/bracket'

// Dados de exemplo para você ver o dashboard funcionando.
// Substitua tudo isso pelo painel Admin (times, jogos, elenco e estatísticas reais).

// Times da Série Ouro da Mídia's Cup.
const teams: Team[] = [
  { id: 't1', name: 'WE', shortName: 'WE', color: '#1d2053', isMyTeam: true },
  { id: 't2', name: 'Ogilvy', shortName: 'OGI', color: '#2563eb' },
  { id: 't3', name: 'Publicis', shortName: 'PUB', color: '#d97706' },
  { id: 't4', name: 'WMcCann', shortName: 'WMC', color: '#7c3aed' },
  { id: 't5', name: 'Essence', shortName: 'ESS', color: '#dc2626' },
  { id: 't6', name: 'Galeria', shortName: 'GAL', color: '#0891b2' },
  { id: 't7', name: 'BETC Havas', shortName: 'BHV', color: '#db2777' },
  { id: 't8', name: 'Talent', shortName: 'TAL', color: '#ca8a04' },
]

// Fase 1: pontos corridos, 8 times, cronograma real (crono_de_jogos.xlsx).
// Jogos já realizados têm placar; os demais ficam "agendado". Lance os resultados
// em Admin > Jogos conforme as rodadas forem acontecendo.
//
// Obs: na planilha, o "Jogo 4" de 22/09 estava com o time da casa em branco
// (só "Ogilvy", sem adversário). Pela contagem de jogos de cada time (todo mundo
// tem que jogar 7 vezes), o único confronto que fecha a tabela é Ogilvy x WMcCann
// — infira isso foi o que preenchi aqui, mas vale confirmar com quem organiza.
function fase1(
  id: string,
  round: number,
  date: string,
  time: string,
  homeTeamId: string,
  awayTeamId: string,
  score: [number, number] | null = null,
): Match {
  return {
    id,
    phase: 'fase1',
    round,
    date,
    time,
    homeTeamId,
    awayTeamId,
    homeScore: score ? score[0] : null,
    awayScore: score ? score[1] : null,
    status: score ? 'realizado' : 'agendado',
  }
}

const fase1Matches: Match[] = [
  // Rodada 1 - qui, 2026-09-10
  fase1('m1', 1, '2026-09-10', '20:30', 't2', 't5', [2, 7]),
  fase1('m2', 1, '2026-09-10', '21:00', 't1', 't3', [5, 1]),

  // Rodada 2 - qui, 2026-09-17
  fase1('m3', 2, '2026-09-17', '20:30', 't4', 't6', [2, 6]),
  fase1('m4', 2, '2026-09-17', '21:00', 't8', 't7', [0, 2]),

  // Rodada 3 - ter, 2026-09-22
  fase1('m5', 3, '2026-09-22', '21:30', 't5', 't6', [0, 2]),
  fase1('m6', 3, '2026-09-22', '22:00', 't2', 't4', [2, 2]), // inferido, ver observação acima

  // Rodada 4 - qui, 2026-09-24
  fase1('m7', 4, '2026-09-24', '21:30', 't1', 't8', [5, 0]),
  fase1('m8', 4, '2026-09-24', '22:00', 't3', 't7', [2, 1]),

  // Rodada 5 - ter, 2026-09-29
  fase1('m9', 5, '2026-09-29', '21:00', 't2', 't8', [4, 0]),
  fase1('m10', 5, '2026-09-29', '22:00', 't5', 't7', [0, 0]),

  // Rodada 6 - qui, 2026-10-01
  fase1('m11', 6, '2026-10-01', '21:00', 't1', 't4', [3, 0]),
  fase1('m12', 6, '2026-10-01', '22:00', 't3', 't6', [2, 1]),

  // Rodada 7 - qui, 2026-10-08
  fase1('m13', 7, '2026-10-08', '20:30', 't5', 't1'),
  fase1('m14', 7, '2026-10-08', '21:30', 't6', 't8'),

  // Rodada 8 - qui, 2026-10-15
  fase1('m15', 8, '2026-10-15', '20:30', 't2', 't3'),
  fase1('m16', 8, '2026-10-15', '21:30', 't4', 't7'),

  // Rodada 9 - ter, 2026-10-20
  fase1('m17', 9, '2026-10-20', '20:30', 't7', 't6'),
  fase1('m18', 9, '2026-10-20', '22:00', 't3', 't4'),

  // Rodada 10 - qui, 2026-10-22
  fase1('m19', 10, '2026-10-22', '20:30', 't5', 't8'),
  fase1('m20', 10, '2026-10-22', '22:00', 't2', 't1'),

  // Rodada 11 - qui, 2026-10-29
  fase1('m21', 11, '2026-10-29', '21:00', 't3', 't8'),
  fase1('m22', 11, '2026-10-29', '21:30', 't2', 't7'),

  // Rodada 12 - qui, 2026-11-05
  fase1('m23', 12, '2026-11-05', '21:00', 't5', 't4'),
  fase1('m24', 12, '2026-11-05', '21:30', 't1', 't6'),

  // Rodada 13 - qui, 2026-11-12
  fase1('m25', 13, '2026-11-12', '20:30', 't5', 't3'),
  fase1('m26', 13, '2026-11-12', '22:00', 't2', 't6'),

  // Rodada 14 - ter, 2026-11-17
  fase1('m27', 14, '2026-11-17', '20:30', 't1', 't7'),
  fase1('m28', 14, '2026-11-17', '22:00', 't4', 't8'),
]

// Fase 2: mata-mata. Os times de cada confronto começam indefinidos (null) —
// use os botões em Admin > Jogos para gerar as semifinais (1º x 4º, 2º x 3º)
// assim que a fase 1 terminar, e depois a final / disputa de 3º lugar.
const fase2Matches: Match[] = [
  // Datas ainda não divulgadas na planilha — usei uma estimativa (uma e duas
  // semanas depois do fim da fase 1, 17/11) só pra ordenar a tela. Ajuste em
  // Admin > Jogos assim que a organização divulgar as datas reais.
  {
    id: BRACKET_IDS.sf1,
    phase: 'semifinal',
    round: null,
    label: 'Semifinal 1 (1º x 4º)',
    date: '2026-11-24',
    homeTeamId: null,
    awayTeamId: null,
    homeScore: null,
    awayScore: null,
    status: 'agendado',
  },
  {
    id: BRACKET_IDS.sf2,
    phase: 'semifinal',
    round: null,
    label: 'Semifinal 2 (2º x 3º)',
    date: '2026-11-24',
    homeTeamId: null,
    awayTeamId: null,
    homeScore: null,
    awayScore: null,
    status: 'agendado',
  },
  {
    id: BRACKET_IDS.final,
    phase: 'final',
    round: null,
    label: 'Final',
    date: '2026-12-01',
    homeTeamId: null,
    awayTeamId: null,
    homeScore: null,
    awayScore: null,
    status: 'agendado',
  },
  {
    id: BRACKET_IDS.terceiro,
    phase: 'terceiro',
    round: null,
    label: 'Disputa de 3º lugar',
    date: '2026-12-01',
    homeTeamId: null,
    awayTeamId: null,
    homeScore: null,
    awayScore: null,
    status: 'agendado',
  },
]

const matches: Match[] = [...fase1Matches, ...fase2Matches]

// Elenco real do WE. Só temos dados individuais do nosso time — os demais times
// aparecem apenas nos placares/classificação.
const players: Player[] = [
  { id: 'p1', teamId: 't1', name: 'Marcelo Lopes', number: 8, photoUrl: '/atletas/marcelo-lopes.jpg' },
  { id: 'p2', teamId: 't1', name: 'Vitor Coppe', number: 2, photoUrl: '/atletas/vitor-coppe.jpg' },
  { id: 'p3', teamId: 't1', name: 'Matheus Soares', number: 9, photoUrl: '/atletas/matheus-soares.jpg' },
  { id: 'p4', teamId: 't1', name: 'Maycon Silveira', number: 6, photoUrl: '/atletas/maycon-silveira.jpg' },
  { id: 'p5', teamId: 't1', name: 'Almir Pereira', number: 7, photoUrl: '/atletas/almir-pereira.jpg' },
  { id: 'p6', teamId: 't1', name: "Gustavo D'Avilla", number: 11, photoUrl: '/atletas/gustavo-davilla.jpg' },
  { id: 'p7', teamId: 't1', name: 'Eduardo Gomes', number: 20, photoUrl: '/atletas/eduardo-gomes.jpg' },
  { id: 'p8', teamId: 't1', name: 'Gustavo Gutierrez', number: 10, photoUrl: '/atletas/gustavo-gutierrez.jpg' },
  { id: 'p9', teamId: 't1', name: 'Leandro Barbosa', number: 4, photoUrl: '/atletas/leandro-barbosa.jpg' },
  { id: 'p10', teamId: 't1', name: 'Tiago Sgarbi', number: 33, photoUrl: '/atletas/tiago-sgarbi.jpg' },
  { id: 'p11', teamId: 't1', name: 'Luca Lima', number: 5, photoUrl: '/atletas/luca-lima.jpg' },
  { id: 'p12', teamId: 't1', name: 'Felipe Machado', number: 13, photoUrl: '/atletas/felipe-machado.jpg' },
  { id: 'p13', teamId: 't1', name: 'Bruno Sabor', number: 21, photoUrl: '/atletas/bruno-sabor.jpg' },
  { id: 'p14', teamId: 't1', name: 'Edinho', number: 23, photoUrl: '/atletas/edinho.jpg' },
  { id: 'p15', teamId: 't1', name: 'Rapha', number: 1, photoUrl: '/atletas/raphael-gomes.jpg' },
  { id: 'p16', teamId: 't1', name: 'Cinthia Fernandes', number: 12, photoUrl: '/atletas/cinthia-fernandes.jpg' },
  { id: 'p17', teamId: 't1', name: 'Bruna Simões', number: 22, photoUrl: '/atletas/bruna-simoes.jpg' },
  { id: 'p18', teamId: 't1', name: 'Sabrina Araujo', number: 3, photoUrl: '/atletas/sabrina-araujo.jpg' },
]

// Comissão técnica do WE.
const coaches: Coach[] = [
  { id: 'c1', teamId: 't1', name: 'Renan Cano', role: 'Técnico', photoUrl: '/atletas/renan-cano.jpg' },
]

function stat(
  id: string,
  playerId: string,
  matchId: string,
  extra: Partial<Omit<PlayerMatchStat, 'id' | 'playerId' | 'matchId'>> = {},
): PlayerMatchStat {
  return {
    id,
    playerId,
    matchId,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    played: true,
    ...extra,
  }
}

// Estatísticas lançadas em Admin > Estatísticas conforme os jogos acontecem.
const stats: PlayerMatchStat[] = [
  // Rodada 1 - WE 5x1 Publicis (m2)
  stat('s1', 'p18', 'm2'),
  stat('s2', 'p9', 'm2'),
  stat('s3', 'p4', 'm2'),
  stat('s4', 'p5', 'm2'),
  stat('s5', 'p1', 'm2', { goals: 1, assists: 1 }),
  stat('s6', 'p3', 'm2', { goals: 1 }),
  stat('s7', 'p8', 'm2'),
  stat('s8', 'p16', 'm2', { goals: 1 }),
  stat('s9', 'p12', 'm2'),
  stat('s10', 'p7', 'm2'),
  stat('s11', 'p13', 'm2'),
  stat('s12', 'p14', 'm2', { played: false }),
  stat('s13', 'p10', 'm2'),

  // Rodada 4 - WE 5x0 Talent (m7)
  stat('s14', 'p15', 'm7'),
  stat('s15', 'p2', 'm7'),
  stat('s16', 'p18', 'm7'),
  stat('s17', 'p11', 'm7', { played: false }),
  stat('s18', 'p4', 'm7', { goals: 1 }),
  stat('s19', 'p5', 'm7'),
  stat('s20', 'p1', 'm7', { assists: 1 }),
  stat('s21', 'p3', 'm7', { played: false }),
  stat('s22', 'p8', 'm7', { goals: 1 }),
  stat('s23', 'p6', 'm7'),
  stat('s24', 'p16', 'm7', { goals: 2, assists: 1 }),
  stat('s25', 'p7', 'm7'),
  stat('s26', 'p13', 'm7'),
  stat('s27', 'p17', 'm7'),
  stat('s28', 'p14', 'm7'),
  stat('s29', 'p10', 'm7', { assists: 1 }),

  // Rodada 6 - WE 3x0 WMcCann (m11)
  stat('s30', 'p15', 'm11'),
  stat('s31', 'p18', 'm11'),
  stat('s32', 'p4', 'm11'),
  stat('s33', 'p5', 'm11'),
  stat('s34', 'p1', 'm11', { goals: 1 }),
  stat('s35', 'p3', 'm11', { assists: 1 }),
  stat('s36', 'p8', 'm11', { redCards: 1 }),
  stat('s37', 'p16', 'm11', { goals: 1 }),
  stat('s38', 'p7', 'm11'),
  stat('s39', 'p13', 'm11'),
  stat('s40', 'p10', 'm11'),
  stat('s41', 'p12', 'm11'),
]

export const seedData: ChampionshipData = {
  myTeamId: 't1',
  teams,
  matches,
  players,
  coaches,
  stats,
}
