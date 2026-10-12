# Plano de Gestão do Conhecimento do Projeto

> **Base:** PMBOK® 6ª ed. (processo 4.4 Gerenciar o Conhecimento) · PMBOK 7ª/8ª ed. (princípios e domínios Equipe e Medição) · ISO 30401:2018 · Modelo SECI (Nonaka & Takeuchi) · ABEPRO – Engenharia Organizacional (Gestão do Conhecimento)

| Campo | Valor |
|---|---|
| Projeto | [Nome do projeto] |
| Código | [PRJ-000] |
| Gerente do projeto | [Nome] |
| Gestor do conhecimento | [Nome] |
| Versão / Data | [1.0] / [dd/mm/aaaa] |

---

## 1. Objetivo
Garantir que o conhecimento **existente** seja usado para executar melhor o projeto e que o conhecimento **gerado** seja capturado, compartilhado e reaproveitado pela organização, reduzindo retrabalho e a perda de saber quando pessoas saem.

## 2. Tipos de conhecimento
| Tipo | Definição | Exemplos no projeto | Como tratar |
|---|---|---|---|
| **Explícito** | Codificado em palavras, números, desenhos | Procedimentos, POPs, especificações, código, relatórios | Repositório, versionamento, taxonomia |
| **Tácito** | Experiência, intuição, "saber fazer" | Ajuste fino de máquina, negociação com fornecedor | Mentoria, shadowing, comunidades de prática, storytelling |

## 3. Modelo SECI aplicado
| Conversão | Do → Para | Práticas planejadas |
|---|---|---|
| **Socialização** | Tácito → Tácito | [Pareamento, gemba walk, job rotation] |
| **Externalização** | Tácito → Explícito | [Lições aprendidas, POPs, vídeos curtos de procedimento, A3] |
| **Combinação** | Explícito → Explícito | [Wiki do projeto, base de lições de projetos anteriores, painéis] |
| **Internalização** | Explícito → Tácito | [Treinamento on-the-job, simulações, OPL – lição ponto a ponto] |

## 4. Mapa de conhecimento crítico
| ID | Conhecimento crítico | Detentor(es) | Risco de perda (1–5) | Impacto (1–5) | Ação de retenção | Prazo |
|---|---|---|---|---|---|---|
| K01 | *Ex.:* Parametrização do forno | Técnico sênior (aposenta em 6 meses) | 5 | 5 | Mentoria + POP em vídeo + sucessor nomeado | [dd/mm] |
| K02 | *Ex.:* Regras do novo ERP/MES | Consultoria externa | 4 | 4 | Cláusula contratual de transferência de conhecimento | [dd/mm] |
| K03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

> Conhecimentos com risco × impacto ≥ 15 entram também no **Registro de Riscos**.

## 5. Papéis e responsabilidades
| Papel | Responsabilidade |
|---|---|
| Gerente do projeto | Garantir tempo e orçamento para as práticas de gestão do conhecimento |
| Gestor do conhecimento / PMO | Curadoria do repositório, taxonomia, indicadores |
| Líderes técnicos | Validar conteúdo técnico, conduzir mentorias |
| Toda a equipe | Registrar lições continuamente (não só no encerramento) |

## 6. Ferramentas e repositórios
| Finalidade | Ferramenta | Local / Link | Acesso |
|---|---|---|---|
| Documentos e versões | [SharePoint / Google Drive / GitHub] | [link] | [Equipe] |
| Wiki / base de conhecimento | [Confluence / Notion] | [link] | [Organização] |
| Registro de lições aprendidas | [Planilha / lista] | [link] | [PMO] |
| Comunicação síncrona | [Teams / Slack] | [canal] | [Equipe] |
| Busca e síntese assistidas por IA | [Ferramenta aprovada pela TI] | [ ] | [Conforme política de dados] |

**Taxonomia de etiquetas:** `fase` · `área ABEPRO` · `tipo` (técnica, gestão, fornecedor) · `processo` · `equipamento`

## 7. Registro de Lições Aprendidas (modelo)
| ID | Data | Fase | Situação (o que aconteceu) | Impacto | Causa-raiz | Recomendação | Categoria | Autor | Aplicada em |
|---|---|---|---|---|---|---|---|---|---|
| L01 | [dd/mm] | Planejamento | *Ex.:* Prazo de importação estimado em 30 dias; real foi 75 | +45 dias no caminho crítico | Estimativa sem consultar o despachante | Consultar o despachante e usar o histórico de lead time na estimativa | Aquisições | [Nome] | [PRJ-xxx] |
| L02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

## 8. Rotinas de conhecimento
| Rotina | Quando | Duração | Saída |
|---|---|---|---|
| Consulta à base de lições (*lessons-in*) | Antes do kickoff e de cada fase | 1–2 h | Lista de lições aplicáveis |
| Retrospectiva / After Action Review | Fim de sprint ou marco | 30–60 min | Lições + ações de melhoria |
| Comunidade de prática | [Mensal] | 1 h | Ata + conteúdo na wiki |
| Revisão pós-projeto (*lessons-out*) | Encerramento | 2–4 h | Relatório consolidado |

## 9. Indicadores (ISO 30401 – avaliação de desempenho)
| Indicador | Meta | Fonte |
|---|---|---|
| Lições registradas por fase | ≥ [5] | Registro |
| % de lições com recomendação acionável | ≥ [80%] | Curadoria |
| Lições de projetos anteriores reaplicadas | ≥ [3] | Registro, coluna "Aplicada em" |
| Conhecimentos críticos com sucessor/POP | [100%] | Mapa (seção 4) |
| Acesso ao repositório (usuários ativos/mês) | ≥ [70% da equipe] | Analytics |

## 10. Cultura, segurança e conformidade
- Lições são **sem culpa** (*blameless*): foco no processo, não na pessoa.
- Respeitar confidencialidade, propriedade intelectual, segredos industriais e a **LGPD**.
- Conteúdo gerado com IA deve ser **revisado por um humano** antes de virar referência oficial.

## 11. Checklist de qualidade
- [ ] Conhecimentos críticos mapeados com risco de perda
- [ ] Práticas para conhecimento tácito **e** explícito planejadas
- [ ] Repositório único definido, com taxonomia e permissões
- [ ] Lições coletadas ao longo do projeto, não só no fim
- [ ] Indicadores com meta e responsável
- [ ] Integração com Riscos (perda de conhecimento) e Stakeholders (detentores-chave)

## Aprovação
| Nome | Papel | Assinatura | Data |
|---|---|---|---|
| [ ] | Patrocinador | | |
| [ ] | Gerente do projeto | | |
