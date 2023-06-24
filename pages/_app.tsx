import { ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import { ThemeProvider } from "@mui/material";
import { Config, DAppProvider, MetamaskConnector, CoinbaseWalletConnector, Mainnet } from "@usedapp/core";
import { NEVMChain, RolluxChain, RolluxChainMainnet, TanenbaumChain } from "blockchain/NevmRolluxBridge/config/chainsUseDapp";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from "components/Common/ErrorFallback";
import { provider } from "web3-core";
import { WelcomeDisclaimer } from "components/Common/WelcomeDisclaimer";
import { chakraTheme } from 'components/chakraTheme';

const queryClient = new QueryClient();

const dappConfig: Config = {
  readOnlyChainId: 5700,
  readOnlyUrls: {
    [5700]: 'https://rpc.tanenbaum.io',
    [57000]: 'https://rpc-tanenbaum.rollux.com/',
    [RolluxChainMainnet.chainId]: RolluxChainMainnet.rpcUrl || '',
    [NEVMChain.chainId]: NEVMChain.rpcUrl || '',
  },
  multicallAddresses: {
    [RolluxChainMainnet.chainId]: '0xC8A22F92Dd4A50f56Ab1309ea686A4c08d630180',
    [NEVMChain.chainId]: '0x0c457A8E4bD35eA571956d6bb7443c5C661d7607',
    [5700]: '0x1F359C32b5D8c9678b076eAac411A4d2Eb11E697', // multicall 2 address.
    [57000]: '0x1F359C32b5D8c9678b076eAac411A4d2Eb11E697',

  },
  networks: [RolluxChain, TanenbaumChain, NEVMChain, RolluxChainMainnet, Mainnet],
  connectors: {
    metamask: new MetamaskConnector(),
    coinBase: new CoinbaseWalletConnector(),
    // walletConnectV2: new WalletConnectV2Connector.WalletConnectV2Connector({
    //   projectId: '6b7e7faf5a9e54e3c5f22289efa5975b',
    //   chains: [RolluxChain, TanenbaumChain, NEVMChain, RolluxChainMainnet],
    //   rpcMap: {
    //     57000: RolluxChain.rpcUrl || '',
    //     5700: TanenbaumChain.rpcUrl || '',
    //     57: NEVMChain.rpcUrl || '',
    //     570: RolluxChainMainnet.rpcUrl || '',
    //   }
    // })
  }
}

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      request: (params: { method: string; params?: any }) => Promise<any>;
      isConnected: boolean;
      selectedAddress: string;
      on: (event: string, callback: (...args: any[]) => void) => void;
      networkVersion: string;
    } & provider;
  }
}


function MyApp({ Component, pageProps }: AppProps) {

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DAppProvider config={dappConfig}>
          <ChakraProvider theme={chakraTheme}>


            <Component {...pageProps} />
            <WelcomeDisclaimer />
          </ChakraProvider>

        </DAppProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default MyApp;
