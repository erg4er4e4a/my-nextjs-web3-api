// pages/api/wagmi.js
import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'

// 確保你在 Vercel 上設置了 NEXT_PUBLIC_PROJECT_ID
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [mainnet, arbitrum]

// 設置 Wagmi Adapter（配置）
const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
})

export const config = wagmiAdapter.wagmiConfig

// API 路由處理：與智能合約進行交互
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // 與智能合約交互，這裡以讀取 totalSupply 為例
      const result = await wagmiAdapter.getSmartContractData('totalSupply')

      // 返回合約數據
      res.status(200).json(result)
    } catch (error) {
      // 錯誤處理
      console.error(error)
      res.status(500).json({ error: 'Smart contract interaction failed', message: error.message })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' }) // 不支持其他 HTTP 方法
  }
}
