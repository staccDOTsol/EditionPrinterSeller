// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import { Metaplex, keypairIdentity, logTrace } from '@metaplex-foundation/js'
import {  LAMPORTS_PER_SOL,  Transaction, SystemProgram, SYSVAR_INSTRUCTIONS_PUBKEY } from '@solana/web3.js'
import bs58 from 'bs58'
import { Connection, PublicKey } from '@solana/web3.js';
import { AssetData,
  createCreateInstruction,
  CreateInstructionAccounts,
  CreateInstructionArgs,
  createMintInstruction,
  MintInstructionAccounts,
  MintInstructionArgs,
  createUpdateInstruction,
  createTransferInstruction,
  UpdateInstructionAccounts,
  UpdateInstructionArgs,
  TokenStandard,
  TransferInstructionAccounts,
  TransferInstructionArgs,
  AuthorizationData,
  Payload,
  SignMetadataInstructionAccounts,
  VerifyCollectionInstructionAccounts,
  createVerifyCollectionInstruction,
  createSignMetadataInstruction,
  Metadata,
  DelegateInstructionAccounts,
  DelegateInstructionArgs,
  DelegateArgs,
  createDelegateInstruction,
  RevokeInstructionAccounts,
  RevokeInstructionArgs,
  createRevokeInstruction,
  RevokeArgs,
  LockInstructionAccounts,
  LockInstructionArgs,
  createLockInstruction,
  UnlockInstructionAccounts,
  UnlockInstructionArgs,
  createUnlockInstruction } from '@metaplex-foundation/mpl-token-metadata';
import { Keypair } from '@solana/web3.js';
// @ts-ignore
import { encode } from '@msgpack/msgpack';

export function createPassRuleSet(
  ruleSetName: string,
  owner: PublicKey,
  operation: string,
): Uint8Array {
  const operations = {};
  // @ts-ignore
  operations[operation] = 'Pass';

  const ruleSet = {
    ruleSetName,
    owner: Array.from(owner.toBytes()),
    operations,
  };
  return encode(ruleSet);
}

export function findTokenRecordPda(mint: PublicKey, token: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from('token_record'),
      token.toBuffer(),
    ],
    PROGRAM_ID,
  )[0];
}
export class DigitalAssetManager {
  mint: PublicKey;
  metadata: PublicKey;
  masterEdition: PublicKey;
  token?: PublicKey;

  constructor(mint: PublicKey, metadata: PublicKey, masterEdition: PublicKey) {
    this.mint = mint;
    this.metadata = metadata;
    this.masterEdition = masterEdition;
  }

  emptyAuthorizationData(): AuthorizationData {
    return {
      payload: {
        map: new Map(),
      },
    };
  }

  async getAssetData(connection: Connection): Promise<AssetData> {
    const md = await Metadata.fromAccountAddress(connection, this.metadata);

    return {
      name: md.data.name,
      symbol: md.data.symbol,
      uri: md.data.uri,
      sellerFeeBasisPoints: md.data.sellerFeeBasisPoints,
      creators: md.data.creators,
      primarySaleHappened: md.primarySaleHappened,
      isMutable: md.isMutable,
      // @ts-ignore
      tokenStandard: md.tokenStandard,
      collection: md.collection,
      uses: md.uses,
      collectionDetails: md.collectionDetails,
      ruleSet: md.programmableConfig ? md.programmableConfig.ruleSet : null,
    };
  }
}

import mintsOnSale from '../../data/onsale'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token'

const PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
const amount = 1;
let mintPair = Keypair.generate()
let mint = mintPair.publicKey
let amint = new PublicKey(process.env.NEXT_PUBLIC_NFT!)
const [masterEdition] = PublicKey.findProgramAddressSync(
  [Buffer.from('metadata'), PROGRAM_ID.toBuffer(), amint.toBuffer(), Buffer.from('edition')],
  PROGRAM_ID,
);



// metadata account
  const [address] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      PROGRAM_ID.toBuffer(),
      mint ? mint.toBuffer() : mintPair.publicKey.toBuffer(),
    ],
    PROGRAM_ID,
  );
const  metadata = address;

  // load wallet from env
  const SK = process.env.SK!
  const SKua = bs58.decode(SK)

const keypair = Keypair.fromSecretKey(SKua)

