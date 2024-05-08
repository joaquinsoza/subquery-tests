import {
  StellarDatasourceKind,
  StellarHandlerKind,
  StellarProject,
} from "@subql/types-stellar";
import { Horizon } from "stellar-sdk";

import * as dotenv from "dotenv";
import path from "path";

const mode = process.env.NODE_ENV || "production";

// Load the appropriate .env file
const dotenvPath = path.resolve(
  process.cwd(),
  `.env${mode !== "production" ? `.${mode}` : ""}`
);
dotenv.config({ path: dotenvPath });

/* This is your project configuration */
const project: StellarProject = {
  specVersion: "1.0.0",
  name: "soroban-starter",
  version: "0.0.1",
  runner: {
    node: {
      name: "@subql/node-stellar",
      version: "*",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  description:
    "This project can be use as a starting point for developing your new Stellar SubQuery project (mainnet)",
  repository: "https://github.com/subquery/stellar-subql-starter",
  schema: {
    file: "./schema.graphql",
  },
  network: {
    /* Stellar and Soroban uses the network passphrase as the chainId
      'Test SDF Network ; September 2015' for testnet
      'Public Global Stellar Network ; September 2015' for mainnet
      'Test SDF Future Network ; October 2022' for Future Network */
    chainId: "Public Global Stellar Network ; September 2015",
    /**
     * These endpoint(s) should be public non-pruned archive node
     * We recommend providing more than one endpoint for improved reliability, performance, and uptime
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
     * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
     * You can find RPC endpoints for Stellar here https://soroban.stellar.org/docs/reference/rpc-list
     */
    endpoint: process.env.ENDPOINT!?.split(",") as string[] | string,
    /* This is a specific Soroban endpoint
      It is only required when you are using a soroban/EventHandler */
    sorobanEndpoint:
      "https://rpc.ankr.com/stellar_soroban/670aa62bb995fe0c0e45b316b0c4aca229b2cf47a6a8f44c7803e79c11cf8f5f",
  },
  dataSources: [
    {
      kind: StellarDatasourceKind.Runtime,
      /* Set this as a logical start block, it might be block 1 (genesis) or when your contract was deployed */
      startBlock: 50460054,
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            handler: "handleEvent",
            kind: StellarHandlerKind.Event,
            filter: {
              contractId:
                "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH",
              topics: ["swap", "add", "remove"],
            },
          },
        ],
      },
    },
  ],
};

// Must set default to the project instance
export default project;
