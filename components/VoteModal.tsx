import { Proposal } from "@/services/nouns-builder/governor";
import { TOKEN_CONTRACT } from "constants/addresses";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useDAOAddresses } from "../hooks";
import { GovernorABI } from "@buildersdk/sdk";
import { useState } from "react";
import Image from "next/image";
import { useUserVotes } from "@/hooks/fetch/useUserVotes";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { BigNumber } from "ethers";
export default function VoteModal({
  proposal,
  proposalNumber,
  setOpen,
}: {
  proposal: Proposal;
  proposalNumber: number;
  setOpen: (value: boolean) => void;
}) {
  const { data: userVotes } = useUserVotes({
    timestamp: proposal.proposal.timeCreated,
  });
  const { data: addresses } = useDAOAddresses({
    tokenContract: TOKEN_CONTRACT,
  });

  // State for vote support and reason
  const [support, setSupport] = useState<0 | 1 | 2 | undefined>();
  const [reason, setReason] = useState<string>("");

  // Log the reason to verify it's a plain string
  console.log("Reason:", reason);

  const { config } = usePrepareContractWrite(
    support !== undefined
      ? {
        address: addresses?.governor,
        abi: GovernorABI,
        functionName: reason ? "castVoteWithReason" : "castVote",
        args: reason
          ? [proposal.proposalId, BigNumber.from(support), reason] // Pass reason as plain string
          : [proposal.proposalId, BigNumber.from(support)],
        chainId: 8453,
      }
      : undefined
  );

  console.log("Prepared config:", config);

  const { write, data, isLoading: writeLoading, error: writeError } = useContractWrite({
    ...config,
    onError: (error) => console.error("Contract Write Error (onError):", error),
  });

  console.log("Write function:", write);
  console.log("Contract Write Error:", writeError);

  const { isLoading: txLoading, isSuccess: txSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  console.log("Addresses:", addresses); // Check if addresses are loaded correctly
  console.log("Support value:", support); // Check if the selected support value is correct
  console.log("Reason provided:", reason); // Confirm the reason text as a plain string

  return (
    <div className="text-center text-skin-base pb-4 relative">
      <div className="absolute top-0 right-0">
        <button type="button" onClick={() => setOpen(false)}>
          <XMarkIcon className="h-6" />
        </button>
      </div>
      <div className="font-heading text-4xl font-bold">
        Vote on Prop {proposalNumber}
      </div>
      <div className="text-skin-muted text-lg mt-2">
        Voting with {userVotes} NFTs
      </div>

      <button
        onClick={() => setSupport(1)}
        className={`w-full ${support === 1
          ? "bg-green-200 text-green-600"
          : "bg-skin-backdrop hover:bg-skin-muted"
          } rounded-xl py-2 mt-6 border border-skin-stroke text-skin-muted`}
      >
        For
      </button>

      <button
        onClick={() => setSupport(0)}
        className={`w-full ${support === 0
          ? "bg-red-200 text-red-600"
          : "bg-skin-backdrop hover:bg-skin-muted"
          } rounded-xl py-2 mt-6 border border-skin-stroke text-skin-muted`}
      >
        Against
      </button>

      <button
        onClick={() => setSupport(2)}
        className={`w-full ${support === 2
          ? "bg-gray-300 text-gray-700"
          : "bg-skin-backdrop hover:bg-skin-muted"
          } rounded-xl py-2 mt-6 border border-skin-stroke text-skin-muted`}
      >
        Abstain
      </button>

      {/* Text area for providing a reason */}
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Optional: Provide a reason for your vote"
        className="w-full bg-skin-backdrop border border-skin-stroke text-skin-base rounded-xl py-2 px-3 mt-4 resize-none"
      />

      <button
        onClick={() => write?.()}
        disabled={txLoading || txSuccess}
        className={`w-full 
           "bg-skin-button-accent hover:bg-skin-button-accent-hover text-skin-inverted"
          } rounded-xl py-2 mt-6 flex justify-around`}
      >
        {txSuccess ? (
          "Vote Submitted 🎉"
        ) : writeLoading || txLoading ? (
          <Image src={"/spinner.svg"} alt="spinner" width={20} height={20} />
        ) : (
          "Submit Vote"
        )}
      </button>
    </div>
  );
}
