"use client";
import React from 'react'
import '@rainbow-me/rainbowkit/styles.css';
import {
    connectorsForWallets,
    darkTheme,
    getDefaultWallets,
    RainbowKitProvider,
    AvatarComponent,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig,  WagmiConfig } from 'wagmi';
import {
    bscTestnet,
    bsc,
    mainnet
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { injectedWallet,trustWallet, metaMaskWallet, okxWallet, rainbowWallet, tokenPocketWallet, walletConnectWallet, imTokenWallet } from '@rainbow-me/rainbowkit/wallets';
import { alchemyId } from '@/lib/config';
import USDTImg from "@images/icon/usdt_02.png"
import Image from "next/image"


const { chains, publicClient } = configureChains(
    [bsc],
    [
        publicProvider()
    ]
);
const demoAppInfo = {
    appName: 'bsc-420',
};
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_KEY as string;
const wallets = [
    injectedWallet({ chains }),
    trustWallet({projectId,chains}),
    imTokenWallet({ projectId, chains }),
    rainbowWallet({ projectId, chains }),
    metaMaskWallet({ projectId, chains }),
    walletConnectWallet({ projectId, chains }),
    tokenPocketWallet({ projectId, chains }),
    okxWallet({ projectId, chains }),
]

const connectors = connectorsForWallets([
    {
        groupName: 'Popular',
        wallets,
    },
])
const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
})

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
    return(
        <Image
            src={USDTImg}
            width={size}
            height={size}
            alt=''
            className='rounded-full'
        />
    )
}

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider avatar={CustomAvatar}  theme={darkTheme({
                ...darkTheme.accentColors.blue,
            })} chains={chains} appInfo={demoAppInfo} initialChain={bsc}>
                {mounted && children}
            </RainbowKitProvider>
        </WagmiConfig>
    );
}
