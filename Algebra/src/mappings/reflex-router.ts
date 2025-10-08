import { ReflexMevReward, Token, Bundle } from '../types/schema'
import { SplitExecuted } from '../types/ReflexRouter/ReflexRouter'
import { loadTransaction, convertTokenToDecimal } from '../utils'
import { addressArrayToStrings } from '../utils'
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

export function handleSplitExecuted(event: SplitExecuted): void {
  let gliquidConfigId = '0x0e6ab589f26633ac764b8c677e0ccfa63d9d9b05cac179b44390028736c39764'

  if (event.params.configId.toString().toLowerCase() !== gliquidConfigId) {
    return
  }

  let mevReward = new ReflexMevReward(event.transaction.hash)
  let bundle = Bundle.load('1')!
  let transaction = loadTransaction(event)
  let token = Token.load(event.params.token.toString())
  let decimals = token ? token.decimals : BigInt.fromI32(18)
  let derivedMatic = token ? token.derivedMatic : BigDecimal.fromString('1')

  let amountUSD = convertTokenToDecimal(event.params.totalAmount, decimals)
    .times(derivedMatic)
    .times(bundle.maticPriceUSD)

  let otherAmountsUSD: BigDecimal[] = []

  for (let i = 0; i < event.params.amounts.length; i++) {
    otherAmountsUSD.push(
      convertTokenToDecimal(event.params.amounts[i], decimals)
        .times(derivedMatic)
        .times(bundle.maticPriceUSD)
    )
  }

  let traderShareUSD = convertTokenToDecimal(event.params.variedAmount, decimals)
    .times(derivedMatic)
    .times(bundle.maticPriceUSD)

  mevReward.totalAmount = event.params.totalAmount
  mevReward.token = event.params.token.toString()
  mevReward.transaction = transaction.id
  mevReward.traderShare = event.params.variedAmount
  mevReward.recipientTrader = event.params.variedRecipient.toString()
  mevReward.otherRecipients = addressArrayToStrings(event.params.recipients)
  mevReward.otherAmounts = event.params.amounts
  mevReward.totalAmountUSD = amountUSD
  mevReward.otherAmountsUSD = otherAmountsUSD
  mevReward.traderShareUSD = traderShareUSD
  mevReward.save()
}
