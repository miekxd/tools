export interface LLMCall {
  id: number;
  call_date: string;
  batch_id: string;
  ticker: string;
  company_name: string;
  recommendation: 'STRONG BUY' | 'BUY' | 'WATCH' | 'IGNORE';
  rank: number;
  signal_strength: number;
  time_horizon: string | null;
  number_of_insiders: number | null;
  total_transaction_value: number | null;
  transaction_dates: string;  // JSON string
  insider_names: string;      // JSON string
  entry_price: number | null;
  entry_date: string;
  entry_timestamp: string;
  exit_price: number | null;
  exit_date: string | null;
  exit_reason: string | null;
  price_change_pct: number;
  holding_days: number;
  pnl_dollars: number;
  status: 'OPEN' | 'CLOSED' | 'MONITORING' | null;
  is_closed: boolean;
  llm_rationale: string;
  market_patterns: string;    // JSON string
  created_at: string;
  updated_at: string;
  insider_avg_price: number | null;
  insider_prices_json: string; // JSON string
  current_price: number | null;
  last_price_update: string | null;
}

export interface ParsedLLMCall extends Omit<LLMCall, 'transaction_dates' | 'insider_names' | 'market_patterns' | 'insider_prices_json'> {
  transaction_dates: string[];
  insider_names: string[];
  market_patterns: string[];
  insider_prices_json: (number | null)[];
}

