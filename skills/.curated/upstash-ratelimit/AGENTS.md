# Upstash Rate Limiting

**Version 1.0.0**  
Upstash Rate Limiting Best Practices  
June 2026

> **Note:**  
> This document is mainly for agents and LLMs to follow when maintaining,  
> generating, or refactoring codebases. Humans may also find it useful,  
> but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive rate limiting guide using `@upstash/ratelimit` for serverless and edge environments. Contains 6 rules across 3 categories, prioritized by impact from critical (connection & async promises) to high/medium (algorithm selection, caching, timeouts, deny lists). Each rule includes detailed explanations, real-world examples comparing incorrect vs. correct implementations, and specific impact metrics to guide automated code review and generation.

---

## Table of Contents

1. [Connection & Setup](references/_sections.md#1-connection-&-setup) — **CRITICAL**
   - 1.1 [Lazily Initialize Connection Clients](references/setup-lazy-initialization.md) — CRITICAL (prevents static analysis build failures when environment variables are missing)
   - 1.2 [Await Pending Promises in Serverless Environments](references/setup-await-pending-promises.md) — CRITICAL (prevents background tasks like analytics from being cut off on execution termination)
2. [Algorithm Selection](references/_sections.md#2-algorithm-selection) — **HIGH**
   - 2.1 [Prefer Sliding Window for Boundary Accuracy](references/algo-sliding-window-over-fixed.md) — HIGH (prevents clients from bypassing limits through rapid bursts near window boundaries)
3. [Features & Optimization](references/_sections.md#3-features-&-optimization) — **HIGH**
   - 3.1 [Enable Ephemeral Caching for Hot Containers](references/feat-ephemeral-cache.md) — HIGH (prevents database query storms and reduces API costs under brute-force attacks)
   - 3.2 [Configure Client-Side Timeouts for Fallback](references/feat-graceful-timeout.md) — HIGH (ensures application availability and prevents API lockouts during network latency or database outages)
   - 3.3 [Enable Protection Deny Lists](references/feat-deny-list-protection.md) — MEDIUM (automatically blocks malicious IPs and spam user agents)

---

## References

1. [https://upstash.com/docs/redis/sdks/ratelimit-ts/overview](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
2. [https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms](https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms)
3. [https://upstash.com/docs/redis/sdks/ratelimit-ts/features](https://upstash.com/docs/redis/sdks/ratelimit-ts/features)
4. [https://upstash.com/docs/redis/sdks/ratelimit-ts/traffic-protection](https://upstash.com/docs/redis/sdks/ratelimit-ts/traffic-protection)

---

## Source Files

This document was compiled from individual reference files. For detailed editing or extension:

| File                                                                                         | Description                               |
| -------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [references/setup-lazy-initialization.md](references/setup-lazy-initialization.md)           | Lazy initialization guidelines            |
| [references/setup-await-pending-promises.md](references/setup-await-pending-promises.md)     | Awaiting pending promises in serverless   |
| [references/algo-sliding-window-over-fixed.md](references/algo-sliding-window-over-fixed.md) | Sliding window vs fixed window algorithms |
| [references/feat-ephemeral-cache.md](references/feat-ephemeral-cache.md)                     | Ephemeral cache optimization              |
| [references/feat-graceful-timeout.md](references/feat-graceful-timeout.md)                   | Timeout fallback settings                 |
| [references/feat-deny-list-protection.md](references/feat-deny-list-protection.md)           | Traffic protection and blocklists         |
| [SKILL.md](SKILL.md)                                                                         | Quick reference entry point               |
