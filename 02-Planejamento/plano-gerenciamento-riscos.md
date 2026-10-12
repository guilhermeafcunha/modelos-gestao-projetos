# Plano de Gerenciamento de Riscos

> **Base:** PMBOK® 7ª/8ª ed. (domínio Incerteza / Riscos) · ISO 31000:2018 · ABEPRO – Engenharia Organizacional
> **Abordagem:** preditiva, ágil ou híbrida (ver seção 9)

| Campo | Valor |
|---|---|
| Projeto | [Nome do projeto] |
| Código | [PRJ-000] |
| Gerente do projeto | [Nome] |
| Patrocinador | [Nome] |
| Versão / Data | [1.0] / [dd/mm/aaaa] |
| Status | [Rascunho · Em revisão · Aprovado] |

---

## 1. Objetivo
Definir **como** os riscos (ameaças e oportunidades) serão identificados, analisados, tratados, monitorados e comunicados ao longo do ciclo de vida do projeto.

## 2. Contexto e critérios (ISO 31000 – cláusula 6.3)
- **Contexto externo:** [mercado, regulação, clima, fornecedores, câmbio]
- **Contexto interno:** [maturidade, capacidade da equipe, outros projetos concorrentes]
- **Objetivos do projeto afetados:** escopo · prazo · custo · qualidade · segurança · ESG · reputação

### 2.1 Apetite e tolerância ao risco
| Objetivo | Apetite | Limite de tolerância |
|---|---|---|
| Prazo | [Moderado] | [Atraso ≤ 10% na data final] |
| Custo | [Baixo] | [Desvio ≤ 5% do orçamento (BAC)] |
| Qualidade / Segurança | [Zero] | [Nenhum acidente com afastamento] |
| *Ex.:* Escopo | Moderado | Até 2 entregas não críticas postergadas |

## 3. Papéis e responsabilidades
| Papel | Responsabilidade |
|---|---|
| Patrocinador | Aprovar apetite, reservas e respostas acima da alçada do GP |
| Gerente do projeto | Conduzir o processo, manter o registro, escalar riscos |
| Dono do risco | Monitorar gatilhos e executar a resposta |
| Equipe | Identificar riscos continuamente |
| PMO / Comitê de riscos | Consolidar riscos no nível do portfólio |

## 4. Metodologia (processo)
```
Planejar → Identificar → Análise qualitativa → Análise quantitativa → Planejar respostas → Implementar → Monitorar
              ↑_____________________________ comunicação e consulta contínuas __________________________↑
```
| Etapa | Técnicas e ferramentas |
|---|---|
| Identificar | Brainstorming, Delphi, checklist histórico, SWOT, análise de premissas, entrevistas, RBS |
| Qualitativa | Matriz Probabilidade × Impacto, urgência, proximidade |
| Quantitativa | Monte Carlo, árvore de decisão (VME), análise de sensibilidade (tornado) |
| Respostas | Ver seção 7 |
| Monitorar | Auditoria de riscos, análise de reservas, revisão de gatilhos, burndown de riscos |

## 5. Estrutura Analítica de Riscos (RBS)
| Nível 1 | Nível 2 (categorias) |
|---|---|
| Técnico | Requisitos · Tecnologia · Qualidade · Interfaces |
| Externo | Fornecedores · Regulação · Mercado · Clima |
| Organizacional | Recursos · Financiamento · Priorização |
| Gerencial | Estimativas · Planejamento · Comunicação |
| ESG | Ambiental · Social · Governança/Compliance |

## 6. Escalas de probabilidade e impacto
| Nível | Probabilidade | Impacto em prazo | Impacto em custo |
|---|---|---|---|
| 1 – Muito baixo | < 10% | < 1 semana | < 1% BAC |
| 2 – Baixo | 10–30% | 1–2 semanas | 1–3% |
| 3 – Médio | 31–50% | 2–4 semanas | 3–5% |
| 4 – Alto | 51–70% | 1–2 meses | 5–10% |
| 5 – Muito alto | > 70% | > 2 meses | > 10% |

