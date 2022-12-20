import {
  LAMPORTS_PER_SOL,
  ParsedTransactionWithMeta,
  PartiallyDecodedInstruction,
} from '@solana/web3.js';
import connection from '../utils/connection';
import retry from 'async-retry';
import { ActionType, Activity, logFound } from '../types/web3';
import { MagicEdenV2ProgramID } from '../utils/constants';

class MagicEdenParser {
  constructor() {}

  public parse = async (sig: string, retries = 10): Promise<Activity | null> =>
    retry(
      async () => {
        // get parsed transaction
        const tx = await this.parseSig(sig);

        // if transaction exists
        if (tx) {
          // get transaction type
          const txType = this.getType(tx);

          // analyze transaction according to the type
          if (txType) {
            return this.getActivity(txType, tx);
          }
          return null;
        } else {
          throw 'Null transaction returned';
        }
      },
      {
        retries,
        onRetry(e, attempt) {
          console.log(`Error occurs after trying ${attempt}th attempt`);
          console.log(e);
        },
      }
    );

  private parseSig = async (
    sigature: string
  ): Promise<ParsedTransactionWithMeta | null> =>
    await connection.getParsedTransaction(sigature, 'confirmed');

  private getType = (tx: ParsedTransactionWithMeta): ActionType | null => {
    const magicedenIx = tx.transaction.message.instructions.find(
      (ix) => ix.programId.toBase58() === MagicEdenV2ProgramID
    );

    if (magicedenIx && tx.meta) {
      const logMessages = tx.meta.logMessages;
      if (logMessages) {
        console.log(logMessages);

        // if sell
        if (logFound(logMessages, 'Instruction: ExecuteSale')) {
          return ActionType.SALE;
        }
        if (logFound(logMessages, 'Instruction: Sell')) {
          return ActionType.LISTING;
        }
        if (logFound(logMessages, 'Instruction: Buy')) {
          return ActionType.BID;
        }
        if (logFound(logMessages, 'Instruction: CancelSell')) {
          return ActionType.DELISTING;
        }
      }
    }

    return null;
  };

  private getActivity = (
    txType: ActionType,
    tx: ParsedTransactionWithMeta
  ): Activity | null => {
    const ixs = tx.transaction.message.instructions;
    console.log(ixs);
    const lastIX = ixs.pop() as PartiallyDecodedInstruction;
    if (txType === ActionType.SALE) {
      return {
        buyerWallet: lastIX.accounts[0].toBase58(),
        sellerWallet: lastIX.accounts[1].toBase58(),
        mint: lastIX.accounts[4].toBase58(),
        price: this.getPrice(tx.meta?.logMessages ?? []),
        blocktime: tx.blockTime ?? 0,
      };
    }
    if (txType === ActionType.LISTING) {
      return {
        buyerWallet: null,
        sellerWallet: lastIX.accounts[0].toBase58(),
        mint: lastIX.accounts[4].toBase58(),
        price: this.getPrice(tx.meta?.logMessages ?? []),
        blocktime: tx.blockTime ?? 0,
      };
    }
    if (txType === ActionType.BID) {
      return {
        buyerWallet: lastIX.accounts[0].toBase58(),
        sellerWallet: null,
        mint: lastIX.accounts[2].toBase58(),
        price: this.getPrice(tx.meta?.logMessages ?? []),
        blocktime: tx.blockTime ?? 0,
      };
    }
    if (txType === ActionType.DELISTING) {
      return {
        buyerWallet: null,
        sellerWallet: lastIX.accounts[0].toBase58(),
        mint: lastIX.accounts[3].toBase58(),
        price: null,
        blocktime: tx.blockTime ?? 0,
      };
    }
    return null;
  };

  private getPrice = (messages: string[]): number => {
    const priceMessage = messages.find((message) =>
      message.includes(`"price":`)
    );
    if (priceMessage) {
      const latter = priceMessage.split(`"price":`)[1];
      const slices = latter.split(',');
      if (slices.length > 0) {
        return parseInt(slices[0].trim(), 10) / LAMPORTS_PER_SOL;
      }
    }
    return 0;
  };
}

export default MagicEdenParser;
