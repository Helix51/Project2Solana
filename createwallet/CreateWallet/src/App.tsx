import { useState } from 'react';
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

const App = () => {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const createWallet = async () => {
    const newPair = new Keypair();

    const publicKey = new PublicKey(newPair.publicKey).toString();
    const privateKey = newPair.secretKey.toString();

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    console.log('Public Key of the generated keypair', publicKey);
    console.log('Private Key of the generated keypair', privateKey);

    const airDropSol = async () => {
      try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const myWallet = await Keypair.fromSecretKey(new Uint8Array(privateKey.split(',').map(Number)));

        console.log('Airdropping some SOL to my wallet!');
        const fromAirDropSignature = await connection.requestAirdrop(
          new PublicKey(myWallet.publicKey),
          2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
      } catch (err) {
        console.log(err);
      }
    };

    const subFunction = async () => {
      await airDropSol();
      setPublicKey(publicKey);
      setPrivateKey(privateKey);
    };

    subFunction();
  };

  return (
    <div>
      <button onClick={createWallet}>Create Wallet</button>
      {publicKey && <p>Generated Public Key: {publicKey}</p>}
      {privateKey && <p>Generated Private Key: {privateKey}</p>}
    </div>
  );
};

export default App;