### 6.1 Matriz P × I (pontuação = P × I)
| P \ I | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| **5** | 5 🟡 | 10 🟠 | 15 🔴 | 20 🔴 | 25 🔴 |
| **4** | 4 🟢 | 8 🟡 | 12 🟠 | 16 🔴 | 20 🔴 |
| **3** | 3 🟢 | 6 🟡 | 9 🟠 | 12 🟠 | 15 🔴 |
| **2** | 2 🟢 | 4 🟢 | 6 🟡 | 8 🟡 | 10 🟠 |
| **1** | 1 🟢 | 2 🟢 | 3 🟢 | 4 🟢 | 5 🟡 |

🟢 1–4 aceitar/monitorar · 🟡 5–8 plano de resposta · 🟠 9–12 resposta + dono dedicado · 🔴 ≥ 15 escalar ao patrocinador

## 7. Estratégias de resposta
| Ameaças | Oportunidades | Ambas |
|---|---|---|
| Escalar · Evitar · Transferir · Mitigar | Escalar · Explorar · Compartilhar · Melhorar | Aceitar (ativa ou passiva) |

## 8. Reservas
| Reserva | Cobre | Valor | Quem libera |
|---|---|---|---|
| Contingência | Riscos identificados (*known-unknowns*) | [R$ = Σ VME das ameaças] | Gerente do projeto |
| Gerencial | Riscos não identificados (*unknown-unknowns*) | [% do orçamento] | Patrocinador |

## 9. Adaptação para ágil / híbrido
- Riscos entram no **backlog** como spikes ou itens de mitigação, priorizados pelo PO.
- Revisão de riscos no **planejamento da sprint** e na **retrospectiva**.
- **Burndown de riscos** (exposição total × sprint) como métrica.
- Entregas incrementais reduzem a incerteza técnica: prefira **MVP e protótipos** a análises longas.

## 10. Registro de Riscos (modelo)
| ID | Categoria (RBS) | Descrição (Causa → Evento → Efeito) | Tipo | P | I | P×I | Gatilho | Estratégia | Ação de resposta | Dono | Prazo | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R01 | Externo / Fornecedores | *Ex.:* Por depender de fornecedor único de aço, pode haver atraso na entrega, causando parada da montagem | Ameaça | 4 | 4 | 16 | Confirmação de pedido > 5 dias | Mitigar | Qualificar 2º fornecedor; estoque de segurança | [Nome] | [dd/mm] | Aberto |
| R02 | Técnico | *Ex.:* Com a nova máquina CNC, o tempo de setup pode cair 30%, liberando capacidade | Oportunidade | 3 | 3 | 9 | Teste piloto ok | Explorar | Antecipar o treinamento SMED | [Nome] | [dd/mm] | Aberto |
| R03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

## 11. Frequência e comunicação
| Atividade | Frequência | Participantes | Saída |
|---|---|---|---|
| Revisão do registro | [Semanal / a cada sprint] | GP + donos | Registro atualizado |
| Relatório de riscos | [Mensal] | Patrocinador, comitê | Top 10 riscos + tendência |
| Auditoria de riscos | [Por fase / trimestral] | PMO | Relatório de eficácia |

## 12. Checklist de qualidade
- [ ] Apetite e tolerâncias aprovados pelo patrocinador
- [ ] RBS adaptada ao projeto
- [ ] Escalas P × I calibradas com o orçamento e o prazo reais
- [ ] Todo risco ≥ 🟡 tem dono, gatilho e resposta
- [ ] Oportunidades também foram identificadas
- [ ] Reservas calculadas e incluídas na linha de base de custos
- [ ] Riscos ligados ao plano de stakeholders e ao plano de comunicações

## Aprovação
| Nome | Papel | Assinatura | Data |
|---|---|---|---|
| [ ] | Patrocinador | | |
| [ ] | Gerente do projeto | | |
