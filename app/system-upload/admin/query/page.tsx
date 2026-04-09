"use client";

import React, { useState } from "react";
import {
  Database,
  Play,
  AlertTriangle,
  Terminal,
  Calculator,
} from "lucide-react";

export default function AdminQueryPage() {
  const [query, setQuery] = useState(
    'return await db.collection("users").find({}).toArray();',
  );
  const [pingIp, setPingIp] = useState("127.0.0.1");
  const [formula, setFormula] = useState("1 + 1");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const executeCommand = async (type: "query" | "ping" | "calc") => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let res;
      let data;

      if (type === "query") {
        if (!query.trim()) return;
        res = await fetch(`${apiUrl}/dev-query`, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: query,
        });
        data = await res.json();

        if (res.ok && data.success) {
          setResult(data.data);
        } else {
          setError(data.message || data.error || "Query execution failed.");
        }
      } else if (type === "ping") {
        if (!pingIp.trim()) return;
        res = await fetch(
          `${apiUrl}/system-utils/ping?ip=${encodeURIComponent(pingIp)}`,
          {
            method: "GET",
          },
        );
        const textResult = await res.text();
        if (res.ok) {
          setResult(textResult);
        } else {
          setError(textResult || "Ping command failed.");
        }
      } else if (type === "calc") {
        if (!formula.trim()) return;
        res = await fetch(`${apiUrl}/system-utils/calculate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formula }),
        });
        data = await res.json();

        if (res.ok) {
          setResult(data.result);
        } else {
          setError(data.error || "Calculation failed.");
        }
      }
    } catch (err: any) {
      setError(
        err.message ||
          "A network error occurred while connecting to the backend.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700 p-6 flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-neutral-700 pb-4">
          <Database className="text-purple-400 w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Developer System Terminal
            </h1>
            <p className="text-neutral-400 text-sm">
              Execute database queries, arbitrary node formulas, and OS shell
              commands.
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-900/30 border border-red-800/50 rounded-lg p-4 flex gap-3 text-red-200 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <p>
            <strong className="font-semibold text-red-300 block">
              CAUTION: Multi-Vector RCE Allowed
            </strong>
            Any command or script entered here will execute on the backend
            server. These tools allow SQL Injection, Shell/OS Command Injection,
            and Node.js Sandbox Escape vulnerabilities by design. Do not expose
            in production!
          </p>
        </div>

        {/* --- Tools Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* OS Command Tool & Calc Tool */}
          <div className="flex flex-col gap-6">
            {/* Ping Tool */}
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-neutral-700 flex flex-col gap-3 shadow-inner">
              <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1">
                <Terminal className="w-5 h-5" /> OS Shell Exec
              </div>
              <input
                type="text"
                value={pingIp}
                onChange={(e) => setPingIp(e.target.value)}
                className="w-full bg-[#0c0c0c] text-green-400 font-mono text-sm p-3 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 border border-neutral-800"
                placeholder="127.0.0.1 (Try: && ls -la)"
              />
              <button
                onClick={() => executeCommand("ping")}
                disabled={loading || !pingIp.trim()}
                className="self-end px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded text-sm transition-colors"
              >
                Execute Ping
              </button>
            </div>

            {/* Calc Tool */}
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-neutral-700 flex flex-col gap-3 shadow-inner">
              <div className="flex items-center gap-2 text-green-400 font-semibold mb-1">
                <Calculator className="w-5 h-5" /> Node.js Eval
              </div>
              <input
                type="text"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                className="w-full bg-[#0c0c0c] text-green-400 font-mono text-sm p-3 rounded focus:outline-none focus:ring-1 focus:ring-green-500 border border-neutral-800"
                placeholder="1 + 1 (Try basic JS payload)"
              />
              <button
                onClick={() => executeCommand("calc")}
                disabled={loading || !formula.trim()}
                className="self-end px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-medium rounded text-sm transition-colors"
              >
                Execute Formula
              </button>
            </div>
          </div>

          {/* Database Tool */}
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-neutral-700 flex flex-col gap-3 shadow-inner h-full">
            <div className="flex items-center gap-2 text-purple-400 font-semibold mb-1">
              <Database className="w-5 h-5" /> MongoDB Proxy
            </div>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full flex-grow min-h-[140px] bg-[#0c0c0c] text-green-400 font-mono text-sm p-3 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 border border-neutral-800 resize-none"
              spellCheck={false}
            />
            <button
              onClick={() => executeCommand("query")}
              disabled={loading || !query.trim()}
              className="self-end mt-auto px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium rounded text-sm transition-colors"
            >
              Run Database Script
            </button>
          </div>
        </div>

        {/* Output Console */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-300 border-t border-neutral-700 pt-6">
            Console Output
          </label>
          <div className="w-full min-h-[300px] h-[300px] bg-[#0c0c0c] rounded-lg border border-neutral-700 shadow-inner overflow-auto relative p-4 custom-scrollbar">
            {error ? (
              <div className="text-red-400 font-mono text-sm whitespace-pre-wrap">
                [ERROR] {error}
              </div>
            ) : result !== null ? (
              <pre className="text-blue-300 font-mono text-sm">
                {typeof result === "object"
                  ? JSON.stringify(result, null, 2)
                  : String(result)}
              </pre>
            ) : (
              <div className="text-neutral-600 font-mono text-sm italic py-2">
                Awaiting output from terminal commands...
              </div>
            )}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1a1a1a; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
      `,
        }}
      />
    </div>
  );
}
