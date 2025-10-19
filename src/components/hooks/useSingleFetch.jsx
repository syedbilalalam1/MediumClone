import React, { useEffect, useState } from "react";

const useSingleFetch = (collectionName, id, subCol) => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const url = `${base}/api/${collectionName}/${encodeURIComponent(id)}`;
        const res = await fetch(url, { signal: controller.signal });
        const json = await res.json();
        setData(Array.isArray(json) ? json : []);
      } catch (e) {
        if (e.name !== 'AbortError') console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    // Listen for refresh events
    const handleRefresh = () => {
      if (collectionName === 'comments') {
        run();
      }
    };
    
    window.addEventListener('refreshComments', handleRefresh);
    run();
    
    return () => {
      controller.abort();
      window.removeEventListener('refreshComments', handleRefresh);
    };
  }, [id, collectionName, subCol]);
  return {
    data,
    loading,
  };
};

export default useSingleFetch;
