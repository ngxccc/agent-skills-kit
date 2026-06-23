# Active MCP Tools Reference List

This reference file contains the exhaustive list of all 79 active Model Context Protocol (MCP) tools available in the OMP environment.

---

## 1. chrome-devtools (29 tools)

Direct model-level control over a hosted Chromium browser tab. Used for interactive web E2E tests, visual audits, and form automation using semantic element `uid`s.

- `mcp__chrome_devtools_hover` (Hover over element by uid)
- `mcp__chrome_devtools_click` (Click on element by uid)
- `mcp__chrome_devtools_drag` (Drag an element onto another element)
- `mcp__chrome_devtools_emulate` (Emulate viewport, network, geolocation, user agent)
- `mcp__chrome_devtools_list_pages` (Get list of open browser pages)
- `mcp__chrome_devtools_upload_file` (Upload a file through a provided element)
- `mcp__chrome_devtools_fill` (Type text or select value on element by uid)
- `mcp__chrome_devtools_type_text` (Type text using keyboard into focused input)
- `mcp__chrome_devtools_take_heapsnapshot` (Capture a heap snapshot of page)
- `mcp__chrome_devtools_take_screenshot` (Take page or element screenshot)
- `mcp__chrome_devtools_wait_for` (Wait for text to appear on page)
- `mcp__chrome_devtools_select_page` (Select active page context)
- `mcp__chrome_devtools_handle_dialog` (Accept or dismiss browser dialogs)
- `mcp__chrome_devtools_close_page` (Close browser page by ID)
- `mcp__chrome_devtools_resize_page` (Resize page window dimensions)
- `mcp__chrome_devtools_new_page` (Open new browser tab/load URL)
- `mcp__chrome_devtools_performance_stop_trace` (Stop active performance trace)
- `mcp__chrome_devtools_navigate_page` (Navigate page by URL, back, forward, reload)
- `mcp__chrome_devtools_list_network_requests` (List network requests since last navigation)
- `mcp__chrome_devtools_get_console_message` (Get specific console message)
- `mcp__chrome_devtools_lighthouse_audit` (Run Lighthouse accessibility, SEO, best practices audit)
- `mcp__chrome_devtools_list_console_messages` (List page console messages)
- `mcp__chrome_devtools_evaluate_script` (Evaluate JavaScript function inside page)
- `mcp__chrome_devtools_press_key` (Press a key or key combination)
- `mcp__chrome_devtools_fill_form` (Fill out multiple form elements at once)
- `mcp__chrome_devtools_get_network_request` (Get specific network request details)
- `mcp__chrome_devtools_performance_analyze_insight` (Analyze performance insight traces)
- `mcp__chrome_devtools_performance_start_trace` (Start active performance trace recording)
- `mcp__chrome_devtools_take_snapshot` (Get page a11y tree text snapshot with uids)

---

## 2. fetch (1 tool)

Pulls HTML/JSON content from remote web URLs cleanly.

- `mcp__fetch_fetch` (Fetches a URL and extracts content as markdown)

---

## 3. filesystem (14 tools)

Fine-grained directory listing, file viewing, and modification tools.

- `mcp__filesystem_read_file` (Read complete file contents)
- `mcp__filesystem_read_media_file` (Read media file, returns base64)
- `mcp__filesystem_create_directory` (Create new folder structure)
- `mcp__filesystem_list_directory` (List files and directories in path)
- `mcp__filesystem_move_file` (Move/rename files and folders)
- `mcp__filesystem_directory_tree` (Get recursive tree view of directory)
- `mcp__filesystem_edit_file` (Make line-based edits to a text file)
- `mcp__filesystem_search_files` (Recursively search files matching glob pattern)
- `mcp__filesystem_write_file` (Create/overwrite text file)
- `mcp__filesystem_get_file_info` (Get file metadata: size, dates, permissions)
- `mcp__filesystem_list_allowed_directories` (List paths filesystem server can access)
- `mcp__filesystem_read_multiple_files` (Read multiple files simultaneously)
- `mcp__filesystem_read_text_file` (Read file contents as text with head/tail)
- `mcp__filesystem_list_directory_with_sizes` (List files/dirs including sizes)

---

## 4. github (26 tools)

Full integration with GitHub issues, pull requests, commits, and workflow runs.

- `mcp__github_search_repositories` (Search for GitHub repositories)
- `mcp__github_search_users` (Search for users on GitHub)
- `mcp__github_search_code` (Search for code across GitHub repositories)
- `mcp__github_create_branch` (Create new branch in repo)
- `mcp__github_create_repository` (Create new GitHub repo under account)
- `mcp__github_create_issue` (Create a new issue)
- `mcp__github_fork_repository` (Fork a repository)
- `mcp__github_get_issue` (Get details of specific issue)
- `mcp__github_search_issues` (Search issues and pull requests)
- `mcp__github_update_issue` (Update issue status, assignees, labels)
- `mcp__github_push_files` (Push multiple files in one commit)
- `mcp__github_list_commits` (Get list of commits of a branch)
- `mcp__github_list_issues` (List and filter repository issues)
- `mcp__github_get_pull_request` (Get details of specific pull request)
- `mcp__github_merge_pull_request` (Merge a pull request)
- `mcp__github_add_issue_comment` (Comment on issue/PR)
- `mcp__github_list_pull_requests` (List and filter repository pull requests)
- `mcp__github_create_pull_request` (Create new pull request)
- `mcp__github_get_file_contents` (Get file contents from branch)
- `mcp__github_get_pull_request_reviews` (Get reviews on PR)
- `mcp__github_get_pull_request_comments` (Get review comments on PR)
- `mcp__github_create_pull_request_review` (Create a review on PR)
- `mcp__github_get_pull_request_files` (Get list of files changed in PR)
- `mcp__github_get_pull_request_status` (Get combined status of check runs on PR)
- `mcp__github_create_or_update_file` (Create or update single file)
- `mcp__github_update_pull_request_branch` (Update PR branch with base changes)

---

## 5. memory (9 tools)

Persistent semantic memory storage for saving across-session lessons, context details, and decisions.

- `mcp__memory_read_graph` (Read entire knowledge graph)
- `mcp__memory_delete_relations` (Delete relations from graph)
- `mcp__memory_create_entities` (Create new entities in graph)
- `mcp__memory_delete_observations` (Delete specific observations from entities)
- `mcp__memory_add_observations` (Add new observations to entities)
- `mcp__memory_open_nodes` (Retrieve specific nodes by name)
- `mcp__memory_search_nodes` (Search nodes matching query)
- `mcp__memory_delete_entities` (Delete entities and relations from graph)
- `mcp__memory_create_relations` (Create relations between entities)
