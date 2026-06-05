#!/usr/bin/env bun

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  magenta: "\x1b[35m",
  gray: "\x1b[90m",
  white: "\x1b[37m"
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.clear();
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}   OMP SUBAGENT PARALLEL IRC COMMUNICATION DEMO     ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}====================================================\n${colors.reset}`);

  console.log(`${colors.yellow}1. [Parent] Spawning parallel subagents via \`task\` tool...${colors.reset}`);
  await sleep(1000);
  console.log(`${colors.blue}   - Slot 1: [1-AuthMap]   Assign: 'Map auth tokens, stay alive on IRC'${colors.reset}`);
  console.log(`${colors.blue}   - Slot 2: [2-RouteAudit] Assign: 'Audit routes, query 1-AuthMap for issuers'${colors.reset}`);
  console.log("");
  await sleep(1500);

  console.log(`${colors.green}2. [1-AuthMap] starting task execution...${colors.reset}`);
  console.log(`${colors.gray}   [1-AuthMap] Mapping src/auth/...${colors.reset}`);
  await sleep(1000);
  console.log(`${colors.green}   [1-AuthMap] Token mapping complete. Entering wait loop for RouteAudit...${colors.reset}`);
  console.log("");
  await sleep(1500);

  console.log(`${colors.magenta}3. [2-RouteAudit] starting route audit...${colors.reset}`);
  console.log(`${colors.gray}   [2-RouteAudit] Found protected route: /api/v2/user${colors.reset}`);
  console.log(`${colors.magenta}   [2-RouteAudit] Need issuer info from AuthMap. Initiating IRC DM...${colors.reset}`);
  await sleep(1500);

  console.log(`${colors.bold}${colors.white}\n>>> IRC TRANSCRIPT:${colors.reset}`);
  console.log(`${colors.cyan}    [2-RouteAudit] ${colors.reset}${colors.white}=> 1-AuthMap: "Which issuer does /api/v2 use?"${colors.reset}`);
  await sleep(1000);
  console.log(`${colors.gray}    (Delivered to slot 1...)${colors.reset}`);
  await sleep(1200);
  console.log(`${colors.yellow}    [1-AuthMap]    ${colors.reset}${colors.white}=> 2-RouteAudit: "Issuer is 'Clerk v4.1'"${colors.reset}`);
  console.log(`${colors.bold}${colors.white}<<< END OF TRANSCRIPT\n${colors.reset}`);
  await sleep(1500);

  console.log(`${colors.magenta}4. [2-RouteAudit] Received issuer information. Resume route audit...${colors.reset}`);
  console.log(`${colors.magenta}   [2-RouteAudit] Route audit completed successfully. Exiting.${colors.reset}`);
  await sleep(1000);
  console.log(`${colors.green}5. [1-AuthMap] Wait loop complete (RouteAudit disconnected). Exiting.${colors.reset}`);
  console.log("");
  await sleep(1500);

  console.log(`${colors.yellow}6. [Parent] Subagent batch returned:${colors.reset}`);
  console.log(`${colors.gray}   - read agent://AuthMap  => Success (mapped 4 token paths)${colors.reset}`);
  console.log(`${colors.gray}   - read agent://RouteAudit => Success (audited /api/v2/user with Clerk v4.1)${colors.reset}`);
  console.log("");
  console.log(`${colors.bold}${colors.green}Demo simulation finished successfully!\n${colors.reset}`);
}

main().catch(console.error);
