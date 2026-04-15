"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

type ResultadoMes = {
  mes: number;
  saldoInicial: number;
  rendimento: number;
  parcela: number;
  saldoFinal: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function Page() {
  const [valorVista, setValorVista] = useState<string>("0");
  const [valorParcelado, setValorParcelado] = useState<string>("0");
  const [numeroParcelas, setNumeroParcelas] = useState<string>("0");
  const [taxaCdiAnual, setTaxaCdiAnual] = useState<string>("15");

  const calculo = useMemo(() => {
    const vista = Number(valorVista.replace(",", "."));
    const parcelado = Number(valorParcelado.replace(",", "."));
    const parcelas = Number(numeroParcelas);
    const cdiAnual = Number(taxaCdiAnual.replace(",", "."));

    if (
      !Number.isFinite(vista) ||
      !Number.isFinite(parcelado) ||
      !Number.isFinite(parcelas) ||
      !Number.isFinite(cdiAnual) ||
      vista <= 0 ||
      parcelado <= 0 ||
      parcelas <= 0
    ) {
      return null;
    }

    const valorParcela = parcelado / parcelas;
    const taxaMensal = Math.pow(1 + cdiAnual / 100, 1 / 12) - 1;

    let saldo = vista;
    const evolucao: ResultadoMes[] = [];

    for (let mes = 1; mes <= parcelas; mes += 1) {
      const saldoInicial = saldo;
      const rendimento = saldoInicial * taxaMensal;
      const saldoComRendimento = saldoInicial + rendimento;
      const saldoFinal = saldoComRendimento - valorParcela;

      evolucao.push({
        mes,
        saldoInicial,
        rendimento,
        parcela: valorParcela,
        saldoFinal,
      });

      saldo = saldoFinal;
    }

    const custoExtraParcelado = parcelado - vista;
    const saldoFinalInvestindo = saldo;
    const vantagemParcelado = saldoFinalInvestindo;

    return {
      vista,
      parcelado,
      parcelas,
      cdiAnual,
      taxaMensal,
      valorParcela,
      custoExtraParcelado,
      saldoFinalInvestindo,
      vantagemParcelado,
      melhorOpcao:
        vantagemParcelado > 0
          ? "Parcelar e investir"
          : vantagemParcelado < 0
            ? "Pagar à vista"
            : "Empate",
      resumo:
        vantagemParcelado > 0
          ? `Ao parcelar e investir o valor à vista, sobra ${formatCurrency(Math.abs(vantagemParcelado))} ao final.`
          : vantagemParcelado < 0
            ? "O rendimento do investimento não compensa o custo do parcelamento."
            : "As duas opções terminam praticamente no mesmo ponto.",
      evolucao,
    };
  }, [valorVista, valorParcelado, numeroParcelas, taxaCdiAnual]);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.badge}>Comparador financeiro</div>
          <h1 className={styles.title}>Vale mais a pena pagar à vista ou parcelar?</h1>
          <p className={styles.subtitle}>
            Compare o custo do parcelamento com o rendimento de deixar o valor à vista
            investido. O simulador calcula mês a mês quanto sobraria ao final.
          </p>
        </section>

        <div className={styles.grid}>
          <aside className={styles.sidebar}>
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>O que preencher</h2>

              <div className={styles.infoBlock}>
                <h3>Valor à vista</h3>
                <p>Preço pago hoje em uma única vez. Exemplo: R$ 8.000,00.</p>
              </div>

              <div className={styles.infoBlock}>
                <h3>Valor parcelado total</h3>
                <p>Soma de todas as parcelas. Exemplo: 8x de R$ 1.075,00 = R$ 8.600,00.</p>
              </div>

              <div className={styles.infoBlock}>
                <h3>Número de parcelas</h3>
                <p>Quantidade de meses em que o pagamento será dividido.</p>
              </div>

              <div className={styles.infoBlock}>
                <h3>Taxa anual do CDI</h3>
                <p>Taxa anual usada para simular o rendimento do dinheiro investido.</p>
              </div>
            </div>

            <div className={styles.callout}>
              <h3>Como o cálculo funciona</h3>
              <p>
                O app considera que o valor à vista fica investido no início. Em cada mês,
                aplica o rendimento equivalente da taxa anual informada e depois desconta o valor da parcela.
              </p>
            </div>
          </aside>

          <section className={styles.content}>
            <div className={styles.panel}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.panelTitle}>Dados da simulação</h2>
                  <p className={styles.muted}>Preencha os campos abaixo para comparar as duas opções.</p>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="vista">Valor à vista</label>
                  <input
                    id="vista"
                    type="number"
                    min="0"
                    step="0.01"
                    value={valorVista}
                    onChange={(e) => setValorVista(e.target.value)}
                  />
                  <span>Preço para pagar tudo hoje.</span>
                </div>

                <div className={styles.field}>
                  <label htmlFor="parcelado">Valor parcelado total</label>
                  <input
                    id="parcelado"
                    type="number"
                    min="0"
                    step="0.01"
                    value={valorParcelado}
                    onChange={(e) => setValorParcelado(e.target.value)}
                  />
                  <span>Soma de todas as parcelas.</span>
                </div>

                <div className={styles.field}>
                  <label htmlFor="parcelas">Número de parcelas</label>
                  <input
                    id="parcelas"
                    type="number"
                    min="1"
                    step="1"
                    value={numeroParcelas}
                    onChange={(e) => setNumeroParcelas(e.target.value)}
                  />
                  <span>Quantidade de meses do parcelamento.</span>
                </div>

                <div className={styles.field}>
                  <label htmlFor="cdi">Taxa anual do CDI (%)</label>
                  <input
                    id="cdi"
                    type="number"
                    min="0"
                    step="0.01"
                    value={taxaCdiAnual}
                    onChange={(e) => setTaxaCdiAnual(e.target.value)}
                  />
                  <span>Usada para transformar a taxa anual em taxa mensal.</span>
                </div>
              </div>
            </div>

            {calculo && (
              <>
                <div className={styles.cardGrid}>
                  <article className={`${styles.statCard} ${styles.statGreen}`}>
                    <p>Parcela mensal</p>
                    <strong>{formatCurrency(calculo.valorParcela)}</strong>
                    <span>Quanto sai do investimento a cada mês.</span>
                  </article>

                  <article className={`${styles.statCard} ${styles.statBlue}`}>
                    <p>Taxa mensal equivalente</p>
                    <strong>{formatPercent(calculo.taxaMensal * 100)}</strong>
                    <span>Conversão da taxa anual informada.</span>
                  </article>

                  <article className={`${styles.statCard} ${styles.statPurple}`}>
                    <p>Custo extra do parcelado</p>
                    <strong>{formatCurrency(calculo.custoExtraParcelado)}</strong>
                    <span>Diferença entre parcelado e à vista.</span>
                  </article>

                  <article className={`${styles.statCard} ${styles.statGold}`}>
                    <p>Saldo final investindo</p>
                    <strong>{formatCurrency(calculo.saldoFinalInvestindo)}</strong>
                    <span>Quanto sobra depois da última parcela.</span>
                  </article>
                </div>

                <div className={styles.resultLayout}>
                  <div className={styles.panel}>
                    <h2 className={styles.panelTitle}>Conclusão</h2>
                    <div className={styles.resultBox}>
                      <p className={styles.resultLabel}>Melhor decisão</p>
                      <h3 className={styles.resultTitle}>{calculo.melhorOpcao}</h3>
                      <p className={styles.resultText}>{calculo.resumo}</p>
                    </div>

                    <div className={styles.compareGrid}>
                      <div className={styles.compareCard}>
                        <p>Cenário pagando à vista</p>
                        <strong>{formatCurrency(0)}</strong>
                        <span>Você quita tudo agora e não mantém o dinheiro investido.</span>
                      </div>

                      <div className={styles.compareCard}>
                        <p>Cenário parcelando</p>
                        <strong>{formatCurrency(calculo.saldoFinalInvestindo)}</strong>
                        <span>Valor remanescente após investir e retirar as parcelas.</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.panel}>
                    <h2 className={styles.panelTitle}>Evolução mês a mês</h2>
                    <p className={styles.muted}>Veja como o saldo investido evolui até a última parcela.</p>

                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Mês</th>
                            <th>Saldo inicial</th>
                            <th>Rendimento</th>
                            <th>Parcela</th>
                            <th>Saldo final</th>
                          </tr>
                        </thead>
                        <tbody>
                          {calculo.evolucao.map((item) => (
                            <tr key={item.mes}>
                              <td>{item.mes}</td>
                              <td>{formatCurrency(item.saldoInicial)}</td>
                              <td className={styles.positive}>{formatCurrency(item.rendimento)}</td>
                              <td className={styles.negative}>{formatCurrency(item.parcela)}</td>
                              <td><strong>{formatCurrency(item.saldoFinal)}</strong></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
