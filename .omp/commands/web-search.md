---
description: Perform web research or read URLs using the most optimal network tool (web_search, read, or browser)
---

Process the web search query or URLs provided in the arguments:

$@

To reach the network, you must determine and use the most optimal tool based on the following criteria:

### Network Tool Matrix

| Tool                     | Usage Scenario                                           | Optimization Notes                                                                                                |
| :----------------------- | :------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| **`web_search`**         | You need to find a fact but do not know the exact URL.   | Returns a synthesized answer with source URLs.                                                                    |
| **`read` (against URL)** | You have the URL and the page content is static.         | **Preferred choice.** Prepend `https://r.jina.ai/` to the URL. It is faster, cheaper, and returns clean markdown. |
| **`browser`**            | The page is dynamic (SPA, JS-heavy, needs login/clicks). | **Mandatory for dynamic content.** Opens a real Chromium tab using Puppeteer.                                     |

---

### Step-by-Step Execution Plan

#### Step 1: Analyze Input

Decide if the input contains a search query or one/more specific URLs.

#### Step 2: Execute Search (if query)

- Call `web_search` with the query. If a specific timeframe is useful, provide the `recency` parameter.

#### Step 3: Read Content (if URL)

- Check if the URL target page is **Static** or **Dynamic**:
  - **Static Pages (Default)**: Call `read` tool. Prepend `https://r.jina.ai/` to the URL (e.g. `read "https://r.jina.ai/https://example.com"`). If Jina AI fails (timeouts or 5xx), fallback immediately to the original URL.
  - **Dynamic Pages (JS-heavy, login, clicks required)**: Call `browser` tool.
    1. Call `browser open name="search_tab" url="<URL>"`.
    2. Use `browser run name="search_tab"` with `await tab.extract("markdown")` to fetch the loaded DOM text.
    3. Call `browser close name="search_tab"`.

---

### Output Format

Present your findings clearly:

- **Search Query / URL**: [The query or URL processed]
- **Tool Selected**: [web_search | read | browser] (with rationale)
- **Extracted Content / Summary**: [Bullet points or markdown summary of findings]
- **Sources / References**: [List of source URLs visited/returned]
