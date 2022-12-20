import { ParsedTransactionWithMeta } from "@solana/web3.js";
import connection from "../utils/connection";
import retry from 'async-retry';
import { ActionType } from "../types/web3";
import { MagicEdenV2ProgramID } from "../utils/constants";

class MagicEdenParser {

    constructor() { }

    public parse = async (sig: string, retries = 5) => {

        // get parsed transaction
        const parsedTx = retry(async () => {
            const tx = await this.parseSig(sig);
            if (tx) {
                this.getType(tx);
            } else {
                throw ("Null transaction returned");
            }
        }, {
            retries,
            onRetry(e, attempt) {
                console.log(`Error occurs after trying ${attempt}th attempt`);
                console.log(e);
            },
        });

        // analyze the transaction        
    }

    public parseSig = async (sigature: string): Promise<ParsedTransactionWithMeta | null> =>
        await connection.getParsedTransaction(sigature, "confirmed");

    public getType = (tx: ParsedTransactionWithMeta): ActionType | null => {
        const magicedenIx = tx.transaction.message.instructions.find(ix => ix.programId.toBase58() === MagicEdenV2ProgramID);

        if (magicedenIx && tx.meta) {
            const logMsg = tx.meta.logMessages;
            if (logMsg) {
                console.log(logMsg);
            }
        }

        // check for the PartiallyDecodedInstruction type
        // if(magicedenIx) {

        // }
        return null;
    }

}

export default MagicEdenParser