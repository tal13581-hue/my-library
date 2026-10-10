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
  },
  {
    date: '2026-09-08',
    platform: 'Aerodrome / veAERO',
    severity: 'warning',
    actionRequired: false,
    title: 'Aero (unified Ethereum liquidity layer) opens $400K public audit contest ahead of September mainnet launch',
    summary: 'Aerodrome/Velodrome\'s merged "Aero" protocol released its Ethereum-layer codebase and kicked off a 3-week, $400K public audit contest with Sherlock (Aug 31 - Sept 11, 2026), the last security checkpoint before its planned September mainnet launch. This is the concrete next step toward the token/veNFT migration flagged earlier this month for your veAERO position — no action yet since migration tooling still hasn\'t shipped, but worth watching closely as launch approaches.',
    sourceUrl: 'https://cryptobriefing.com/aerodrome-finance-400k-audit-contest-sherlock/'
  },
  {
    date: '2026-09-15',
    platform: 'Aerodrome / veAERO',
    severity: 'warning',
    actionRequired: false,
    title: 'Aero audit contest concludes with no critical or high-severity vulnerabilities found',
    summary: 'The $400K public Sherlock audit contest for Aero\'s core contracts concluded September 11, 2026, and alongside months of prior private reviews (ChainSecurity, Sherlock), no critical or high-severity vulnerabilities were identified. This clears the last announced security checkpoint before the reported September mainnet launch, meaning the veNFT/token migration for your locked veAERO position could become actionable soon — migration tooling still hasn\'t shipped, so no action is needed today, but watch for the official migration announcement.',
    sourceUrl: 'https://cryptobriefing.com/aero-core-contracts-audits-conclude/'
  },
  {
    date: '2026-09-19',
    platform: 'Sanctum',
    severity: 'warning',
    actionRequired: false,
    title: 'CLOUD-008 burn/rename vote goes live via MetaDAO futarchy, resolves today',
    summary: 'The CLOUD-008 proposal (burn the 259M-token Community Reserve, cut supply ~25%, rename ticker to SANC) moved from forum review straight to a live on-chain vote: a 72-hour MetaDAO futarchy market opened Sept 16 at 08:12 UTC and resolves around Sept 19, decided by whichever conditional market is priced higher at expiry. No action is needed for your Sanctum position, but CLOUD/SANC tokenomics could change as soon as the market resolves today.',
    sourceUrl: 'https://solanacompass.com/news/sanctum-opens-72-hour-metadao-vote-to-burn-259-million-cloud-tokens'
  },
  {
    date: '2026-09-19',
    platform: 'Lido',
    severity: 'info',
    actionRequired: false,
    title: 'NEST LDO buyback mechanism hits negative budget, skips a scheduled purchase',
    summary: 'Lido\'s NEST buyback contract recorded a negative cumulative budget of roughly $517,000 at 00:00 UTC on Sept 9 and skipped that day\'s scheduled LDO purchase, since the mechanism must rebuild its reserve from future revenue surplus before buying again. This shows the buyback program (live since Aug 29) is more fragile than advertised amid Lido\'s slowing share of new ETH staking growth — a tokenomics detail worth knowing for your stETH/LDO position, though no action is needed.',
    sourceUrl: 'https://cryptoslate.com/ethereums-institutional-staking-boom-is-growing-but-lidos-share-is-shrinking/'
  },
  {
    date: '2026-09-24',
    platform: 'Sanctum',
    severity: 'info',
    actionRequired: false,
    title: 'CLOUD-008 burn/rename vote passes: 259M CLOUD burned, ticker renamed to SANC',
    summary: 'The MetaDAO futarchy vote flagged last week resolved on Sept 19, 2026: Sanctum permanently burned its entire 259.32M-token Community Reserve, cutting total CLOUD supply from ~1B to ~741M, and the ticker will be renamed to SANC (a metadata-only change with no effect on the mint address or your holdings). This confirms a meaningful deflationary tokenomics change for your Sanctum position — no action is needed.',
    sourceUrl: 'https://solanacompass.com/news/sanctum-governance-vote-passes-259m-cloud-tokens-to-be-burned-ticker-renames-to-sanc'
  },
  {
    date: '2026-09-24',
    platform: 'Kamino',
    severity: 'warning',
    actionRequired: false,
    title: 'Next KMNO token unlock scheduled for Sept 30, 2026',
    summary: 'Kamino\'s next scheduled cliff unlock releases roughly 229.17M KMNO (~$8.41M, ~2.3% of supply) on September 30, 2026, per Tokenomist\'s vesting schedule. As with the equivalent Aug 30 unlock already flagged, this doesn\'t affect your lending/vault principal directly but could add short-term sell pressure/volatility if you hold or are evaluating KMNO exposure.',
    sourceUrl: 'https://tokenomist.ai/kamino/unlock-events'
  },
  {
    date: '2026-09-24',
    platform: 'Kamino',
    severity: 'info',
    actionRequired: false,
    title: 'Kamino appoints Michael Weisz as CEO',
    summary: 'Kamino Finance named Michael Weisz, who brings fintech industry experience, as CEO on September 15, 2026. A leadership change at a protocol you hold lending/vault positions with is worth knowing about even though it requires no action from you today.',
    sourceUrl: 'https://coinmarketcap.com/cmc-ai/kamino-finance/latest-updates/'
  },
  {
    date: '2026-09-24',
    platform: 'GMX',
    severity: 'info',
    actionRequired: false,
    title: 'GMX launches 24/7 QQQ/USD and SPY/USD perps (TradFi expansion wave 1)',
    summary: 'GMX went live with perpetual futures on the Invesco QQQ Trust and SPDR S&P 500 ETF, tradable 24/7 including outside US market hours, as the first wave of a TradFi asset expansion on Arbitrum. This broadens what GM/GLV liquidity providers are exposed to and signals GMX diversifying beyond crypto-native perps — no action needed for your position.',
    sourceUrl: 'https://gmxio.substack.com/p/247-qqqusd-and-spyusd-perps-are-now'
  },
  {
    date: '2026-09-25',
    platform: 'Kamino',
    severity: 'warning',
    actionRequired: false,
    title: 'Switchboard oracle shutdown forces Kamino to migrate price feeds by Sept 25 (today)',
    summary: 'Switchboard announced Sept 19, 2026 that its entire oracle network is deprecated, with support ending Sept 25 — Kamino Finance was explicitly named among affected protocols (alongside Jito, MarginFi, Drift) that rely on its feeds and must cut over to Pyth or RedStone in time. A rushed oracle migration is a real risk for a lending protocol since stale or incorrect prices can trigger bad liquidations, so it is worth confirming Kamino completed a clean migration; nothing for you to do directly since this is protocol-side infrastructure.',
    sourceUrl: 'https://solanacompass.com/news/switchboard-oracle-protocol-shuts-down-giving-solana-defi-six-days-to-migrate'
  },
  {
    date: '2026-09-25',
    platform: 'Kamino',
    severity: 'info',
    actionRequired: false,
    title: 'Kamino expands into institutional and fixed-rate lending products',
    summary: 'In mid-September 2026 Kamino launched two new product lines: Galaxy-curated institutional USDC/USDT vaults (live Sept 17) with professional risk management, and its first Fixed Rate Multiply vault (live Sept 21, built with Figure/HastraFi) offering a locked 5.3% 30-day borrow rate on an AUTO/wYLDS strategy. This broadens what is available on the protocol your lending/vault position sits on — no action needed, but the new vault types may be worth evaluating.',
    sourceUrl: 'https://solanacompass.com/news/galaxy-digital-launches-institutional-usdc-and-usdt-vaults-on-kamino-finance'
  },
  {
    date: '2026-09-25',
    platform: 'Pyth',
    severity: 'info',
    actionRequired: false,
    title: 'Pyth approved as external distributor of Nasdaq Basic real-time equity data',
    summary: 'On Sept 22, 2026 Pyth was approved to distribute Nasdaq Basic real-time U.S. equity data through its Data Marketplace — its second Nasdaq data deal after a June 2026 TotalView agreement — and PYTH rose over 8% on the news. This is a strong institutional-adoption signal for the oracle network underlying your Pyth position, arriving right as Switchboard\'s shutdown pushes more Solana protocols toward Pyth as well; no action is needed.',
    sourceUrl: 'https://www.kucoin.com/blog/pyth-network-nasdaq-basic-blockchain-market-data-partnership'
  },
  {
    date: '2026-09-26',
    platform: 'Pyth',
    severity: 'warning',
    actionRequired: true,
    title: 'Gate exchange delists PYTH staking product — deadline Oct 8, 2026',
    summary: 'Gate announced it is delisting its PYTH (along with ZETA and DYDX) staking/earn product effective October 8, 2026, with new subscriptions already suspended. If you have PYTH staked through Gate\'s earn product, manually redeem it before the deadline to avoid being swept into automatic redemption and temporary illiquidity.',
    sourceUrl: 'https://www.gate.com/announcements/article/51533'
  },
  {
    date: '2026-09-26',
    platform: 'Aerodrome / veAERO',
    severity: 'warning',
    actionRequired: false,
    title: 'Aero confirms mainnet launch date: October 21, 2026, across seven chains',
    summary: 'Aerodrome/Velodrome\'s merged "Aero" protocol confirmed a concrete multi-chain launch date of October 21, 2026 (8pm EDT), deploying to seven chains including Base, Ethereum Mainnet, Arbitrum, and the newly-added Robinhood Chain. This is the clearest signal yet that the veNFT/token migration for your locked veAERO position could go live around this date — migration tooling still hasn\'t been announced, so no action is needed yet, but this is the date to watch.',
    sourceUrl: 'https://cryptobriefing.com/defi-protocol-aero-set-to-launch-on-oct-21-across-seven-chains/'
  },
  {
    date: '2026-09-28',
    platform: '40acres.finance',
    severity: 'info',
    actionRequired: false,
    title: '40acres hits TVL all-time high, adds Open Cover insurance and a position marketplace',
    summary: '40acres\' "Autumn Harvest" update (Sept 8, 2026) reported all-time-high TVL and loans outstanding, and added a partnership with Open Cover offering up to $600K of insurance coverage on user positions — a new safety net worth considering for your veNFT-backed loan. It also joined the Circle Alliance and is shipping a vote-optimization tool plus a marketplace to buy/sell positions (even with an active loan) across Base and OP. No action is needed, but opting into Open Cover coverage may be worth evaluating.',
    sourceUrl: 'https://40acresfinance.substack.com/p/autumn-harvest-is-here'
  },
  {
    date: '2026-10-01',
    platform: 'Lido',
    severity: 'warning',
    actionRequired: false,
    title: 'Security incident at MetaMask Staking forces emergency exit of Lido-operated ETH validators',
    summary: 'MetaMask disclosed on Oct 1, 2026 a security incident inside its MetaMask Staking (formerly Consensys Staking) validator business and, as a precaution, began exiting its Ethereum validators within the Lido protocol, with withdrawals expected to complete by Oct 7 and full re-entry taking up to ~45 days. MetaMask says it found no direct threat to user wallets and does not hold withdrawal keys, so no action is needed for your stETH position, but it is a real security incident at one of Lido\'s node operators worth watching closely.',
    sourceUrl: 'https://cointelegraph.com/news/metamask-exits-lido-validators-as-it-investigates-security-incident'
  },
  {
    date: '2026-10-01',
    platform: 'Lido',
    severity: 'info',
    actionRequired: false,
    title: 'Lido Dual Governance framework goes live on Ethereum mainnet (Vote #214)',
    summary: 'Lido DAO\'s on-chain Vote #214 passed Sept 27, 2026 with 58.2M LDO participating, activating the Dual Governance framework on mainnet. This gives stETH holders like you a new formal mechanism to contest or delay DAO-approved actions affecting the protocol\'s smart contracts, adding a safeguard layer beyond ordinary LDO voting — no action is needed on your end.',
    sourceUrl: 'https://bitcoinist.com/lido-vote-214-passes-as-dual-governance-moves-onto-ethereum-mainnet/'
  },
  {
    date: '2026-10-02',
    platform: 'Hot Wallet / NEAR Staking',
    severity: 'warning',
    actionRequired: false,
    title: 'NEAR Intents (separate NEAR-ecosystem protocol) hit by $3.8M exploit, NEAR dips ~7.5%',
    summary: 'On Oct 1, 2026, NEAR Intents — a cross-chain swap protocol built on NEAR but unrelated to the Hot Wallet app — disclosed a $3.8M exploit of its own BSC hot-wallet infrastructure and paused cross-chain services, sending NEAR down roughly 7.5%. Your staked NEAR and the Hot Wallet app itself are not implicated, but it is a real security incident in the broader NEAR ecosystem worth knowing about; no action is needed.',
    sourceUrl: 'https://www.coindesk.com/tech/2026/10/01/near-intents-hit-by-usd3-8-million-exploit-as-crypto-s-rough-year-of-hacks-continues'
  },
  {
    date: '2026-10-02',
    platform: 'Sanctum',
    severity: 'info',
    actionRequired: false,
    title: 'Sanctum launches App 2.0 with Squads multisig protection for user funds',
    summary: 'Sanctum shipped a ground-up rebuild of its mobile rewards app on Oct 1, 2026, moving user funds behind a Squads multisig and adding per-second reward tracking plus treasury/supply transparency. This is a meaningful security upgrade for anyone holding a Sanctum position through the app, though no action is needed — existing balances are unaffected.',
    sourceUrl: 'https://solanacompass.com/news/solanas-sanctum-app-20-launches-with-squads-multisig-protection-on-ios-android-and-seeker'
  },
  {
    date: '2026-10-02',
    platform: 'Sanctum',
    severity: 'info',
    actionRequired: false,
    title: 'CLOUD/SANC token burn now confirmed to execute Oct 6, 2026',
    summary: 'The CLOUD-008 burn approved by the Sept 19 MetaDAO vote is now confirmed to execute on-chain on October 6, 2026, permanently removing 259M tokens (~25% of supply) and completing the ticker rename to SANC. This firms up the exact execution date for the governance change already flagged for your Sanctum position — no action needed.',
    sourceUrl: 'https://www.kucoin.com/news/insight/CLOUD/6ab7021b74fd460007c56dae'
  },
  {
    date: '2026-10-04',
    platform: 'Hot Wallet / NEAR Staking',
    severity: 'info',
    actionRequired: false,
    title: 'NEAR Intents exploit fully resolved — full $3.8M recovered from attacker',
    summary: 'Following up on the Oct 1 NEAR Intents exploit already flagged for this position: NEAR Intents GM Alex Shevchenko confirmed on Oct 2-3, 2026 that the attacker returned the entire $3.8M after a 48-hour ultimatum, and the engineering team has closed the investigation. This resolves cleanly and faster than typical DeFi hacks, reinforcing that your staked NEAR and the Hot Wallet app itself were never implicated — no action needed.',
    sourceUrl: 'https://cointelegraph.com/news/near-intents-recovers-entire-stolen-38m-after-ultimatum-to-exploiter'
  },
  {
    date: '2026-10-04',
    platform: 'Aerodrome / veAERO',
    severity: 'warning',
    actionRequired: false,
    title: 'Aero sets Oct 15 xVELO bridge deadline ahead of Oct 21 cross-chain launch',
    summary: 'Ahead of the confirmed Oct 21, 2026 Aero mainnet launch already flagged for your veAERO position, the team set an Oct 15 deadline for xVELO (wrapped VELO) holders to bridge back to OP Mainnet before the merge. This specifically concerns xVELO/VELO holders rather than Base-side veAERO lockers, but it is the first concrete migration deadline tied to the merger — if you hold any VELO/xVELO alongside your veAERO position, bridge before Oct 15.',
    sourceUrl: 'https://www.tokenpost.com/news/business/25133'
  },
  {
    date: '2026-10-04',
    platform: 'Aerodrome / veAERO',
    severity: 'info',
    actionRequired: false,
    title: 'Coinbase to support AERO/VELO token migration Nov 2-4, 2026',
    summary: 'Coinbase announced it will support the post-merger AERO/VELO token migration for a three-day window, Nov 2-4, 2026, following the Oct 21 Aero mainnet launch already flagged for your veAERO position. This only matters if you hold AERO or VELO directly on Coinbase (your locked veAERO NFT position is unaffected) — no action needed yet, but worth noting the window if you do.',
    sourceUrl: 'https://cryptobriefing.com/coinbase-aero-velo-token-migration/'
  },
  {
    date: '2026-10-04',
    platform: 'Kamino',
    severity: 'warning',
    actionRequired: false,
    title: 'Next KMNO token unlock scheduled for Oct 30, 2026',
    summary: 'Kamino\'s next scheduled cliff unlock releases roughly 229.17M KMNO (~$9.27M, ~2.3% of supply) on October 30, 2026, continuing the same monthly unlock pattern already flagged for Aug 30 and Sept 30. This doesn\'t affect your lending/vault principal directly but could add short-term sell pressure/volatility if you hold or are evaluating KMNO exposure.',
    sourceUrl: 'https://cryptobriefing.com/solana-ecosystem-token-unlocks-october-2026/'
  },
  {
    date: '2026-10-10',
    platform: 'Sanctum',
    severity: 'info',
    actionRequired: false,
    title: 'CLOUD-008 burn executed on-chain: ~250M CLOUD burned, ticker now shows as SANC',
    summary: 'The CLOUD-008 burn confirmed for Oct 6, 2026 has now actually executed: Sanctum burned roughly 250M CLOUD from its Community Reserve (slightly under the 259M originally approved), cutting total supply to about 740.7M, and Solscan now shows the token under the renamed SANC ticker. This completes the deflationary tokenomics change already flagged for your Sanctum position — no action needed.',
    sourceUrl: 'https://solanacompass.com/news/sanctum-burns-its-cloud-community-reserve-cutting-token-supply-to-7407-million-as-sanc-ticker-appears'
  }
];