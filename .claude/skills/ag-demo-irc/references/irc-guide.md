# OMP IRC Communication Reference

This guide details the low-level mechanics of the Inter-Agent Communication (IRC) bus in the `omp` harness.

## 1. Addressing and Slot Prefixes

Each agent in the process gets assigned a slot number. The main session orchestrator is always `0-Main`.
Subagents are assigned slots incrementally based on their task array index.

- `0-Main`: Parent agent / Orchestrator
- `1-TaskID`: First subagent spawned in the `task` call
- `2-TaskID`: Second subagent spawned in the `task` call
- `N-TaskID`: Nth subagent

To send a message, query the list of active peers using:

```json
{
  "op": "list"
}
```

Then, send a message to a specific peer:

```json
{
  "op": "send",
  "to": "1-AuthMap",
  "message": "Hello"
}
```

## 2. Asymmetric Handshake

Because subagents terminate immediately when their assignment completes, there is a risk of a race condition:
If `RouteAudit` finishes late and tries to DM `AuthMap` after `AuthMap` has already returned and exited, the message will fail with `peer is not available via IRC`.

To prevent this:

1.  **Respondent stays alive**: The agent producing the data (`AuthMap`) must be instructed in its prompt to keep running/polling or waiting until it is contacted.
2.  **Sender queries first**: The consuming agent (`RouteAudit`) contacts the respondent as early as possible.
3.  **Respondent terminates**: Once the consuming agent has successfully retrieved the data, it can signal the respondent that it is okay to exit, or the respondent can naturally timeout or complete its secondary goals.

## 3. Configuration Gate

IRC features are controlled by the `irc.enabled` boolean in `.omp/settings.json` or `~/.omp/agent/settings.json`.

```json
{
  "irc": {
    "enabled": true
  }
}
```

If `irc.enabled` is `false`, calling the `irc` tool will throw an error.
