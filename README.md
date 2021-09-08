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



## Write to Bitcoin
There are two ways of writing into bitcoin, using `OP_RETURN` or `OP_PUSHDATA`

## Read from Bitcoin
You can receive & read messages by filtering the blockchain for MSGP transactions or subscribe to a filter service.

### Filter
https://?????/msgp
