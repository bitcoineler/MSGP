# MSGP
Bitcoin Messaging Protocol

## Specification
|     BRFC     |    title     | authors         | version |
| :----------: | :----------: | :-------------: | :-----: |
| 8f90ea3dd551 | MSGP         | bitcoineler/SH  |   1.0.0 |

## Overview
A simple messaging protocol to send messages to bitcoin users (unicast | multicast | broadcast).
The protocol allows to establish a connection via Bitcoin. The connection can then be made via Bitcoin or P2P.

## Protocol
Prefix: `0x6d736770`  (MSGP)

Type: `0x00000001` | `0x00000002`

Channel-ID: `e481259cdfa4ed647fdc446ffc8f848993543092bf46570fb984f56d7d1f4021` (SHA256(pubkey))

Data: `[senderPubkey][senderSig][sequenceNumber][protocolData]`

### Example
`6d7367700000000121401f7d6df584b90f5746bf9230549389848ffc6f44dc7f64eda4df9c2581e442494531023b7c441578c792d10f4b55ae1b509073a78cdf620b2d77a35e0ae4fa167708e91cb683a65cc03aaa315f9e8020c161e8e90f2e572db1ad3e534139ac667ec1faf76678662c15551e0b4d273e0f9ea2e037f3a0b6506bec746dc12e01b71ac9f4dc66888716667fe9c92c7ba43e71e93586a435dcae2c01e1d135ffa0794f69fbcf2adf983e6adaf240d5fb490057ce3a8f204fceaabe62c49740b8755dbc47b3dbbc21890c7e015135b6c77208d1f58556f1bfabeafc5f11d8f7d15440d056881be2ac1f78ccd1877b4e326a3a5214226f3f903d69bc136425ccfd17e32be7bd`

* `6d736770` ==> Prefix (MSGP)
* `00000001` ==> Type
* `21401f7d6df584b90f5746bf9230549389848ffc6f44dc7f64eda4df9c2581e` ==> Channel-Id
* `442494531023b7c441578c792d10f4b55ae1b509073a78cdf620b2d77a35e0ae4fa167708e91cb683a65cc03aaa315f9e8020c161e8e90f2e572db1ad3e534139ac667ec1faf76678662c15551e0b4d273e0f9ea2e037f3a0b6506bec746dc12e01b71ac9f4dc66888716667fe9c92c7ba43e71e93586a435dcae2c01e1d135ffa0794f69fbcf2adf983e6adaf240d5fb490057ce3a8f204fceaabe62c49740b8755dbc47b3dbbc21890c7e015135b6c77208d1f58556f1bfabeafc5f11d8f7d15440d056881be2ac1f78ccd1877b4e326a3a5214226f3f903d69bc136425ccfd17e32be7bd` ==> Data

## Write to Bitcoin
There are two ways of writing into bitcoin, using `OP_RETURN` or `OP_PUSHDATA`

## Read from Bitcoin
You can receive & read messages by filtering the blockchain for MSGP transactions or subscribe to a filter service.

### Filter
https://?????/msgp
