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
  },
  {
    date: '2026-08-12',
    platform: 'Lido',
    severity: 'info',
    actionRequired: false,
    title: 'Lido deploys Curated Module v2, migrating validators to 0x02 withdrawal credentials',
    summary: 'Lido DAO approved and began deploying Curated Module v2 (CMv2) to mainnet in late July 2026, letting validators consolidate up to 2,048 ETH (vs. 32 ETH) under Ethereum\'s new 0x02 withdrawal credentials. This is an ~8M ETH (~$16.5B) infrastructure migration handled entirely at the protocol level — stETH holders (your position) don\'t need to do anything.',
    sourceUrl: 'https://blog.lido.fi'
  },
  {
    date: '2026-08-12',
    platform: 'Lido',
    severity: 'info',
    actionRequired: false,
    title: 'Lido "NEST" governance vote live: automated LDO buybacks from protocol revenue',
    summary: 'An on-chain DAO vote for NEST (Network Economic Support Tokenomics) went live August 5, 2026, proposing that a share of Lido\'s eligible revenue surplus fund automated LDO buybacks and DAO-owned liquidity. Purely a tokenomics/governance matter — no action needed unless you actively want to vote with LDO.',
    sourceUrl: 'https://crypto.news/lido-dao-price-rebounds-5-as-nest-vote-goes-live/'
  },
  {
    date: '2026-08-14',
    platform: 'Lido',
    severity: 'info',
    actionRequired: false,
    title: 'SharpLink to stake $200M in ETH through Lido',
    summary: 'Nasdaq-listed SharpLink (SBET), one of the largest corporate holders of ETH, announced on August 13, 2026 that it will stake $200M of ETH through Lido, receiving wstETH custodied with Anchorage Digital. Large institutional inflows like this reinforce Lido\'s dominant position in liquid staking (~$16.5B staked) and are a healthy signal for your stETH position, though no action is needed on your end.',
    sourceUrl: 'https://www.globenewswire.com/news-release/2026/08/13/3344459/0/en/sharplink-to-deploy-200m-eth-staking-allocation-with-lido.html'
  },
  {
    date: '2026-08-20',
    platform: 'GMX',
    severity: 'warning',
    actionRequired: true,
    title: 'GMX finalizes $44M compensation plan for GLP holders hit by the V1 exploit — claim now open',
    summary: 'GMX completed its compensation program for the GLP/V1 vulnerability, distributing roughly $44M (recovered funds plus ~$2M from the GMX treasury) to affected Arbitrum GLP liquidity providers as of August 13, 2026. If you held GLP on Arbitrum, check the GMX app for a claimable balance — payouts are issued as GLV tokens and require you to actively claim them.',
    sourceUrl: 'https://crypto.news/gmx-44m-payout-glp-holders-v1-exploit-2025/'
  }
];
