import { ethers } from "ethers";
import { open } from "./Modal";

type Method = {
  id: number;
  jsonrpc: string;
  method: string;
  params: any[];
};

export default class ImpersonatorProvider extends ethers.providers
  .JsonRpcProvider {
  addressToImpersonate: string = ethers.constants.AddressZero;
  provider = new ethers.providers.JsonRpcProvider(
    this.connection,
    this.network
  );

  async init() {
    this.addressToImpersonate = await open(this.provider);
  }

  setAddressToImpersonate(addr: string) {
    this.addressToImpersonate = addr;
  }

  request(method: string | Method, params: Array<any>): Promise<any> {
    return this.handleRequestOrSend(method, params);
  }

  send(method: string | Method, params: Array<any>): Promise<any> {
    return this.handleRequestOrSend(method, params);
  }

  private handleRequestOrSend(
    method: string | Method,
    params: Array<any>
  ): Promise<any> {
    if (typeof method === "string") {
      return this.impersonateEthAccounts(method, params);
    } else {
      return this.impersonateEthAccounts(method.method, method.params);
    }
  }

  private impersonateEthAccounts(
    method: string,
    params: Array<any>
  ): Promise<any> {
    if (method === "eth_accounts") {
      return Promise.resolve([this.addressToImpersonate]);
    } else {
      // use original provider to send the rest of the requests
      return this.provider.send(method, params);
    }
  }
}
