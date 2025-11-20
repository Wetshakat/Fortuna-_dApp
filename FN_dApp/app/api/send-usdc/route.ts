import { NextResponse } from "next/server";
import { createPublicClient, http, getContract } from "viem";
import { erc20Abi } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { toCircleSmartAccount } from "@circle-fin/modular-wallets-core";
import { createBundlerClient } from "viem/account-abstraction";
import { hexToBigInt } from "viem";
import { encodePacked } from "viem";
import { signPermit } from "@/lib/permit"; // Corrected import path

const chain = baseSepolia;
const usdcAddress = process.env.USDC_ADDRESS as `0x${string}`;
const ownerPrivateKey = process.env.OWNER_PRIVATE_KEY as `0x${string}`;
const paymasterAddress = process.env.PAYMASTER_V07_ADDRESS as `0x${string}`;

export async function POST(request: Request) {
  try {
    const { recipientAddress, amount } = await request.json();

    if (!recipientAddress || !amount) {
      return NextResponse.json(
        { error: "Missing recipientAddress or amount" },
        { status: 400 },
      );
    }

    if (!usdcAddress || !ownerPrivateKey || !paymasterAddress) {
      return NextResponse.json(
        { error: "Missing environment variables for USDC, Owner Private Key, or Paymaster" },
        { status: 500 },
      );
    }

    const client = createPublicClient({ chain, transport: http() });
    const owner = privateKeyToAccount(ownerPrivateKey);
    const account = await toCircleSmartAccount({ client, owner });

    const usdc = getContract({ client, address: usdcAddress, abi: erc20Abi });
    const usdcBalance = await usdc.read.balanceOf([account.address]);

    // Optional: Add a check here if the amount to send exceeds the balance
    if (usdcBalance < BigInt(amount)) {
      return NextResponse.json(
        { error: `Insufficient USDC balance. Current: ${usdcBalance}` },
        { status: 400 },
      );
    }

    const paymaster = {
      async getPaymasterData(parameters: any) {
        const permitAmount = 1000000n; // 1 USDC for permit
        const permitSignature = await signPermit({
          tokenAddress: usdcAddress,
          account,
          client,
          spenderAddress: paymasterAddress,
          permitAmount: permitAmount,
        });

        const paymasterData = encodePacked(
          ["uint8", "address", "uint256", "bytes"],
          [0, usdcAddress, permitAmount, permitSignature],
        );

        return {
          paymaster: paymasterAddress,
          paymasterData,
          paymasterVerificationGasLimit: 200000n,
          paymasterPostOpGasLimit: 15000n,
          isFinal: true,
        };
      },
    };

    const bundlerClient = createBundlerClient({
      account,
      client,
      paymaster,
      userOperation: {
        estimateFeesPerGas: async ({ account, bundlerClient, userOperation }) => {
          const { standard: fees } = await bundlerClient.request({
            method: "pimlico_getUserOperationGasPrice",
          });
          const maxFeePerGas = hexToBigInt(fees.maxFeePerGas);
          const maxPriorityFeePerGas = hexToBigInt(fees.maxPriorityFeePerGas);
          return { maxFeePerGas, maxPriorityFeePerGas };
        },
      },
      transport: http(`https://public.pimlico.io/v2/${client.chain.id}/rpc`),
    });

    const hash = await bundlerClient.sendUserOperation({
      account,
      calls: [
        {
          to: usdc.address,
          abi: usdc.abi,
          functionName: "transfer",
          args: [recipientAddress, BigInt(amount)],
        },
      ],
    });

    console.log("UserOperation hash", hash);

    const receipt = await bundlerClient.waitForUserOperationReceipt({ hash });
    console.log("Transaction hash", receipt.receipt.transactionHash);

    return NextResponse.json({ transactionHash: receipt.receipt.transactionHash });
  } catch (error: any) {
    console.error("Error in send-usdc API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send USDC" },
      { status: 500 },
    );
  }
}
