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

Type: `0x00000001`

Channel-ID: `e481259cdfa4ed647fdc446ffc8f848993543092bf46570fb984f56d7d1f4021` (SHA256(pubkey))

Data: `[senderPubkey][senderSig][sequenceNumber][protocolData]`

## Write to Bitcoin
There are two ways of writing into bitcoin, using `OP_RETURN` or `OP_PUSHDATA`

## Read from Bitcoin
You can receive & read messages by filtering the blockchain for MSGP transactions or subscribe to a filter service.

### Filter
https://?????/msgp
