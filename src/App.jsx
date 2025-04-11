import React from 'react';
import { createConfig, WagmiProvider, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAccount, useConnect, useBalance } from 'wagmi';

// 使用Farcaster SDK提供的provider
const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    {
      id: 'farcaster',
      name: 'Farcaster',
      type: 'injected',
      provider: window.sdk?.wallet?.ethProvider
    }
  ]
});

const queryClient = new QueryClient();

const WalletButton = () => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: balance } = useBalance({
    address: address,
  });

  if (isConnected) {
    return (
      <div className="wallet-info">
        <p>钱包地址: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
        <p>余额: {balance?.formatted} {balance?.symbol}</p>
      </div>
    );
  }

  return (
    <button
      className="connect-button"
      onClick={() => connect({ connector: connectors[0] })}
    >
      连接钱包
    </button>
  );
};

const App = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="app">
          <h1>欢迎使用Farcaster Mini App</h1>
          <p>这是一个简单的示例应用</p>
          <WalletButton />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App; 