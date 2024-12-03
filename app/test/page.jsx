"use client";

import { useState, useEffect } from "react";
import getPendingMembers from "@/app/actions/getPendingMembers";

export default function PendingMembers() {
  const [pendingMembers, setPendingMembers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch pending members on component load
    const fetchPendingMembers = async () => {
      try {
        const members = await getPendingMembers();
        if (members.error) {
          setError(members.error);
        } else {
          setPendingMembers(members);
        }
      } catch (err) {
        setError("Failed to fetch pending members.");
        console.error(err);
      }
    };

    fetchPendingMembers();
  }, []);

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <h2>Pending Members</h2>
      {pendingMembers.length > 0 ? (
        <ul>
          {pendingMembers.map((member) => (
            <li key={member.id}>
              {member.firstName} {member.lastName} - {member.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending members found.</p>
      )}
    </div>
  );
}
