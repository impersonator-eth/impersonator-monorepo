# @impersonator/provider

Web3 Provider with the ability to impersonate as any Address via read-only mode.

<b>Note:</b> This package is built to be used in Web applications.

## Usage

```js
import ImpersonatorProvider from "@impersonator/provider";

const rpc = "https://mainnet.infura.io/v3/<INFURA_ID>";
const provider = new ImpersonatorProvider(rpc);
await provider.init(); // Pops up Modal where the user can enter which address/ENS they want to impersonate
```

<img src="https://raw.githubusercontent.com/apoorvlathey/impersonator-monorepo/master/packages/provider/.github/ss.png" />
