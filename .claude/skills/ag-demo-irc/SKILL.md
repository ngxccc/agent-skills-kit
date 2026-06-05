---
name: ag-demo-irc
description: "Demo of parallel subagents and inter-agent IRC communication. Use when configuring tasks, testing multi-agent systems, or using synchronous IRC DMs."
license: MIT
argument-hint: "[no-args]"
metadata:
  author: Team
  version: "1.0.0"
---

# Parallel Agents & IRC Communication Demo

This skill demonstrates how to use the `task` tool to spawn parallel subagents and coordinate them in real-time using the `irc` messaging tool.

## Concept Overview

When a parent agent spawns multiple tasks using the `task` tool, they execute concurrently. If one subagent needs data or coordination from another, it can send synchronous direct messages over a local IRC-like bus using the `irc` tool.

```
+-------------------------------------------------------------+
|                        0-Main Agent                         |
+-------------------------------------------------------------+
                               |
                               | (Spawns task tool)
                               v
               +-------------------------------+
               |  Parallel Subagents Spawner   |
               +-------------------------------+
                /                             \
               /                               \
              v                                 v
    +-------------------+             +-------------------+
    |     1-AuthMap     |             |   2-RouteAudit    |
    +-------------------+             +-------------------+
              ^                                 |
              |       (Synchronous IRC DM)      |
              +=================================+
```

## Worked Example: Two Subagents, One DMs the Other

### 1. Parent Spawning Code

The parent agent defines two tasks and instructs them to coordinate via IRC:

```json
{
  "agent": "explore",
  "tasks": [
    {
      "id": "AuthMap",
      "assignment": "Map token issuance paths under src/auth/. Stay responsive on IRC until RouteAudit pings you."
    },
    {
      "id": "RouteAudit",
      "assignment": "List protected routes under src/routes/. DM 1-AuthMap for the live issuer list before finalizing."
    }
  ]
}
```

### 2. Inside RouteAudit (The Sender)

The sender calls `irc` to request information from `1-AuthMap`:

```json
{
  "op": "send",
  "to": "1-AuthMap",
  "message": "Which issuer does /api/v2 use?"
}
```

### 3. Inside AuthMap (The Receiver / Respondent)

`1-AuthMap` receives the message on its side-channel turn, processes the request, and returns the response.

## Simulation Script

Run the simulation script to visualize the message-passing timeline and see the console log output of the asymmetric handshake:

```bash
bun run .claude/skills/ag-demo-irc/scripts/simulate-irc.mjs
```
