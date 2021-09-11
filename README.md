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
`6d736770` `<type>` `<channel-id>` `<data>`

### Fields
| field                   | size    | function                                                |
| ----------------------- | -------- | ------------------------------------------------------- |
| `prefix`                  | 4 Bytes   | protocol prefix `0x6d736770`                                       |
| `type`                  | 4 Bytes   | message type                                        |
| `channel-ID`             | 32 Bytes  | channel identifier   |
| `data`               | n Bytes   | protocoldata + encapsulated protocols         |

### Prefix
Prefix (4Bytes): `0x6d736770`  (ASCII:'MSGP')

### Channel-ID
A 42Byte Channel identifier e.g SHA256-Hash(pubkey) or a broadcast address

### Data
further protocol data + encapsulated protocols. Encrypted or unencrypted (message types)

### Types
Type is a 4 Byte field.

|     type     |    description     |
| :----------: | :----------------: |
| 0x00000001   | MSGP unicast/multicast v1  (for a single receiver or group)  |
| 0x00000002   | MSGP broadcast v1 |

#### Type 0x00000001 Message
Unicast/Multicast encrypted

Type (4Bytes): `0x00000001`

Channel-ID (32Bytes): `e481259cdfa4ed647fdc446ffc8f848993543092bf46570fb984f56d7d1f4021`

Data: `Encrypted(SenderPubkey][senderSig][sequenceNumber][protocolData])`

#### Type 0x00000002 Message
Broadcast unencrypted

Type (4Bytes): `0x00000002`

Channel-ID (32Bytes): `ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`

Data: `[senderPubkey][senderSig][sequenceNumber][protocolData]`

### Example
`6d736770` `00000001` `e481259cdfa4ed647fdc446ffc8f848993543092bf46570fb984f56d7d1f4021` `42494531023b7c441578c792d10f4b55ae1b509073a78cdf620b2d77a35e0ae4fa167708e91cb683a65cc03aaa315f9e8020c161e8e90f2e572db1ad3e534139ac667ec1faf76678662c15551e0b4d273e0f9ea2e037f3a0b6506bec746dc12e01b71ac9f4dc66888716667fe9c92c7ba43e71e93586a435dcae2c01e1d135ffa0794f69fbcf2adf983e6adaf240d5fb490057ce3a8f204fceaabe62c49740b8755dbc47b3dbbc21890c7e015135b6c77208d1f58556f1bfabeafc5f11d8f7d15440d056881be2ac1f78ccd1877b4e326a3a5214226f3f903d69bc136425ccfd17e32be7bd`

* Prefix (MSGP): `6d736770`
* Type: `00000001`
* Channel-ID: `e481259cdfa4ed647fdc446ffc8f848993543092bf46570fb984f56d7d1f4021`
* Data: `42494531023b7c441578c792d10f4b55ae1b509073a78cdf620b2d77a35e0ae4fa167708e91cb683a65cc03aaa315f9e8020c161e8e90f2e572db1ad3e534139ac667ec1faf76678662c15551e0b4d273e0f9ea2e037f3a0b6506bec746dc12e01b71ac9f4dc66888716667fe9c92c7ba43e71e93586a435dcae2c01e1d135ffa0794f69fbcf2adf983e6adaf240d5fb490057ce3a8f204fceaabe62c49740b8755dbc47b3dbbc21890c7e015135b6c77208d1f58556f1bfabeafc5f11d8f7d15440d056881be2ac1f78ccd1877b4e326a3a5214226f3f903d69bc136425ccfd17e32be7bd`

## Write to Bitcoin
There are two ways of writing into bitcoin, using `OP_RETURN` or `OP_PUSHDATA`

## Read from Bitcoin
You can receive & read messages by filtering the blockchain for MSGP transactions or subscribe to a filter service.

### Filter
https://?????/msgp
