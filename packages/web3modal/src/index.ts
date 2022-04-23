import ImpersonatorProvider from "@impersonator/provider";
import logo from "./logo";

export const getImpersonatorProvider = (rpc: string) => {
  return {
    "custom-impersonator": {
      display: {
        logo,
        name: "Impersonator",
        description: "Login as any address in view-only Mode",
      },
      package: ImpersonatorProvider,
      options: {
        rpc,
      },
      connector: async (ImpersonatorProvider: any, opts: { rpc: string }) => {
        return new Promise(async (resolve, reject) => {
          if (opts && opts.rpc) {
            const provider = new ImpersonatorProvider(opts.rpc);
            await provider.init();
            resolve(provider);
          } else {
            return reject(new Error("Missing RPC URL"));
          }
        });
      },
    },
  };
};
