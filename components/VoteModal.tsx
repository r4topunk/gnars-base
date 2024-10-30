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

  const [support, setSupport] = useState<0 | 1 | 2 | undefined>();
  const [reason, setReason] = useState<string>("");

  const { config } = usePrepareContractWrite(
    support !== undefined
      ? {
        address: addresses?.governor,
        abi: GovernorABI,
        functionName: reason ? "castVoteWithReason" : "castVote",
        args: reason
          ? [proposal.proposalId, BigNumber.from(support), reason]
          : [proposal.proposalId, BigNumber.from(support)],
        chainId: 8453,
      }
      : undefined
  );

  const { write, data, isLoading: writeLoading, error: writeError } = useContractWrite({
    ...config,
    onError: (error) => console.error("Contract Write Error (onError):", error),
  });

  const { isLoading: txLoading, isSuccess: txSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div className="text-center text-skin-base dark:text-white pb-4 relative bg-white dark:bg-black p-6 rounded-xl shadow-lg">
      <div className="absolute top-0 right-0 p-2">
        <button type="button" onClick={() => setOpen(false)} className="text-gray-600 dark:text-gray-400">
          <XMarkIcon className="h-6" />
        </button>
      </div>
      <div className="font-heading text-4xl font-bold dark:text-yellow-200">
        Vote on Prop {proposalNumber}
      </div>
      <div className="text-skin-muted text-lg mt-2 dark:text-gray-400">
        Voting with {userVotes} NFTs
      </div>

      <button
        onClick={() => setSupport(1)}
        className={`w-full ${support === 1
          ? "bg-green-200 text-green-600 dark:bg-green-600 dark:text-green-200"
          : "bg-skin-backdrop dark:bg-gray-700 hover:bg-skin-muted dark:hover:bg-gray-600"
          } rounded-xl py-2 mt-6 border border-skin-stroke dark:border-gray-600 text-skin-muted dark:text-gray-300`}
      >
        For
      </button>

      <button
        onClick={() => setSupport(0)}
        className={`w-full ${support === 0
          ? "bg-red-200 text-red-600 dark:bg-red-600 dark:text-red-200"
          : "bg-skin-backdrop dark:bg-gray-700 hover:bg-skin-muted dark:hover:bg-gray-600"
          } rounded-xl py-2 mt-6 border border-skin-stroke dark:border-gray-600 text-skin-muted dark:text-gray-300`}
      >
        Against
      </button>

      <button
        onClick={() => setSupport(2)}
        className={`w-full ${support === 2
          ? "bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
          : "bg-skin-backdrop dark:bg-gray-700 hover:bg-skin-muted dark:hover:bg-gray-600"
          } rounded-xl py-2 mt-6 border border-skin-stroke dark:border-gray-600 text-skin-muted dark:text-gray-300`}
      >
        Abstain
      </button>

      {/* Text area for providing a reason */}
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Optional: Provide a reason for your vote"
        className="w-full bg-skin-backdrop dark:bg-gray-800 border border-skin-stroke dark:border-gray-600 text-skin-base dark:text-white rounded-xl py-2 px-3 mt-4 resize-none"
      />

      <button
        onClick={() => write?.()}
        disabled={txLoading || txSuccess}
        className={`w-full ${txSuccess
          ? "bg-green-500 text-white"
          : "bg-skin-button-accent dark:bg-yellow-200 hover:bg-skin-button-accent-hover dark:hover:bg-yellow-300 text-skin-inverted dark:text-black"
          } rounded-xl py-2 mt-6 flex justify-center items-center`}
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
