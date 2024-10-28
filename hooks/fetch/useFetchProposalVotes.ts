import { useEffect, useState } from "react";

export const fetchGraphQLData = async (
    url: string,
    query: string,
    variables: Record<string, any>,
): Promise<any> => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.errors) {
            throw new Error(result.errors[0].message);
        }

        return result.data;
    } catch (error) {
        throw error;
    }
};

export const VOTES_QUERY = `
  query ProposalWithVotes($proposalId: String!) {
    proposal(id: $proposalId) {
      votes {
        voter
        support
        weight
        reason
      }
    }
  }
`;

export const useFetchProposalVotes = (proposalId: string) => {
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVotes = async () => {
            try {
                const result = await fetchGraphQLData(
                    "https://api.goldsky.com/api/public/project_clkk1ucdyf6ak38svcatie9tf/subgraphs/nouns-builder-base-mainnet/stable/gn",
                    VOTES_QUERY,
                    { proposalId }
                );

                setVotes(result.proposal?.votes || []);
            } catch (error) {
                console.error("Error fetching votes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVotes();
    }, [proposalId]);

    return { votes, loading };
};

