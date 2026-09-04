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
  },
  {
    date: '2026-08-24',
    platform: 'Lido',
    severity: 'warning',
    actionRequired: true,
    title: 'Bitfinex delists LDO — withdrawal deadline Aug 31, 2026',
    summary: 'Bitfinex delisted LDO on August 17, 2026 (among 13 tokens), giving users until 10:00 UTC on August 31 to withdraw before standard withdrawals are disabled. If any of your LDO is held on Bitfinex, move it before the deadline — after that, retrieval is only through a discretionary, fee-bearing process with no fixed timeline.',
    sourceUrl: 'https://cryptoslate.com/bitfinex-gives-users-14-days-to-withdraw-13-delisted-tokens-or-face-fees-and-uncertain-recovery/'
  },
  {
    date: '2026-08-24',
    platform: 'Jupiter / JLP',
    severity: 'warning',
    actionRequired: true,
    title: 'Bitfinex delists JUP — withdrawal deadline Aug 31, 2026',
    summary: 'Bitfinex delisted JUP on August 17, 2026 (among 13 tokens, alongside LDO), giving users until 10:00 UTC on August 31 to withdraw before standard withdrawals are disabled. If any of your JUP is held on Bitfinex, move it before the deadline — after that, retrieval is only through a discretionary, fee-bearing process with no fixed timeline.',
    sourceUrl: 'https://cryptoslate.com/bitfinex-gives-users-14-days-to-withdraw-13-delisted-tokens-or-face-fees-and-uncertain-recovery/'
  },
  {
    date: '2026-08-29',
    platform: 'Lido',
    severity: 'info',
    actionRequired: false,
    title: 'Lido NEST automated LDO buyback program goes live',
    summary: 'Following execution of Dual Governance Proposal #13 on August 14, 2026, Lido\'s NEST mechanism is now fully active: up to $50K/day (capped at $10M/year) of protocol staking revenue above a $109K/day threshold is used to buy back LDO, currently routed to the DAO treasury. This confirms the governance vote flagged earlier this month has passed and gone live — no action needed for your stETH/LDO position.',
    sourceUrl: 'https://ambcrypto.com/lido-launches-10m-ldo-buyback-but-nest-may-remain-idle-until/'
  },
  {
    date: '2026-08-29',
    platform: 'Kamino',
    severity: 'warning',
    actionRequired: false,
    title: 'Large KMNO token unlock (229.17M tokens) scheduled for Aug 30, 2026',
    summary: 'Kamino\'s next scheduled unlock releases 229.17M KMNO (83.33M to core contributors, 145.83M to stakeholders/advisors) on August 30, 2026 — a sizeable release that could add sell pressure and short-term price volatility around KMNO. This doesn\'t affect your lending/vault principal directly, but is worth watching if you hold or are evaluating KMNO exposure.',
    sourceUrl: 'https://tokenomist.ai/kamino'
  },
  {
    date: '2026-08-29',
    platform: 'Hot Wallet / NEAR Staking',
    severity: 'info',
    actionRequired: false,
    title: 'NEAR Protocol launches AI-focused staking models (IronClaw, NEAR AI staking)',
    summary: 'On August 19, 2026 NEAR rolled out two new staking products that convert token commitments into AI compute/hosting credits instead of validator rewards, covering 43 AI models including ones from Anthropic, OpenAI and Google. This is a new, optional use case for staked NEAR alongside standard validator staking through Hot Wallet — no action needed, but worth knowing the protocol is diversifying what staked NEAR can be used for.',
    sourceUrl: 'https://en.cryptonomist.ch/2026/08/19/near-protocol-staking-ai/'
  },
  {
    date: '2026-08-29',
    platform: 'Sanctum',
    severity: 'info',
    actionRequired: false,
    title: 'Sanctum becomes Solana\'s top-TVL protocol, surpassing Jupiter (~$1.66B)',
    summary: 'Sanctum\'s liquid staking TVL climbed to roughly $1.66B in late August 2026, overtaking Jupiter\'s DEX aggregation business to become the top protocol by TVL on Solana — reportedly the first time a liquid staking protocol has done so. This is a strong health/adoption signal for the protocol underlying your Sanctum position; no action needed.',
    sourceUrl: 'https://en.cryptonomist.ch/2026/08/28/sanctum-top-protocol-solana/'
  },
  {
    date: '2026-09-04',
    platform: 'GMX',
    severity: 'warning',
    actionRequired: false,
    title: 'GMX V2.2 upgrade overhauls price-impact and liquidation mechanics',
    summary: 'GMX shipped V2.2 to its synthetics contracts on September 3, 2026, redesigning how price impact is calculated (impact from position increases is now stored and charged when the position closes, instead of immediately) and splitting liquidation thresholds from leverage limits. If you trade perps or hold GM/GLV liquidity, acceptablePrice settings now need more slack than before, and GM token pricing accounts for a new "lendable" impact-pool buffer.',
    sourceUrl: 'https://github.com/gmx-io/gmx-synthetics/blob/main/changelogs/v2.2.md'
  },
  {
    date: '2026-09-04',
    platform: 'Sanctum',
    severity: 'warning',
    actionRequired: false,
    title: 'CLOUD-008 proposal: burn 259M CLOUD tokens (25% of supply) and rename ticker to SANC',
    summary: 'A governance proposal posted September 2, 2026 on Sanctum\'s forum would burn the entire 259M-token Community Reserve (cutting max supply by roughly 25%, to ~741M) and rename the CLOUD ticker to SANC for better exchange searchability. It\'s still in forum-review stage with no on-chain vote scheduled yet, so no action is needed now, but it would meaningfully change CLOUD tokenomics if it passes.',
    sourceUrl: 'https://research.sanctum.so/t/cloud-008-should-sanctum-burn-1-4-of-total-cloud-supply/2001'
  }
];
