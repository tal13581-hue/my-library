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
const ALERTS = [];
