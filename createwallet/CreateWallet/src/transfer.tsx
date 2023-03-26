// Import Solana web3 functinalities
export const transfer = async () => {
    const {
        Connection,
        PublicKey,
        clusterApiUrl,
        Keypair,
        LAMPORTS_PER_SOL,
        Transaction,
        SystemProgram,
        sendAndConfirmRawTransaction,
        sendAndConfirmTransaction
    } = require("@solana/web3.js");
    
    
    // Making a keypair and getting the private key
    const newPair = Keypair.generate();
    console.log(newPair);
    
    // paste your secret that is logged here
    const DEMO_FROM_SECRET_KEY = new Uint8Array(
      // paste your secret key array here
        [
            228,  54, 199, 238,   9, 106, 178,  50, 247,  94, 255,
          179, 166,   9, 162,  90,  57,  35,  56,   3, 212, 175,
          165, 168,  92,  59, 166, 137, 166, 185, 254,  68,   8,
          170, 131,  59,  91, 211, 125,  49,  36,  19, 253,   8,
          255, 213, 137,  82, 220, 201, 157,  10,  10,  12, 230,
           85, 214,  13, 235, 133,  86,  31,  12,  16
          ]            
    );
    
    const transferSol = async() => {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    
        // Get Keypair from Secret Key
        var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);
    
        // Other things to try: 
        // 1) Form array from userSecretKey
        // const from = Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
        // 2) Make a new Keypair (starts with 0 SOL)
        // const from = Keypair.generate();
    
        // Generate another Keypair (account we'll be sending to)
        const to = "HXt3F8NEbDaMsFKk9Sn5PPtzf6v71w2FqGMKkag63i9p";
    
        // Aidrop 2 SOL to Sender wallet
        console.log("Airdopping some SOL to Sender wallet!");
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(from.publicKey),
            2 * LAMPORTS_PER_SOL
        );
    
        // Latest blockhash (unique identifer of the block) of the cluster
        let latestBlockHash = await connection.getLatestBlockhash();
    
        // Confirm transaction using the last valid block height (refers to its time)
        // to check for transaction expiration
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: fromAirDropSignature
        });
    
        console.log("Airdrop completed for the Sender account");
    
        // Send money from "from" wallet and into "to" wallet
        var transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: LAMPORTS_PER_SOL / 100
            })
        );
    
        // Sign transaction
        var signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );
        console.log('Signature is', signature);
    }
    
    transferSol();
    
    
    }
    
    transfer();
    