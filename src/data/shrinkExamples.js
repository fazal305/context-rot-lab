// Default content for the ContextShrink editor — deliberately messy so the
// tool has something to demonstrate on first load: comments, duplicate
// console logging, an unused default import, an unused side-effect
// stylesheet import, uneven whitespace, and a redundant blank-line run.
export const DEFAULT_SHRINK_EXAMPLE = `import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useAuth } from "../hooks/useAuth";

// Dashboard shows the current user's recent activity
export default function Dashboard({ user, onRefresh }) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems]   =    useState([]);
  const [error, setError] = useState(null);
  const { token } = useAuth();


  useEffect(() => {
    console.log("fetching dashboard data", user.id);
    setIsLoading(true);
    fetchItems(user.id, token)
      .then((data) => {
        console.log("got data", data);
        setItems(data);
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }, [user.id, token]);

  // render loading state
  if (isLoading) {
    return <p>Loading…</p>;
  }

  if (error) {
    return <p>Something went wrong.</p>;
  }

  return (
    <div className="dashboard">
      {items.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
`;
