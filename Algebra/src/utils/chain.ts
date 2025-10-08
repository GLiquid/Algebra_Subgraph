/* eslint-disable prefer-const */
import { BigDecimal} from '@graphprotocol/graph-ts'

// Addresses for analytics subgraph 
export const FACTORY_ADDRESS = '0x10253594A832f967994b44f33411940533302ACb'
export const NONFUNGIBLE_POSITION_MANAGER_ADDRESS = '0x69D57B9D705eaD73a5d2f2476C30c55bD755cc2F'

export const REFERENCE_TOKEN = '0x5555555555555555555555555555555555555555' // Wrapped Native Token
export const STABLE_TOKEN_POOL = '0xd391259888fe4599e8011eea5e27b93a9dc74920' // USDC/WETH pool

// Minimum reference token locked in pool for pricing calculations
export const MINIMUM_NATIVE_LOCKED = BigDecimal.fromString('0')

// Token lists for tracking volume and liquidity
export const WHITELIST_TOKENS: string[] = [
  '0x5555555555555555555555555555555555555555', // WMATIC
  '0xb88339CB7199b77E23DB6E890353E22632Ba630f', // USDC
  '0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb', // USDT 
  '0x49a390a3dfd2d01389f799965f3af5961f87d228'
]

// Stable coins for USD pricing (tokens with stable $1 value)
export const STABLE_COINS: string[] = [
  '0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb', // USDT
  '0xb88339CB7199b77E23DB6E890353E22632Ba630f' // USDC
]