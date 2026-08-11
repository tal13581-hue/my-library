// Populated by the scheduled monitoring task (daily cloud routine — reads sources.json,
// checks each source, writes new entries here, commits + pushes).
//
// Each entry:
// {
//   date: 'YYYY-MM-DD',
//   platform: 'Kamino x 2.5',          // must match a key in PLATFORMS / sources.json
//   severity: 'critical'|'warning'|'info', // critical=red (most important), warning=orange, info=blue (standard)
//   actionRequired: true|false,        // true => shows an "EMERGENCY" tag. Only for things that need
//                                       // YOU to actively do something now (move/withdraw funds, approve
//                                       // a transaction, claim before a deadline, migrate a position, etc.)
//   title: '...',
//   summary: '...',                    // must say WHY this matters for this specific position, not just restate the source
//   sourceUrl: 'https://...'
// }
const ALERTS = [
  {
    date: '2026-08-09',
    platform: 'Aerodrome / veAERO',
    severity: 'critical',
    actionRequired: true,
    title: 'Aerodrome and Velodrome merging into a unified "Aero" token',
    summary: 'Aerodrome (Base) and Velodrome (Optimism) are merging into a single cross-chain DEX/token called Aero, consolidating roughly $500M in combined TVL. Existing AERO holders get 94.5% of the new token supply, but veNFT and self-custodied positions may not auto-migrate and could need manual action once migration tooling ships. Aerodrome’s TVL on DeFiLlama is also down ~19.5% over the past 30 days, consistent with pre-merger repositioning — worth watching closely since this affects your locked veAERO position directly.',
    sourceUrl: 'https://ambcrypto.com/aerodrome-and-velodrome-merge-to-form-aero/'
  },
  {
    date: '2026-08-09',
    platform: 'Aerodrome / veAERO',
    severity: 'warning',
    actionRequired: false,
    title: 'Weekly gauge voting replaced by "Predictive Allocation" (effective July 26, 2026)',
    summary: 'Aerodrome has replaced its weekly veAERO gauge-voting mechanism with an automated system that allocates incentives based on predicted future liquidity demand rather than votes. This changes how your veAERO voting power translates into rewards/bribes going forward — no action needed now, but the familiar weekly voting workflow no longer applies.',
    sourceUrl: 'https://cryptobriefing.com/aerodrome-predictive-allocation-dex-liquidity/'
  },
  {
    date: '2026-08-11',
    platform: 'Pyth',
    severity: 'info',
    actionRequired: false,
    title: 'Pyth ends free price-feed access, moves to paid API subscriptions',
    summary: 'Pyth rolled out an infrastructure upgrade (announced July 31, 2026) that requires every application pulling Pyth price feeds to hold a paid subscription and API key — Starter plans start at $500/month, with Pro bundles up to $10,000/month. Pyth says the new subscription revenue will flow into PYTH buybacks, a tokenomics-relevant change for your position even though no action is needed on your end.',
    sourceUrl: 'https://www.bitrue.com/blog/pyth-core-upgrade-july-2026'
  }
];
