import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import { getEnv } from "@/lib/env";

const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

function getSigningKeypair() {
  const env = getEnv();

  if (!env.SOLANA_PRIVATE_KEY_JSON) {
    throw new Error("SOLANA_PRIVATE_KEY_JSON is required to write Devnet records");
  }

  const parsed = JSON.parse(env.SOLANA_PRIVATE_KEY_JSON) as number[];

  if (!Array.isArray(parsed) || parsed.length < 32) {
    throw new Error("SOLANA_PRIVATE_KEY_JSON must be a JSON array secret key");
  }

  return Keypair.fromSecretKey(Uint8Array.from(parsed));
}

export async function registerRescueMemo(payload: {
  rescueActionId: string;
  recommendation: string;
  itemName: string;
}) {
  const env = getEnv();
  const payer = getSigningKeypair();
  const network = env.SOLANA_NETWORK || "devnet";
  const endpoint = network === "devnet" ? clusterApiUrl("devnet") : network;
  const connection = new Connection(endpoint, "confirmed");

  const memo = JSON.stringify({
    app: "before-it-becomes-trash",
    type: "eco-rescue-badge",
    rescueActionId: payload.rescueActionId,
    recommendation: payload.recommendation,
    itemName: payload.itemName,
    createdAt: new Date().toISOString(),
  });

  const instruction = new TransactionInstruction({
    keys: [],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(memo, "utf8"),
  });

  const tx = new Transaction().add(instruction);
  tx.feePayer = payer.publicKey;

  const signature = await sendAndConfirmTransaction(connection, tx, [payer]);

  return {
    network,
    signature,
    explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    memo,
  };
}
