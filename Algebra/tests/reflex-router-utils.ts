import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { newMockEvent } from 'matchstick-as'
import { SplitExecuted } from '../src/types/ReflexRouter/ReflexRouter'

export function createSplitExecutedEvent(
  configId: Bytes,
  token: Address,
  totalAmount: BigInt,
  recipients: Address[],
  amounts: BigInt[],
  variedRecipient: Address,
  variedAmount: BigInt
): SplitExecuted {
  let event = changetype<SplitExecuted>(newMockEvent())

  event.parameters = new Array()

  // configId (indexed)
  let configIdParam = new ethereum.EventParam('configId', ethereum.Value.fromFixedBytes(configId))
  event.parameters.push(configIdParam)

  // token (indexed)
  let tokenParam = new ethereum.EventParam('token', ethereum.Value.fromAddress(token))
  event.parameters.push(tokenParam)

  // totalAmount
  let totalAmountParam = new ethereum.EventParam('totalAmount', ethereum.Value.fromUnsignedBigInt(totalAmount))
  event.parameters.push(totalAmountParam)

  // recipients array
  let recipientsParam = new ethereum.EventParam('recipients', ethereum.Value.fromAddressArray(recipients))
  event.parameters.push(recipientsParam)

  // amounts array
  let amountsParam = new ethereum.EventParam('amounts', ethereum.Value.fromUnsignedBigIntArray(amounts))
  event.parameters.push(amountsParam)

  // variedRecipient
  let variedRecipientParam = new ethereum.EventParam('variedRecipient', ethereum.Value.fromAddress(variedRecipient))
  event.parameters.push(variedRecipientParam)

  // variedAmount
  let variedAmountParam = new ethereum.EventParam('variedAmount', ethereum.Value.fromUnsignedBigInt(variedAmount))
  event.parameters.push(variedAmountParam)

  return event
}
