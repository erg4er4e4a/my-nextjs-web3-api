// pages/api/wagmi.js
import { cookieStorage, createStorage } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, arbitrum } from '@reown/appkit/networks';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error('Project ID is not defined');
}

export const networks = [mainnet, arbitrum];

// 設置 Wagmi 適配器
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
});

export const config = wagmiAdapter.wagmiConfig;

// 處理 API 請求
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 返回 Wagmi 配置
    res.status(200).json(config);
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
