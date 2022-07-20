import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import {
    RainbowKitProvider,
    getDefaultWallets,
    Theme,
    darkTheme,
    Chain,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const additionalChains: Chain[] = [
    {
        id: 1666700000,
        name: 'Harmony testnet Shard 0',
        rpcUrls: { default: 'https://api.s0.b.hmny.io' },
        network: 'harmony',
        iconUrl: 'assets/harmony-one-logo.svg',
        iconBackground: '#fff',
        nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 as 18 }, // eslint-disable-line
        blockExplorers: {
            default: {
                name: 'Harmony Block Explorer',
                url: 'https://explorer.harmony.one',
            },
        },
        testnet: true,
    },
    {
        id: 1666600000,
        name: 'Harmony mainnet Shard 0',
        network: 'harmony testnet',
        iconUrl: 'assets/harmony-one-logo.svg',
        rpcUrls: { default: 'https://api.harmony.one' },
        nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 as 18 }, // eslint-disable-line
        blockExplorers: {
            default: {
                name: 'Harmony Block Explorer',
                url: 'https://explorer.harmony.one',
            },
        },
        testnet: false,
    },
];

const additionalChainIDs = additionalChains.map((c) => c.id);

const { chains, provider, webSocketProvider } = configureChains(
    [
        chain.mainnet,
        chain.polygon,
        chain.optimism,
        chain.arbitrum,
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
            ? [chain.goerli, chain.kovan, chain.rinkeby, chain.ropsten]
            : []),
        ...additionalChains,
    ],
    [
        alchemyProvider({
            // This is Alchemy's default API key.
            // You can get your own at https://dashboard.alchemyapi.io
            alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
        }),
        jsonRpcProvider({
            rpc: (chain) => {
                if (chain.id in additionalChainIDs)
                    return { http: chain.rpcUrls.default };
                else return null;
            },
        }),
        publicProvider(),
    ]
);

const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
});

const DarkTheme = darkTheme();

const myCustomTheme: Theme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        // accentColor: '#000',
    },
    // colors: {
    //     accentColor: '...',
    //     accentColorForeground: '...',
    //     actionButtonBorder: '...',
    //     actionButtonBorderMobile: '...',
    //     actionButtonSecondaryBackground: '...',
    //     closeButton: '...',
    //     closeButtonBackground: '...',
    //     connectButtonBackground: '...',
    //     connectButtonBackgroundError: '...',
    //     connectButtonInnerBackground: '...',
    //     connectButtonText: '...',
    //     connectButtonTextError: '...',
    //     connectionIndicator: '...',
    //     error: '...',
    //     generalBorder: '...',
    //     generalBorderDim: '...',
    //     menuItemBackground: '...',
    //     modalBackdrop: '...',
    //     modalBackground: '...',
    //     modalBorder: '...',
    //     modalText: '...',
    //     modalTextDim: '...',
    //     modalTextSecondary: '...',
    //     profileAction: '...',
    //     profileActionHover: '...',
    //     profileForeground: '...',
    //     selectedOptionBorder: '...',
    //     standby: '...',
    // },
    // fonts: {
    //     body: 'Inter',
    // },
    // radii: {
    //     actionButton: '...',
    //     connectButton: '...',
    //     menuButton: '...',
    //     modal: '...',
    //     modalMobile: '...',
    // },
    // shadows: {
    //     connectButton: '...',
    //     dialog: '...',
    //     profileDetailsAction: '...',
    //     selectedOption: '...',
    //     selectedWallet: '...',
    //     walletLogo: '...',
    // },
};

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains} theme={myCustomTheme}>
                <Component {...pageProps} />;
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default MyApp;
