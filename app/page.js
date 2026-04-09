"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts";
import { Activity, TrendingUp, TrendingDown, Cpu, Key, CheckCircle, AlertCircle } from "lucide-react";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periodStr, setPeriodStr] = useState("Last 60 Days");
  
  // AI related states
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [aiError, setAiError] = useState("");
  
  // Metrics extraction
  const latestPremium = data.length > 0 ? data[data.length - 1].premium : 0;
  const prevPremium = data.length > 1 ? data[data.length - 2].premium : 0;
  const premiumChange = latestPremium - prevPremium;
  const latestMSTR = data.length > 0 ? data[data.length - 1].mstrPrice : 0;
  const latestBTC = data.length > 0 ? data[data.length - 1].btcPrice : 0;
  
  const averagePremium = data.length > 0 
    ? data.reduce((sum, item) => sum + item.premium, 0) / data.length 
    : 0;

  useEffect(() => {
    fetchIndicatorData();
  }, []);

  const fetchIndicatorData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/indicator");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || "Failed to fetch data");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async () => {
    try {
      setIsAiLoading(true);
      setAiError("");
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data })
      });
      const json = await res.json();
      if (json.success) {
        setAiSummary(json.summary);
      } else {
        setAiError(json.error || "Failed to generate AI insights");
      }
    } catch (err) {
      setAiError(err.message);
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--background)', border: '1px solid var(--border)' }} className="p-4 rounded-lg shadow-xl text-sm">
          <p className="text-gray-400 mb-2">{label}</p>
          <p style={{ color: 'var(--accent)' }} className="font-medium">
            Premium: {payload[0].value.toFixed(2)}%
          </p>
          <p className="text-gray-300">
            MSTR: ${payload[0].payload.mstrPrice.toFixed(2)}
          </p>
          <p className="text-gray-300">
            BTC: ${payload[0].payload.btcPrice.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div>
          <h1 className="title-font text-3xl md:text-5xl font-bold mb-2 flex items-center gap-3">
            <Activity style={{ color: 'var(--accent)' }} size={36} />
            DAT.co Insights
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Tracking MicroStrategy (MSTR) Premium to Net Asset Value (NAV)
          </p>
        </div>
      </header>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="glass-panel p-6 relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
          <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-1">MSTR Premium to NAV</h3>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-4xl font-bold title-font">
              {loading ? "--" : `${latestPremium.toFixed(2)}%`}
            </span>
            {!loading && (
              <span className={`flex items-center text-sm font-medium ${premiumChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                {premiumChange >= 0 ? <TrendingUp size={16} className="mr-1"/> : <TrendingDown size={16} className="mr-1"/>}
                {Math.abs(premiumChange).toFixed(2)}% (today)
              </span>
            )}
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <Activity size={120} />
          </div>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
          <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-1">MSTR Share Price</h3>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-3xl font-bold title-font">
              {loading ? "--" : `$${latestMSTR.toFixed(2)}`}
            </span>
          </div>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
          <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-1">BTC Price</h3>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-3xl font-bold title-font text-[#f7931a]">
              {loading ? "--" : `$${latestBTC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <section className="glass-panel p-6 md:p-8 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="title-font text-xl font-medium">Premium Variance ({periodStr})</h2>
        </div>
        
        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-[var(--accent)] border-gray-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="h-[400px] flex items-center justify-center text-red-400 flex-col gap-2">
            <AlertCircle size={32} />
            <span>{error}</span>
          </div>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--text-secondary)" 
                  fontSize={12}
                  tickMargin={10}
                  tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                />
                <YAxis 
                  stroke="var(--text-secondary)" 
                  fontSize={12}
                  tickFormatter={(val) => `${val}%`}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine 
                  y={averagePremium} 
                  stroke="var(--text-secondary)" 
                  strokeDasharray="5 5"
                  label={{ position: 'insideTopLeft', value: `60-Day Avg: ${averagePremium.toFixed(2)}%`, fill: 'var(--text-secondary)', fontSize: 12 }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="premium" 
                  stroke="var(--accent)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPremium)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* AI Insights Section */}
      <section className="glass-panel p-6 animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.5s' }}>
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent-secondary)]"></div>
        <div className="flex items-center gap-3 mb-4">
          <Cpu className="text-[var(--accent-secondary)]" size={24} />
          <h2 className="title-font text-xl font-medium">Robo-Advisor AI Summary</h2>
        </div>
        
        <div className="min-h-[100px]">
          {aiSummary ? (
            <p className="text-gray-200 leading-relaxed text-lg tracking-wide whitespace-pre-wrap">
              {aiSummary}
            </p>
          ) : (
             <div className="flex flex-col items-start gap-4">
               <p className="text-[var(--text-secondary)]">
                 Hit the button below to generate a tailored financial summary analyzing the recent trend of the MSTR Premium using Google Gemini.
               </p>
               {aiError && <p className="text-red-400 text-sm">{aiError}</p>}
               <button 
                onClick={generateAIInsights}
                disabled={isAiLoading || loading}
                className="px-6 py-2.5 rounded-lg font-medium bg-white text-black hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 pulse-glow"
               >
                 {isAiLoading ? 'Analyzing Data...' : 'Generate Analysis'}
               </button>
             </div>
          )}
        </div>
      </section>
    </main>
  );
}
