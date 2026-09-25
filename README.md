# Mídia's Cup — Dashboard

Dashboard para acompanhar o campeonato de futebol/futsal da Mídia's Cup: classificação geral, jogos, e o desempenho do time e dos atletas.

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Stack

Vite + React + TypeScript + Tailwind CSS + shadcn/ui + React Router — a mesma base que o Lovable usa, para facilitar subir o projeto lá depois.

## Como os dados funcionam (por enquanto)

Não há backend ainda: os dados ficam salvos no `localStorage` do navegador, iniciando com dados de exemplo (`src/lib/seed-data.ts`). Tudo é editado pelo painel **Admin** (`/admin`, senha padrão `midiascup2026`, configurável em `src/components/admin/AdminGate.tsx`).

Como só temos estatísticas individuais do nosso time, os outros times do campeonato aparecem apenas nos placares e na classificação geral — não há elenco nem estatísticas de atletas adversários em nenhuma tela.

## Formato do campeonato

8 times, 2 fases:

1. **Fase 1 — pontos corridos**: todos os times jogam entre si, 28 jogos ao longo de 14 rodadas (cronograma real em `crono_de_jogos.xlsx`, de 10/set a 17/nov). Define a classificação.
2. **Fase 2 — mata-mata**: só os 4 primeiros da fase 1 avançam. 1º x 4º e 2º x 3º nas semifinais; vencedores vão para a final, perdedores disputam o 3º lugar.

Os confrontos do mata-mata começam como "A definir" — em Admin > Jogos, use os botões **"Gerar semifinais"** (libera quando todos os 28 jogos da fase 1 estiverem marcados como realizados) e **"Definir final e disputa de 3º lugar"** (libera quando as duas semifinais tiverem resultado) para preencher os times automaticamente a partir da classificação/resultados. Nada é gerado sozinho — é sempre você quem aciona.

## Páginas

- **Visão Geral** (`/`) — classificação da fase 1, próximos jogos, últimos resultados, artilheiro e garçom do time
- **Meu Time** (`/meu-time`) — todos os jogos (fase 1 + mata-mata) e o elenco do time
- **Atletas** (`/atletas`) — ranking individual (gols, assistências, jogos, cartões)
- **Jogos** (`/jogos`) — calendário completo: mata-mata e fase 1 por rodada
- **Admin** (`/admin`) — cadastrar times e atletas, lançar placares da fase 1, gerar e lançar o mata-mata, e estatísticas por partida

## Subindo para o Lovable

O projeto usa a stack padrão do Lovable (Vite/React/TS/Tailwind/shadcn), então dá para importar este código direto por lá. Quando migrar, o ideal é trocar o `localStorage` por Supabase (Lovable já integra) para os dados persistirem de verdade e o Admin virar autenticação real em vez da senha simples deste protótipo.
