'use client';

import { useState, useEffect } from 'react';
import ToolSidebar from '@/components/ToolSidebar';
import { createClient } from '@/lib/supabase/client';
import { LLMCall, ParsedLLMCall } from '@/types/insider';
import { BarChart3, DollarSign, RefreshCw, Info, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';

export default function InsiderDashboardPage() {
  const supabase = createClient();
  const [calls, setCalls] = useState<ParsedLLMCall[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('open');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCall, setSelectedCall] = useState<ParsedLLMCall | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchCalls();
  }, [filter]);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('llm_calls')
        .select('*')
        .order('entry_date', { ascending: false });

      if (filter === 'open') query = query.eq('is_closed', false);
      if (filter === 'closed') query = query.eq('is_closed', true);

      const { data, error } = await query;

      if (error) throw error;

      // Parse JSON fields
      const parsedData: ParsedLLMCall[] = (data || []).map((call: LLMCall) => ({
        ...call,
        transaction_dates: parseJSON(call.transaction_dates, []),
        insider_names: parseJSON(call.insider_names, []),
        market_patterns: parseJSON(call.market_patterns, []),
        insider_prices_json: parseJSON(call.insider_prices_json, []),
      }));

      setCalls(parsedData);
    } catch (error: any) {
      setError(error.message);
      console.error('Error fetching calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseJSON = (value: any, defaultValue: any) => {
    try {
      if (typeof value === 'string') {
        return JSON.parse(value);
      }
      return value || defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const openDetailsDialog = (call: ParsedLLMCall) => {
    setSelectedCall(call);
    setDialogOpen(true);
  };

  const calculatePnL = (call: ParsedLLMCall): number | null => {
    if (!call.current_price || !call.entry_price) return null;
    return ((call.current_price - call.entry_price) / call.entry_price) * 100;
  };

  const calculateHoldingDays = (call: ParsedLLMCall): number => {
    const entryDate = new Date(call.entry_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - entryDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getEarliestInsiderDate = (dates: string[]): string => {
    if (!dates || dates.length === 0) return 'N/A';
    const sorted = dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return new Date(sorted[0]).toLocaleDateString();
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'STRONG BUY':
        return { bg: '#10B981', text: 'white' };
      case 'BUY':
        return { bg: '#3B82F6', text: 'white' };
      case 'WATCH':
        return { bg: '#F59E0B', text: 'white' };
      default:
        return { bg: '#6B7280', text: 'white' };
    }
  };

  const getPnLColor = (pnl: number | null) => {
    if (pnl === null) return 'var(--text-secondary)';
    return pnl >= 0 ? '#10B981' : '#EF4444';
  };

  // Calculate stats
  const activeCalls = calls.filter(c => !c.is_closed).length;
  const callsWithPnL = calls.filter(c => calculatePnL(c) !== null);
  const avgPnL = callsWithPnL.length > 0 
    ? callsWithPnL.reduce((sum, call) => {
        const pnl = calculatePnL(call);
        return sum + (pnl || 0);
      }, 0) / callsWithPnL.length 
    : 0;
  const totalValue = calls.reduce((sum, call) => sum + (call.total_transaction_value || 0), 0);
  const strongBuyCount = calls.filter(c => c.recommendation === 'STRONG BUY').length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <ToolSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b px-8 py-6" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8" style={{ color: 'var(--purple-primary)' }} />
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Insider Trading Dashboard
            </h1>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div className="rounded-lg p-4 cursor-help" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', borderWidth: '1px' }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-purple">{activeCalls}</span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Active Calls</span>
                </div>
              </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="rounded-md px-3 py-2 text-sm shadow-lg"
                      style={{ 
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-primary)'
                      }}
                      sideOffset={5}
                    >
                      Number of open trading positions
                      <Tooltip.Arrow style={{ fill: 'var(--bg-tertiary)' }} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
              
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div className="rounded-lg p-4 cursor-help" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', borderWidth: '1px' }}>
                <div className="flex items-center gap-2">
                        {avgPnL >= 0 ? (
                          <TrendingUp className="w-5 h-5" style={{ color: '#10B981' }} />
                        ) : (
                          <TrendingDown className="w-5 h-5" style={{ color: '#EF4444' }} />
                        )}
                  <span className="text-2xl font-bold" style={{ color: avgPnL >= 0 ? '#10B981' : '#EF4444' }}>
                    {avgPnL >= 0 ? '+' : ''}{avgPnL.toFixed(2)}%
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Avg P&L</span>
                </div>
              </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="rounded-md px-3 py-2 text-sm shadow-lg"
                      style={{ 
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-primary)'
                      }}
                      sideOffset={5}
                    >
                      Average profit and loss percentage
                      <Tooltip.Arrow style={{ fill: 'var(--bg-tertiary)' }} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
              
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div className="rounded-lg p-4 cursor-help" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', borderWidth: '1px' }}>
                <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-purple" />
                  <span className="text-2xl font-bold text-purple">
                    ${(totalValue / 1000000).toFixed(2)}M
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Value</span>
                </div>
              </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="rounded-md px-3 py-2 text-sm shadow-lg"
                      style={{ 
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-primary)'
                      }}
                      sideOffset={5}
                    >
                      Total transaction value across all positions
                      <Tooltip.Arrow style={{ fill: 'var(--bg-tertiary)' }} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
              
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div className="rounded-lg p-4 cursor-help" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', borderWidth: '1px' }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-purple">{strongBuyCount}</span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Strong Buy</span>
                </div>
              </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="rounded-md px-3 py-2 text-sm shadow-lg"
                      style={{ 
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-primary)'
                      }}
                      sideOffset={5}
                    >
                      Number of positions with STRONG BUY recommendation
                      <Tooltip.Arrow style={{ fill: 'var(--bg-tertiary)' }} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="border-b px-8 py-3 flex items-center justify-between" style={{ 
            borderColor: 'var(--border-primary)',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            <div className="flex gap-2">
              {(['all', 'open', 'closed'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className="px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: filter === filterType ? 'var(--purple-primary)' : 'transparent',
                    color: filter === filterType ? 'white' : 'var(--text-secondary)',
                  }}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={fetchCalls}
                      className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                      style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="rounded-md px-3 py-2 text-sm shadow-lg"
                      style={{ 
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-primary)'
                      }}
                      sideOffset={5}
                    >
                      Reload data from database
                      <Tooltip.Arrow style={{ fill: 'var(--bg-tertiary)' }} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
          </div>

          {/* Column Headers */}
          {calls.length > 0 && (
            <div className="px-8 py-3 border-b" style={{ 
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-start-1">
                  <span className="text-xs font-semibold uppercase pl-4" style={{ color: 'var(--text-secondary)' }}>
                    Ticker
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs font-semibold uppercase pl-4" style={{ color: 'var(--text-secondary)' }}>
                    Company
                  </span>
                </div>
                <div className="col-span-1">
                  <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-secondary)' }}>
                    Recommendation
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-secondary)' }}>
                    Insider Price / Date
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-secondary)' }}>
                    My Entry Price / Date
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-secondary)' }}>
                    Current Price
                  </span>
                </div>
                <div className="col-span-1">
                  <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-secondary)' }}>
                    P&L / Days
                  </span>
                </div>
                <div className="col-span-1 text-right">
                  <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-secondary)' }}>
                    Details
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-8 mt-4 p-3 rounded-lg" style={{ 
              backgroundColor: '#FEE2E2',
              borderColor: '#FCA5A5',
              borderWidth: '1px'
            }}>
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-xs text-red-500 hover:text-red-600 mt-1"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--purple-primary)' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Loading calls...</p>
              </div>
            ) : calls.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  No calls found
                </h3>
                <p style={{ color: 'var(--text-tertiary)' }} className="text-sm">
                  {filter === 'all' ? 'No trading calls in the system yet.' : 
                   filter === 'open' ? 'No open positions.' : 
                   'No closed positions.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {calls.map((call) => {
                  const pnl = calculatePnL(call);
                  const holdingDays = calculateHoldingDays(call);
                  const recColor = getRecommendationColor(call.recommendation);
                  const earliestInsiderDate = getEarliestInsiderDate(call.transaction_dates);

                  return (
                    <div
                      key={call.id}
                      className="rounded-lg border transition-all duration-200"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-primary)',
                      }}
                    >
                      {/* Main Row */}
                      <div className="p-4">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Ticker */}
                          <div className="col-span-1">
                            <div className="px-3 py-1 rounded-md font-black text-center tracking-wide" style={{ backgroundColor: 'var(--purple-primary)', color: '#ffffff', fontWeight: 900 }}>
                              {call.ticker}
                            </div>
                          </div>

                          {/* Company */}
                          <div className="col-span-2">
                            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                              {call.company_name}
                            </div>
                          </div>

                          {/* Recommendation */}
                          <div className="col-span-1">
                            <div className="px-2 py-1 rounded text-xs font-bold text-center" style={{ backgroundColor: recColor.bg, color: recColor.text }}>
                              {call.recommendation}
                            </div>
                            <div className="mt-1 text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                              {call.signal_strength}/10
                            </div>
                          </div>

                          {/* Insider Info */}
                          <div className="col-span-2">
                            <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                              {call.insider_avg_price ? `$${call.insider_avg_price.toFixed(2)}` : 'N/A'}
                            </div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              {earliestInsiderDate}
                            </div>
                          </div>

                          {/* My Entry */}
                          <div className="col-span-2">
                            <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                              {call.entry_price ? `$${call.entry_price.toFixed(2)}` : 'N/A'}
                            </div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              {new Date(call.entry_date).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Current Price */}
                          <div className="col-span-2">
                            <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                              {call.current_price ? `$${call.current_price.toFixed(2)}` : 'N/A'}
                            </div>
                            {call.last_price_update && (
                              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                Updated: {new Date(call.last_price_update).toLocaleDateString()}
                              </div>
                            )}
                          </div>

                          {/* P&L */}
                          <div className="col-span-1">
                            {pnl !== null ? (
                              <>
                                <div className="text-sm font-bold" style={{ color: getPnLColor(pnl) }}>
                                  {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}%
                                </div>
                                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                  {holdingDays}d
                                </div>
                              </>
                            ) : (
                              <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                No price
                              </div>
                            )}
                          </div>

                          {/* Details Button */}
                          <div className="col-span-1 text-right">
                            <button
                              onClick={() => openDetailsDialog(call)}
                              className="px-3 py-1 rounded-md transition-colors duration-200 flex items-center gap-1"
                              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                            >
                              <Info className="w-4 h-4" />
                              <span className="text-xs">View</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay 
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl"
            style={{ 
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)'
            }}
          >
            {selectedCall && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {selectedCall.ticker} - {selectedCall.company_name}
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      className="p-2 rounded-md hover:bg-opacity-80 transition-colors"
                      style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    >
                      <X className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                    </button>
                  </Dialog.Close>
                </div>

                            <div className="grid grid-cols-2 gap-6">
                              {/* Left Column */}
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                    LLM Rationale
                                  </h4>
                                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {selectedCall.llm_rationale}
                                  </p>
                                </div>

                                <div>
                                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                    Transaction Details
                                  </h4>
                                  <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <div><strong>Insiders:</strong> {selectedCall.number_of_insiders || 0}</div>
                        <div><strong>Total Value:</strong> ${selectedCall.total_transaction_value ? (selectedCall.total_transaction_value / 1000000).toFixed(2) : '0'}M</div>
                        <div><strong>Time Horizon:</strong> {selectedCall.time_horizon || 'N/A'}</div>
                        <div><strong>Status:</strong> {selectedCall.status || 'N/A'}</div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                    Insider Names
                                  </h4>
                                  <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                        {selectedCall.insider_names.map((name, idx) => (
                                      <li key={idx}>{name}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              {/* Right Column */}
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                    Transaction Dates
                                  </h4>
                                  <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                        {selectedCall.transaction_dates.map((date, idx) => (
                                      <li key={idx}>{new Date(date).toLocaleDateString()}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                    Insider Prices
                                  </h4>
                      {selectedCall.insider_prices_json.length > 0 ? (
                                    <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                          {selectedCall.insider_prices_json.map((price, idx) => (
                                        <li key={idx}>${price ? price.toFixed(2) : 'N/A'}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No prices recorded</p>
                                  )}
                                </div>

                                <div>
                                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                    Market Patterns
                                  </h4>
                      {selectedCall.market_patterns.length > 0 ? (
                                    <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                          {selectedCall.market_patterns.map((pattern, idx) => (
                                        <li key={idx}>{pattern}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No patterns recorded</p>
                                  )}
                                </div>

                                <div>
                                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                    Metadata
                                  </h4>
                                  <div className="space-y-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        <div><strong>Batch ID:</strong> {selectedCall.batch_id}</div>
                        <div><strong>Call Date:</strong> {new Date(selectedCall.call_date).toLocaleString()}</div>
                        {selectedCall.last_price_update && (
                          <div><strong>Price Updated:</strong> {new Date(selectedCall.last_price_update).toLocaleString()}</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

