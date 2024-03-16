import { AppDataSource } from "../data-source";
import CryptoJS from "crypto-js";
import { Path, GET, POST, PathParam } from "typescript-rest";
import { WalletEntity } from "../entity/wallets/index.entity";
import axios from "axios";
import { WalletTxEntity } from "../entity/walletTx/index.entity";
import { v4 as uuidv4 } from "uuid";

// EVER_WALLET_API IP - ex 20.130.111.2000:8080
const HOST = "http://111.111.111.111:8080";

// MAIN KEY OF EVER_WALLET_API
const APP_WALLET = "";

enum TxType {
  DEPOSIT = "Receive"
}

@Path("/health")
export class HealthController {
  @GET
  index(): { status: string } {
    return {
      status: "ok"
    };
  }
}

// SECRET and API_KEY from EVER_WALLET_API
const secret = "";
const api_key = "";

function createSignature(stringToSign: string) {
  const signature = CryptoJS.HmacSHA256(stringToSign, secret);
  return CryptoJS.enc.Base64.stringify(signature);
}

const getWalletBalance = async (address: string): Promise<string> => {
  const timestamp = Date.now().toString();
  const uri = `/ton/v3/address/0:${address}`;

  const stringToSign = timestamp + uri;
  const signature = createSignature(stringToSign);

  const config = {
    headers: {
      "Content-Type": "application/json",
      "api-key": api_key,
      timestamp: timestamp,
      sign: signature
    }
  };

  const reqData = await axios.get(`${HOST}${uri}`, config);

  if (!reqData) return "0";

  return reqData.data.data?.balance;
};

const transferNative = async (
  address: string,
  // 0.9 ever / 900000000
  amount = 900000000
): Promise<boolean> => {
  const timestamp = Date.now().toString();
  const uri = "/ton/v3/transactions/create";
  const body = {
    id: uuidv4(),
    fromAddress: APP_WALLET,
    bounce: true,
    outputs: [
      {
        value: amount,
        outputType: "Normal",
        recipientAddress: address
      }
    ],
    payload: "te6ccgEBAQEABgAACAVriBQ="
  };

  const stringToSign = timestamp + uri + JSON.stringify(body);
  const signature = createSignature(stringToSign);

  const config = {
    headers: {
      "Content-Type": "application/json",
      "api-key": api_key,
      timestamp: timestamp,
      sign: signature
    }
  };

  console.log("SEND");
  const reqData = await axios.post(`${HOST}${uri}`, body, config);

  if (!reqData.data.data?.messageHash) return false;

  return true;
};

// @Path("/test")
// export class WalletTestController {
//   @GET
//   async index(): Promise<any> {
//     await transferNativeMin(
//       "0:0778066d09c85566b5c695690213bf9b19d31b32e8984906f5d915764b56686d"
//     );
//     console.log(5 * 10 ** 7, "--10 ** 8 / 2");
//   }
// }

@Path("/wallet/deposits/:address")
export class WalletDepositsController {
  @GET
  async index(@PathParam("address") address: string): Promise<any[]> {
    const walletByUser = await AppDataSource.createEntityManager().find(
      WalletTxEntity,
      {
        where: {
          address
        }
      }
    );

    console.log(walletByUser, "----walletByUser");
    if (!walletByUser) return [];

    return walletByUser;
  }
}

@Path("/wallet/withdraw/:address/:amount")
export class WalletWithdrawController {
  @GET
  async index(
    @PathParam("address") address: string,
    @PathParam("amount") amount: number
  ): Promise<boolean> {
    const req = transferNative(address, amount);

    console.log(req, "----req");
    return true;
  }
}

@Path("/wallet/callback")
export class WalletCbController {
  @POST
  async index(newData: any): Promise<{ success: boolean; message?: string }> {
    try {
      if (!newData) return { success: false };
      if (newData.transactionDirection !== TxType.DEPOSIT) {
        return { success: false };
      }

      const addressBalance = await getWalletBalance(newData.account.hex);

      // less than 0.6 EVER
      // const minEver = 10 ** 8 * 6;

      console.log(addressBalance, "---addressBalance");

      // TODO: checking for MIN DEPOSIT
      // TODO: INSTANT WITHDRAW ON DEPOSIT
      // if (new BN(addressBalance).lessThan(minEver)) {
      //   console.log("TRANSFER NATIVE");
      //   await transferNative(`0:${newData.account.hex}`);
      //   await awaitDelay(2000);
      // }

      return {
        success: true
      };

    } catch (e) {
      console.log(e, "/wallet/callback");

      return {
        success: false
      };
    }
  }
}

@Path("/create/wallet")
export class WalletCreateController {
  @GET
  async index(): Promise<any> {
    try {
      const timestamp = Date.now().toString();
      const uri = "/ton/v3/address/create";
      const body = "{}";

      const stringToSign = timestamp + uri + body;
      const signature = createSignature(stringToSign);

      const config = {
        headers: {
          "Content-Type": "application/json",
          "api-key": api_key,
          timestamp: timestamp,
          sign: signature
        }
      };

      const reqData = await axios.post(
        `${HOST}${uri}`,
        JSON.parse(body),
        config
      );

      const newAddress = reqData?.data?.data.hex;

      let item = null;


      if (item || !newAddress) {
        return {
          success: false,
          result: {
            public: null
          }
        };
      }

      return {
        success: true,
        result: {
          public: newAddress
        }
      };
    } catch (e) {
      console.log(e);

      return {
        success: false,
        result: {
          public: null
        }
      };
    }
  }
}
