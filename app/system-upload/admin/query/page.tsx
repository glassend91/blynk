"use client";

import React, { useState } from "react";
import { Database, Play, AlertTriangle } from "lucide-react";

export default function AdminQueryPage() {
  const [query, setQuery] = useState('return await db.collection("users").find({}).toArray();');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    // Using apiClient configuration to hit backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    try {
      const res = await fetch(`${apiUrl}/dev-query`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: query,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResult(data.data);
      } else {
        setError(data.message || data.error || "Query execution failed.");
        if (data.stack) {
            console.error("Server Stack:", data.stack);
        }
      }
    } catch (err: any) {
      setError(err.message || "A network error occurred while connecting to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700 p-6 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-neutral-700 pb-4">
          <Database className="text-purple-400 w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Developer Database Terminal</h1>
            <p className="text-neutral-400 text-sm">Execute raw asynchronous JavaScript commands against the MongoDB instance.</p>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-900/30 border border-red-800/50 rounded-lg p-4 flex gap-3 text-red-200 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <p>
            <strong className="font-semibold text-red-300 block">CAUTION: Remote Code Execution Allowed</strong>
            Any query entered here will immediately execute on the server. There are no safeguards. Do not use destructive commands (`dropDatabase`, `deleteMany({})`) unless absolutely certain. Do not expose this URL in production.
          </p>
        </div>

        {/* Query Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-300">
            Raw JavaScript Query (Requires <code className="bg-neutral-700 px-1 py-0.5 rounded text-purple-300">return await</code> syntax)
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-48 bg-[#1e1e1e] text-green-400 font-mono text-sm p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-neutral-700 shadow-inner resize-y"
            spellCheck={false}
            placeholder='return await db.collection("users").find({}).toArray();'
          />
        </div>

        {/* Controls */}
        <div className="flex justify-end">
          <button
            onClick={executeQuery}
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-neutral-700 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-neutral-800 shadow-lg"
          >
            {loading ? (
              <span className="animate-pulse">Executing...</span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Run Script
              </>
            )}
          </button>
        </div>

        {/* Output Console */}
        <div className="flex flex-col gap-2 flex-grow">
          <label className="text-sm font-semibold text-neutral-300">Console Output</label>
          <div className="w-full min-h-[300px] h-[400px] bg-[#0c0c0c] rounded-lg border border-neutral-700 shadow-inner overflow-auto relative p-4 custom-scrollbar">
            {error ? (
              <div className="text-red-400 font-mono text-sm whitespace-pre-wrap">
                Error: {error}
              </div>
            ) : result !== null ? (
              <pre className="text-blue-300 font-mono text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            ) : (
              <div className="text-neutral-600 font-mono text-sm italic">
                Awaiting query execution...
              </div>
            )}
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1a1a1a; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
      `}} />
    </div>
  );
}
