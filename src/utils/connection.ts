import { Connection } from '@solana/web3.js';

const connection = new Connection(
  process.env.RPC_ENDPOINT ?? 'https://rpc.ankr.com/solana'
);

export default connection;