const accounts: CreateInstructionAccounts = {
  metadata,
  masterEdition,
  mint: mint ? mint : mintPair.publicKey,
  authority: keypair.publicKey,
  payer: keypair.publicKey,
  splTokenProgram: TOKEN_PROGRAM_ID,
  sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
  updateAuthority: keypair.publicKey,
};

const args: CreateInstructionArgs = {
  createArgs: {
    __kind: 'V1',
    assetData:  {
      "name": "Studious Staccs",
      "symbol": "STACC",
      "uri": "https://arweave.net/uVtABL4PYv0wVke3LL4DLMkqkSMcQl1qswRZNkJ0a0g",
      "sellerFeeBasisPoints": 138,
      "creators": [
          {
              "address": new PublicKey( "Gf3sbc5Jb62jH7WcTr3WSNGDQLk1w6wcKMZXKK1SC1E6"),
              "verified": true,
              "share": 100
          }
      ],
      "primarySaleHappened": false,
      "isMutable": true,
      "tokenStandard": TokenStandard.ProgrammableNonFungible,
      "collection": null,
      "uses": null,
      "collectionDetails": null,
      "ruleSet": new PublicKey( "5HQGLanQYtBR1QhcYXgW5diZrPS5FfQyfkzYDqD3HjRV" )
  },
    decimals:0,
    printSupply:
     { __kind: 'Limited', fields: [0] },
  },
};

const createIx = createCreateInstruction(accounts, args);

if (!mint) {
  // this test always initializes the mint, we we need to set the
  // account to be writable and a signer
  for (let i = 0; i < createIx.keys.length; i++) {
    if (createIx.keys[i].pubkey.toBase58() === mintPair.publicKey.toBase58()) {
      createIx.keys[i].isSigner = true;
      createIx.keys[i].isWritable = true;
    }
  }
}


const daManager = new DigitalAssetManager(mint, metadata, masterEdition);
type Data = {
  acct?: string
  error?: string
}

const verifyTx = async(connection: Connection, signature: string) => {
  console.log('verifying tx')

  let txResult = null
  let max = 3
  let i = 0
  do {
    txResult = await connection.getTransaction(signature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0
    })
    if (txResult != null) break
  } while (i < max)

  return (txResult)
}

const verifyTill = () => {}

const verifyAccounts = () => {}

const refund = () => {}



