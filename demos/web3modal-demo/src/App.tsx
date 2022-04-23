import { useState } from "react";
import { Button, Center, Heading } from "@chakra-ui/react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { getImpersonatorProvider } from "@impersonator/web3modal";
import { ethers } from "ethers";

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: false, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID, // required
      },
    },
    ...getImpersonatorProvider(
      `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`
    ),
  },
});

function App() {
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();

  return (
    <Center flexDirection={"column"} verticalAlign="center" h="100vh">
      {!address ? (
        <Button
          onClick={async () => {
            const instance = await web3Modal.connect();
            let _provider = new ethers.providers.Web3Provider(instance);
            setProvider(_provider);

            const signer = await _provider.getSigner();

            const addr = await signer.getAddress();
            setAddress(addr);
          }}
        >
          Connect Wallet
        </Button>
      ) : (
        <Heading fontSize={"xl"}>Address: {address}</Heading>
      )}
    </Center>
  );
}

export default App;
