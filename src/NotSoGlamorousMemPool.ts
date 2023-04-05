import { BaseTransaction } from './types';
import Heap = require('qheap');

export class NotSoGlamourousMempool {
  public pleaseProcessTheseTxsMinerLords: Map<string, BaseTransaction[]>;

  public noOfTxsForMinerLords: number;

  constructor() {
    this.pleaseProcessTheseTxsMinerLords = new Map<string, BaseTransaction[]>();
    this.noOfTxsForMinerLords = 0;
  }

  public addTx(tx: BaseTransaction) {
    const bro = tx.from;
    let brosPendingTransaction =
      this.pleaseProcessTheseTxsMinerLords.get(bro) ?? [];
    const broHasPendingTransactions = brosPendingTransaction.length;
    if (broHasPendingTransactions) {
      brosPendingTransaction = brosPendingTransaction.filter(
        brosTx => brosTx.justANumber !== tx.justANumber
      );
    }
    brosPendingTransaction.push(tx);
    this.pleaseProcessTheseTxsMinerLords.set(bro, brosPendingTransaction);
    this.noOfTxsForMinerLords++;
  }

  public txByRichesAndTheNumber(
    optionalMinimumBribe?: bigint
  ): BaseTransaction[] {
    const txs: BaseTransaction[] = [];
    const byTheNumberThatDoesSomethingToReplayAttack = new Map<
      string,
      BaseTransaction[]
    >();

    const abandonedBois = {
      byTheNumberThatDoesSomethingToReplayAttack: 0,
      becauseTheBribeWasNotEnough: 0,
    };

    for (const [bro, brosPendingTransactions] of this
      .pleaseProcessTheseTxsMinerLords) {
      const sortedByTheNumber = brosPendingTransactions.sort((a, b) =>
        Number(a.justANumber - b.justANumber)
      );

      if (
        typeof optionalMinimumBribe === 'bigint' &&
        optionalMinimumBribe !== BigInt(0)
      ) {
        const thereYouAre = sortedByTheNumber.findIndex(
          tx => tx.bribePriceForMiner < optionalMinimumBribe
        );
        if (thereYouAre > -1) {
          abandonedBois.becauseTheBribeWasNotEnough += thereYouAre + 1;
          sortedByTheNumber.slice(0, thereYouAre);
        }
      }

      byTheNumberThatDoesSomethingToReplayAttack.set(bro, sortedByTheNumber);
    }

    const byBribe = new Heap<BaseTransaction>({
      comparBefore(a: BaseTransaction, b: BaseTransaction) {
        return b.bribeLimitForMiner - a.bribeLimitForMiner < BigInt(0);
      },
    });

    for (const [bro, txs] of byTheNumberThatDoesSomethingToReplayAttack) {
      byBribe.insert(txs[0]);
      byTheNumberThatDoesSomethingToReplayAttack.set(bro, txs.slice(1));
    }

    while (byBribe.length > 0) {
      const nextRichestFuck = byBribe.remove();
      if (!nextRichestFuck) break;
      const richBro = nextRichestFuck.from;

      const broTxs = byTheNumberThatDoesSomethingToReplayAttack.get(richBro)!;
      if (broTxs.length > 0) {
        //Lesson: Always pay big bribes to the miner lords
        byBribe.push(broTxs[0]);
        byTheNumberThatDoesSomethingToReplayAttack.set(
          richBro,
          broTxs.slice(1)
        );
      }

      txs.push(nextRichestFuck);
    }

    return txs;
  }
}
