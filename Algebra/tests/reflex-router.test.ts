import { assert, describe, test, clearStore, beforeEach, afterEach } from 'matchstick-as/assembly/index'
import { Address, BigInt, BigDecimal, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { handleSplitExecuted } from '../src/mappings/reflex-router'
import { SplitExecuted } from '../src/types/ReflexRouter/ReflexRouter'
import { ReflexMevReward, Token, Bundle } from '../src/types/schema'
import { createSplitExecutedEvent } from './reflex-router-utils'

describe('ReflexRouter - handleSplitExecuted', () => {
  beforeEach(() => {
    // Setup required entities
    let bundle = new Bundle('1')
    bundle.maticPriceUSD = BigDecimal.fromString('1') // 1 USD
    bundle.save()

    // Setup token entity
    let token = new Token('0x5555555555555555555555555555555555555555')
    token.decimals = BigInt.fromI32(18)
    token.derivedMatic = BigDecimal.fromString('1') // 1:1 with MATIC
    token.symbol = 'TEST'
    token.name = 'Test Token'
    token.totalSupply = BigInt.zero()
    token.volume = BigDecimal.zero()
    token.volumeUSD = BigDecimal.zero()
    token.untrackedVolumeUSD = BigDecimal.zero()
    token.feesUSD = BigDecimal.zero()
    token.txCount = BigInt.zero()
    token.poolCount = BigInt.zero()
    token.totalValueLocked = BigDecimal.zero()
    token.totalValueLockedUSD = BigDecimal.zero()
    token.save()
  })

  afterEach(() => {
    clearStore()
  })

  test('Should create ReflexMevReward entity with correct data', () => {
    // Event parameters from the example
    let configId = Bytes.fromHexString('0x0e6ab589f26633ac764b8c677e0ccfa63d9d9b05cac179b44390028736c39764')
    let token = Address.fromString('0x5555555555555555555555555555555555555555')
    let totalAmount = BigInt.fromString('617539633678810906')
    let recipients = [
      Address.fromString('0x4069c99e708b9395c7A519f97F7c09644f1B471C'),
      Address.fromString('0xaF1918967644d315df2C2F324EE9C439a9e03098'),
      Address.fromString('0xb4ffb33F6aC3FC7E75E26dc1802aA86a5D9857BD')
    ]
    let amounts = [
      BigInt.fromString('185261890103643271'),
      BigInt.fromString('247015853471524362'),
      BigInt.fromString('123507926735762181')
    ]
    let variedRecipient = Address.fromString('0x87e4393fB6d07E728Bc3831233359DF740907F9e')
    let variedAmount = BigInt.fromString('61753963367881092')

    // Create event
    let event = createSplitExecutedEvent(
      configId,
      token,
      totalAmount,
      recipients,
      amounts,
      variedRecipient,
      variedAmount
    )

    // Handle event
    handleSplitExecuted(event)

    // Assert ReflexMevReward entity was created
    let mevRewardId = event.transaction.hash.toHexString()
    assert.fieldEquals('ReflexMevReward', mevRewardId, 'token', '0x5555555555555555555555555555555555555555')
    assert.fieldEquals('ReflexMevReward', mevRewardId, 'totalAmount', '617539633678810906')
    assert.fieldEquals('ReflexMevReward', mevRewardId, 'recipientTrader', '0x87e4393fb6d07e728bc3831233359df740907f9e')
    assert.fieldEquals('ReflexMevReward', mevRewardId, 'traderShare', '61753963367881092')

    // Verify transaction was created
    assert.fieldEquals('ReflexMevReward', mevRewardId, 'transaction', mevRewardId)
    assert.fieldEquals('Transaction', mevRewardId, 'id', mevRewardId)

    // Verify other recipients array
    assert.fieldEquals(
      'ReflexMevReward',
      mevRewardId,
      'otherRecipients',
      '[0x4069c99e708b9395c7a519f97f7c09644f1b471c, 0xaf1918967644d315df2c2f324ee9c439a9e03098, 0xb4ffb33f6ac3fc7e75e26dc1802aa86a5d9857bd]'
    )

    // Verify other amounts array
    assert.fieldEquals(
      'ReflexMevReward',
      mevRewardId,
      'otherAmounts',
      '[185261890103643271, 247015853471524362, 123507926735762181]'
    )

    // Verify USD values are calculated
    assert.entityCount('ReflexMevReward', 1)

    let mevReward = ReflexMevReward.load(mevRewardId)
    assert.assertNotNull(mevReward)

    if (mevReward) {
      assert.assertTrue(mevReward.totalAmountUSD.gt(BigDecimal.zero()))
      assert.assertTrue(mevReward.traderShareUSD.gt(BigDecimal.zero()))
      assert.assertTrue(mevReward.otherAmountsUSD.length == 3)
    }
  })

  test('Should not create entity for non-matching configId', () => {
    // Different configId that doesn't match the gliquid config
    let configId = Bytes.fromHexString('0x1111111111111111111111111111111111111111111111111111111111111111')
    let token = Address.fromString('0x5555555555555555555555555555555555555555')
    let totalAmount = BigInt.fromString('617539633678810906')
    let recipients = [Address.fromString('0x4069c99e708b9395c7A519f97F7c09644f1B471C')]
    let amounts = [BigInt.fromString('185261890103643271')]
    let variedRecipient = Address.fromString('0x87e4393fB6d07E728Bc3831233359DF740907F9e')
    let variedAmount = BigInt.fromString('61753963367881092')

    let event = createSplitExecutedEvent(
      configId,
      token,
      totalAmount,
      recipients,
      amounts,
      variedRecipient,
      variedAmount
    )

    handleSplitExecuted(event)

    // Should not create any ReflexMevReward entities
    assert.entityCount('ReflexMevReward', 0)
  })

  test('Should handle missing token with default decimals', () => {
    // Use a token address that doesn't exist
    let configId = Bytes.fromHexString('0x0e6ab589f26633ac764b8c677e0ccfa63d9d9b05cac179b44390028736c39764')
    let token = Address.fromString('0x9999999999999999999999999999999999999999') // Non-existent token
    let totalAmount = BigInt.fromString('617539633678810906')
    let recipients = [Address.fromString('0x4069c99e708b9395c7A519f97F7c09644f1B471C')]
    let amounts = [BigInt.fromString('185261890103643271')]
    let variedRecipient = Address.fromString('0x87e4393fB6d07E728Bc3831233359DF740907F9e')
    let variedAmount = BigInt.fromString('61753963367881092')

    let event = createSplitExecutedEvent(
      configId,
      token,
      totalAmount,
      recipients,
      amounts,
      variedRecipient,
      variedAmount
    )

    handleSplitExecuted(event)

    // Should still create entity with default decimals (18)
    assert.entityCount('ReflexMevReward', 1)
    let mevRewardId = event.transaction.hash.toHexString()
    assert.fieldEquals('ReflexMevReward', mevRewardId, 'token', '0x9999999999999999999999999999999999999999')
  })
})
