// 1 Ether = 10^18 Wei
const WEI_PER_ETHER = 1e18

// 將 Wei 轉換為 Ether
export function weiToEther(wei) {
  return (wei / WEI_PER_ETHER).toString()
}
