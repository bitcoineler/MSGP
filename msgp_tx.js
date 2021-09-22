const fetch = require('node-fetch');
const bsv = require ('bsv')

const RECEIVER_PRIVATEKEY = new bsv.PrivKey().fromWif('**************!!!!!!!!!!!!********************')
const SENDER_PRIVATEKEY = new bsv.PrivKey().fromWif('**************!!!!!!!!!!!!********************')
const DUST = 547 //satoshis
bsv.Constants.Mainnet.TxBuilder.dust = DUST

async function getUtxoWoc(address){
  const apiRequest = "https://api.whatsonchain.com/v1/bsv/main/address/"+address+"/unspent"

  const response = await fetch(apiRequest, { method: 'GET', headers: {} });
  const json = await response.json();
  let utxos = []

  for (var i = 0; i < json.length; i++) {
    const tx = json[i]
    const apiRequest2 = `https://api.whatsonchain.com/v1/bsv/main/tx/hash/${tx.tx_hash}`

    const response2 = await fetch(apiRequest2, { method: 'GET', headers: {} });
    const json2 = await response2.json();

    for (var a = 0; a < json2.vout.length; a++) {
      const output = json2.vout[a]
      if(output.scriptPubKey.type == 'pubkeyhash'){
        utxos.push({
          "txId": json2.txid,
          "satoshis" : output.value*100000000,
          "outputIndex" : a,
          "address" : output.scriptPubKey.addresses[0],
          "script" : output.scriptPubKey,
        })
      }
    }
  }
  return utxos
}

async function generateTx(channelId,senderKeyPair,receiverPubkey,payload,sigHashFlag='41',opreturn=true){
  const address = new bsv.Address().fromPubKey(senderKeyPair.pubKey).toString()
  const PROTOCOL_PREFIX = '6d736770' //hex
  const PROTOCOL_TYPE = '00000001' //hex
  const sequence = parseInt((Date.now()/1000).toFixed(0)).toString(16) // unixtimestamp/seconds

  const utxos = await getUtxoWoc( address )
  const builder = new bsv.TxBuilder()

  for (var i = 0; i < utxos.length; i++) {
    const utxo = utxos[i]

    const fundTxOut = new bsv.TxOut().fromProperties(
      bsv.Bn().fromNumber(utxo.satoshis),
      bsv.Address.fromString( address ).toTxOutScript()
    )

    const fundTxHashBuf = Buffer.from(utxo.txId, 'hex').reverse()
    builder.inputFromPubKeyHash(fundTxHashBuf, utxo.outputIndex, fundTxOut)
  }

  let txInBuf = []
  if(sigHashFlag='41'){
    builder.txIns.forEach((txIn)=>{
      txInBuf.push(txIn.toBuffer())
    })
  } else {
    // others
    console.log("wrong sighashflag");
  }

  const txInsBuf = Buffer.concat(txInBuf);
  const payloadBuf = Buffer.from(payload,'hex')
  const preimageBuf = Buffer.concat([txInsBuf,payloadBuf])
  const msgpHash = bsv.Hash.sha256(preimageBuf)
  const senderSig = bsv.Ecdsa.sign(msgpHash, senderKeyPair)

  console.log(`Signature: ${senderSig.toString('hex')} SigCheck: ${bsv.Ecdsa.verify(msgpHash, senderSig, senderKeyPair.pubKey)}`)

  const dataBuf = Buffer.from([senderKeyPair.pubKey,sigHashFlag,senderSig,sequence,payload].join(''),'hex')

  const encDataBuf = bsv.Ecies.electrumEncrypt(dataBuf,receiverPubkey,null)
  const decDataBuf = bsv.Ecies.electrumDecrypt(encDataBuf,RECEIVER_PRIVATEKEY)
  console.log("\nENC:",encDataBuf.toString('hex'),encDataBuf.length);
  console.log("DEC:",decDataBuf.toString('hex'),decDataBuf.length);

  const protodata = [PROTOCOL_PREFIX,PROTOCOL_TYPE,channelId,dataBuf.toString('hex')].join('')

  // Add output to address
  let amount
  let script
  let outScript

  if(opreturn){
    script = new bsv.Script().fromAsmString(`OP_FALSE OP_RETURN ${protodata}`)
    amount = 0
  } else {
    outScript = bsv.Address.fromString( address ).toTxOutScript().toAsmString()
    script = new bsv.Script().fromAsmString(`${protodata} OP_DROP ${outScript}`)
    amount = DUST
  }
  builder.outputToScript(bsv.Bn().fromNumber(amount), script)

  // Set change address
  builder.setChangeAddress(bsv.Address.fromString( address ))
  builder.build()
  builder.signWithKeyPairs([senderKeyPair])
  return builder.tx
}

async function main() {
  const receiverPubkey = new bsv.PubKey().fromString('02dcec5ff54316e25c27ec754c8750e163834a4d4aee6f20c57185f40606fa4057')
  const channelId = bsv.Hash.sha256(receiverPubkey.toBuffer()).toString('hex')
  const senderKeyPair = new bsv.KeyPair().fromPrivKey(SENDER_PRIVATEKEY)
  const payload = 'aaffaaffaaffaaff' //hex

  const tx = await generateTx(channelId,senderKeyPair,receiverPubkey,payload,'41',true)
  console.log(`\nTXHex: ${tx.toHex()}`)
}

(async () => {
  try {
    main();
  } catch (e) {
    console.log(e);
  }
})();
