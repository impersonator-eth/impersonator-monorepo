import { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  ChakraProvider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Box,
  Center,
  Text,
  Input,
  Button,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { injectStyleSheet, renderWrapper } from "./utils";
import { ethers } from "ethers";

const ImpersonatorModal = ({
  resolve,
  provider,
}: {
  resolve: Function;
  provider: ethers.providers.JsonRpcProvider;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showAddress, setShowAddress] = useState(""); // gets displayed in input. ENS name remains as it is
  const [address, setAddress] = useState(""); // internal resolved address
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resolveAndValidateAddress = async () => {
    let isValid;
    let _address = address;
    if (!address) {
      isValid = false;
    } else {
      // Resolve ENS
      try {
        const resolvedAddress = await provider.resolveName(address);
        if (resolvedAddress) {
          setAddress(resolvedAddress);
          _address = resolvedAddress;
          isValid = true;
        } else if (ethers.utils.isAddress(address)) {
          isValid = true;
        } else {
          isValid = false;
        }
      } catch {
        isValid = false;
      }
    }

    setIsAddressValid(isValid);

    return { isValid, _address: _address };
  };

  useEffect(() => {
    // open Modal on load
    onOpen();
  }, []);

  return (
    <>
      <Box ref={containerRef} pointerEvents="auto" />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        initialFocusRef={inputRef}
        motionPreset="slideInBottom"
        portalProps={{ containerRef }}
      >
        <ModalOverlay bg={"blackAlpha.900"} />
        <ModalContent bg="gray.900">
          <Box my="1rem" ml="auto" mr="auto">
            <Text fontSize="xl" fontWeight={"bold"}>
              Enter Address or ENS to Impersonate
            </Text>
          </Box>
          <ModalCloseButton />
          <ModalBody mb="1rem">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsLoading(true);
                const { isValid, _address } = await resolveAndValidateAddress();
                setIsLoading(false);
                if (isValid) {
                  resolve(_address);
                  onClose();
                }
              }}
            >
              <Center flexDirection={"column"}>
                <Input
                  ref={inputRef}
                  value={showAddress}
                  onChange={(e) => {
                    const _showAddress = e.target.value;
                    setShowAddress(_showAddress);
                    setAddress(_showAddress);
                    setIsAddressValid(true); // remove inValid warning when user types again
                  }}
                  isInvalid={!isAddressValid}
                  autoCorrect="off"
                  spellCheck="false"
                />
                <Button mt="1rem" type="submit" isLoading={isLoading}>
                  OK
                </Button>
                {!isAddressValid && (
                  <Alert status="error" mt="1rem">
                    <AlertIcon />
                    Address is not an ENS or Ethereum address
                  </Alert>
                )}
              </Center>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export const open = (
  provider: ethers.providers.JsonRpcProvider
): Promise<string> => {
  return new Promise((resolve, reject) => {
    injectStyleSheet();
    const wrapper = renderWrapper();
    const root = createRoot(wrapper);
    root.render(
      <ChakraProvider>
        <ImpersonatorModal resolve={resolve} provider={provider} />
      </ChakraProvider>
    );
  });
};
