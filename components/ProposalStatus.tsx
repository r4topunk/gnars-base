import { Proposal } from "@/services/nouns-builder/governor";
import { Fragment } from "react";

export default function ProposalStatus({ proposal }: { proposal: Proposal }) {
  const { state } = proposal;

  switch (state) {
    case 0:
      return (
        <div className="bg-gray-400 text-fill p-1 px-2 rounded-md w-24 text-center">
          Pending
        </div>
      );
    case 1:
      return (
        <div className="bg-green-400 text-fill p-1 px-2 rounded-md w-24 text-center">
          Active
        </div>
      );
    case 2:
      return (
        <div className="bg-rose-400 text-fill p-1 px-2 rounded-md w-24 text-center">
          Canceled
        </div>
      );
    case 3:
      return (
        <div className="bg-red-400 text-fill p-1 px-2 rounded-md w-24 text-center">
          Defeated
        </div>
      );
    case 4:
      return (
        <div className="bg-green-400 text-fill p-1 px-2 rounded-md w-24 text-center">
          Succeeded
        </div>
      );
    case 5:
      return (
        <div className="bg-purple-400 text-fill p-1 px-2 rounded-md w-24 text-center">
          Queued
        </div>
      );
    case 6:
      return (
        <div className="bg-gray-400 text-fill p-1 px-2 rounded-md w-24 text-center">
          Expired
        </div>
      );
    case 7:
      return (
        <div className="bg-blue-400 text-fill p-1 px-2 rounded-md w-24 text-center">
          Executed
        </div>
      );
    case 8:
      return (
        <div className="bg-gray-400 text-fill p-1 px-2 rounded-md w-24 text-center">
          Vetoed
        </div>
      );
    default:
      return <Fragment />;
  }
}
