// pages/propdates/[proposalId]/[updateIndex].tsx
import React from "react";
import { useRouter } from "next/router";

const PropdatePage = () => {
    const router = useRouter();
    const { proposalID, updateIndex } = router.query;

    return (
        <div style={{ padding: "20px" }}>
            <h1>Proposal ID: {proposalID}</h1>
            <h2>Update Index: {updateIndex}</h2>
            <p>
                This page is dynamically routed for proposal <strong>{proposalID}</strong> and update index{" "}
                <strong>{updateIndex}</strong>.
            </p>
        </div>
    );
};

export default PropdatePage;
