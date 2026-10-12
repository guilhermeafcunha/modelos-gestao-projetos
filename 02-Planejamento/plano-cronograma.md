# Plano de Gerenciamento do Cronograma

> **Base:** PMBOK® 6ª ed. (cap. 6) · PMBOK 8ª ed. (domínio Cronograma) · PMI Practice Standard for Scheduling · ABEPRO – Pesquisa Operacional (CPM/PERT)

| Campo | Valor |
|---|---|
| Projeto | [Nome] |
| Ferramenta | [MS Project · Primavera · ProjectLibre · Jira · Planilha] |
| Versão / Data | [1.0] / [dd/mm/aaaa] |

---

## 1. Regras de elaboração
| Item | Definição |
|---|---|
| Unidade de duração | [Dias úteis] |
| Calendário | [Seg–Sex, 8 h; feriados de (cidade)] |
| Nível de detalhe | [Atividades de 1 a 10 dias] |
| Método de estimativa | [Análoga · Paramétrica · Três pontos (PERT)] |
| Folga crítica | Folga total = 0 → caminho crítico |
| Limite para replanejar | SPI < [0,90] ou atraso em marco > [5 dias] |

## 2. Lista de atividades e estimativa PERT
tₑ = (O + 4M + P) / 6   ·   σ = (P − O) / 6

| ID | Atividade | Pacote EAP | Predecessoras (tipo + lag) | O | M | P | tₑ | σ | Recurso |
|---|---|---|---|---|---|---|---|---|---|
| A | *Ex.:* Especificar equipamento | 1.2.1 | — | 3 | 5 | 9 | 5,3 | 1,0 | Eng. Processos |
| B | *Ex.:* Cotar fornecedores | 1.2.2 | A (TI) | 5 | 10 | 20 | 10,8 | 2,5 | Suprimentos |
| C | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

TI = término-início · II = início-início · TT = término-término · IT = início-término

## 3. Caminho crítico (CPM)
| Atividade | ES | EF | LS | LF | Folga total | Crítica? |
|---|---|---|---|---|---|---|
| [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [Sim/Não] |

- **Duração do projeto (tₑ):** [ ] dias · **σ do caminho crítico:** √Σσ² = [ ]
- **Probabilidade de cumprir a data D:** Z = (D − tₑ) / σ → P = [ ]%

## 4. Marcos
| Marco | Data linha de base | Data prevista | Status |
|---|---|---|---|
| [ ] | [ ] | [ ] | [🟢🟡🔴] |

## 5. Técnicas de compressão
| Técnica | Quando usar | Efeito colateral |
|---|---|---|
| Crashing | Atividades críticas com menor custo marginal por dia | Aumenta o custo |
| Fast tracking | Atividades com dependência flexível | Aumenta o risco e o retrabalho |
| Corrente crítica (CCPM) | Variabilidade alta | Exige pulmões (buffers) e cultura |

## 6. Ágil / híbrido
- **Roadmap** por release e **plano de sprint**; previsão com **velocidade média** ou **Monte Carlo** sobre o throughput.
- Gráficos: **burnup / burndown**, **CFD** (Kanban).

## Checklist
- [ ] Toda atividade tem predecessora e sucessora (exceto início e fim)
- [ ] O caminho crítico foi identificado e comunicado
- [ ] As reservas de tempo estão explícitas
- [ ] A linha de base foi aprovada e salva