export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  console.log("=======event======");
  console.log(req.body)

  if (req.method != 'POST') {
    console.log("Not a post request")
    return  res.status(200).send({ error: 'Not a post request' })
  }

  const paramters = Object.keys(req.body)

  if (!paramters.includes("signature") || !paramters.includes("address") || !paramters.includes("index") || !paramters.includes("receiver")) {
    console.log("Missing paramters");
    return res.status(200).send({ error: 'Missing parameters' })
  }


  const saleItem = mintsOnSale[req.body.index]


  const connection = new Connection(process.env.NEXT_PUBLIC_RPC!)
  const slot = await connection.getSlot()
  
  // // verify the tx
  const txResult = await verifyTx(connection, req.body.signature)
  if (!txResult) return res.status(200).send({ error: 'couldnt confirm tx' })

  console.log('loaded tx')

  // check against slot
  console.log('checking slot')

  if (slot - 100 > txResult.slot) res.status(200).send({ error: 'old tx' })
  console.log('slot ok')

  // console.log('checking paid amount')

  // const t1 =
  // txResult!.meta?.postTokenBalances?.at(1)?.uiTokenAmount.uiAmount || txResult!.meta?.postBalances?.at(1)
    
  // const t0 =
  // txResult!.meta?.preTokenBalances?.at(1)?.uiTokenAmount.uiAmount || txResult!.meta?.preBalances?.at(1)
    
  // console.log(t0, t1)

  // console.log('t0: ', t0)
  // console.log('t1: ', t1)
  // console.log('diff: ', Math.abs(Number(Number(t1! - t0!).toPrecision(2))))
  // console.log(Math.abs(Number(mintsOnSale[req.body.index].price * LAMPORTS_PER_SOL)))

  // if (Math.abs(Number(Number(t1! - t0!).toPrecision(2))) != Math.abs(Number(mintsOnSale[req.body.index].price * LAMPORTS_PER_SOL)))
  //   return res.status(200).send({ error: 'bad till' })

  // console.log('correct payment')
  console.log('checking keys')

  // const acctKeys = txResult?.transaction.message.getAccountKeys()
  // const sender = acctKeys?.get(0)?.toBase58()
  // const reciever = acctKeys?.get(1)

  //if (sender != req.body.address && (reciever?.toBase58() != mintsOnSale[req.body.index].bank || reciever?.toBase58() != mintsOnSale[req.body.index].bankAta))
    //return res.status(200).send({ error: 'bad accts' })

  console.log('accounts are good')

  const metaplex = new Metaplex(connection).use(keypairIdentity(keypair))

  // load the master edition to
  console.log('loading the nft')

  const nft = await metaplex
    .nfts()
    .findByMint({ mintAddress: new PublicKey(saleItem.mint) })
    
  console.log('we found the nft')
  console.log(nft.name)

  const newOwner = new PublicKey(req.body.address)
  console.log('printing')
  try {
   // mint instrution will initialize a ATA account
      const [tokenPda] = PublicKey.findProgramAddressSync(
        [keypair.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );
     const token = tokenPda;
  const tokenOwner = keypair.publicKey 
  const tokenRecord = findTokenRecordPda(mint, token);

  const mintAcccounts: MintInstructionAccounts = {
    token,
    tokenOwner,
    metadata,
    masterEdition,
    tokenRecord,
    mint: mint,
    payer: keypair.publicKey,
    authority: keypair.publicKey,
    sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
    splAtaProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    splTokenProgram: TOKEN_PROGRAM_ID,
    authorizationRules: new PublicKey("5HQGLanQYtBR1QhcYXgW5diZrPS5FfQyfkzYDqD3HjRV"),
    authorizationRulesProgram: new PublicKey("auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg"),
  };

  const payload: Payload = {
    map: new Map(),
  };

 const   authorizationData = {
      payload,
    };
  const mintArgs: MintInstructionArgs = {
    mintArgs: {
      __kind: 'V1',
      amount,
      authorizationData,
    },
  };

  const mintIx = createMintInstruction(mintAcccounts, mintArgs);

  // creates the transaction

  const tx = new Transaction().add(createIx).add(mintIx);

  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash


 tx.feePayer = keypair.publicKey

 try {
   const signature = await connection.sendTransaction(tx, [keypair, mintPair])
   const latestBlockHash = await connection.getLatestBlockhash()
   await connection.confirmTransaction({
     blockhash: latestBlockHash.blockhash,
     lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
     signature
   })
  console.log('printed!')
  return res.status(200).send({ acct: token.toBase58() })
  }catch(e:any){
    console.log(e)
    // metaplex print failed
    // process refunds here
    // possible reasons: 
    // at NFT Supply limit
    // ...?
    res.status(200).send({ error: "Printing failed, please contact support!" })
  //   const tx = new Transaction()
  //   const source = mintsOnSale[req.body.index].bankAta
  //   const receiver = req.body.receiver
    
  //   // return funds to user
  //   if ( mintsOnSale[req.body.index].mint != NATIVE_MINT.toBase58()) {
  //     const ixSendMoney = createTransferInstruction(
  //       new PublicKey(source),
  //       new PublicKey(receiver),
  //       keypair.publicKey,
  //       mintsOnSale[req.body.index].price * LAMPORTS_PER_SOL
  //     )
  //     tx.add(ixSendMoney)
  //   } else {
  //     tx.add(
  //       SystemProgram.transfer({
  //         fromPubkey: keypair.publicKey,
  //         toPubkey: new PublicKey(receiver),
  //         lamports: mintsOnSale[req.body.index].price * LAMPORTS_PER_SOL
  //       })
  //     )
  //   }
  //   // get recent blockhash
  //   tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

  //   // set whos paying for the tx
  //   tx.feePayer = keypair.publicKey

  //   try {
  //     const signature = await connection.sendTransaction(tx, [keypair])
  //     const latestBlockHash = await connection.getLatestBlockhash()
  //     await connection.confirmTransaction({
  //       blockhash: latestBlockHash.blockhash,
  //       lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  //       signature
  //     })
  //   }catch{
  //     console.log('couldnt refund user')
  //     console.log(req.body);
  //   }
  }

  } catch (err){
    console.log(err)
  }}
