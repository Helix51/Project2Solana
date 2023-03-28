import React, { useState } from "react";
import { Keypair } from "@solana/web3.js";

import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;

const devnetEndpoint = "https://api.devnet.solana.com";
const connection = new Connection(devnetEndpoint);

function App() {
  const [privateKeyArray, setPrivateKeyArray] = useState("");
  const [toPublicKeyString, setToPublicKeyString] = useState("");

  const handleTransfer = async () => {
    try {
      const privateKeyUint8Array = new Uint8Array(
        privateKeyArray.split(",").map((str) => parseInt(str.trim()))
      );
      const fromAccount = Keypair.fromSecretKey(privateKeyUint8Array);
      console.log("fromAccount Public Key: ", fromAccount.publicKey.toString());

      const toPublicKey = new PublicKey(toPublicKeyString);
      console.log("toPublicKeyObj: ", toPublicKey.toString());

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromAccount.publicKey,
          toPubkey: toPublicKey,
          lamports:2000000000, // 2 SOL
        })
      );

      const blockhash = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash.blockhash;

      transaction.sign(fromAccount);

      const signature = await connection.sendRawTransaction(
        transaction.serialize()
      );

      console.log(`Transaction sent: ${signature}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <label>Private Key (comma separated integer array):</label>
        <input
          type="text"
          value={privateKeyArray}
          onChange={(e) => setPrivateKeyArray(e.target.value)}
        />
      </div>
      <div>
        <label>To Public Key:</label>
        <input
          type="text"
          value={toPublicKeyString}
          onChange={(e) => setToPublicKeyString(e.target.value)}
        />
      </div>
      <button onClick={handleTransfer}>Transfer</button>
    </div>
  );
}

export default App;
