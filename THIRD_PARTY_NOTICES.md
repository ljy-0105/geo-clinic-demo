# Third-party sources and notices

## Workspace visual references and Lucide icons

`web/assets/icons/*.svg` are unmodified local SVGs from Lucide at commit
`164efbaf879fb29f55d88047efd49fc7725f53ab`:
https://github.com/lucide-icons/lucide . Full ISC license and Feather MIT notices
are included in `vendor/lucide-LICENSE.txt`. `core.js:uiIcon` displays these
local assets as CSS masks. No icon font, CDN or third-party runtime is loaded.

The workspace layout was informed by shadcn/ui `section-cards.tsx` and
`app-sidebar.tsx` at `055aa6b7837b1808456a24beb4c97a677864aa82` (MIT), and Tabler
`core/scss/ui/_empty.scss` / `_cards.scss` at
`c799164043e1d16302ef1375f8b23dc1002a8bde` (MIT). No React, Tailwind, Bootstrap,
or upstream component implementation is bundled. The native HTML/CSS layout,
Chinese copy, business states and charts are this project's adaptation.
Exact links and selection rationale are in the UI research record.

## Daily scheduling and web selector sources

`vendor/schedule.py` is the unmodified schedule 1.2.2 module, MIT, Daniel Bader,
pinned to `82a43db1b938d8fdf60103bd41f329e06c8d3651`:
https://github.com/dbader/schedule . Full license: `vendor/schedule-LICENSE.txt`.
SHA-256: `b0c93f8ee84cbb8dbb98bcb8284864f4ea04012fdbc216de13f8ad2141d09efa`.

`vendor/ai-chat-sites.json` is the unmodified site selector configuration from
gyaoshi/ai-chat-cli, MIT, Copyright (c) 2026 gyaoshi, pinned to
`a8a806f6fb39423ac8e679d1b91c03ec2f641d47`:
https://github.com/gyaoshi/ai-chat-cli . Full license: `vendor/ai-chat-LICENSE.txt`.
`daily_browser.py` adapts narrow selectors and the visible generation/stop-control
checks from `ai_chat_cli/browser.py:is_generating`, with strict completion gates,
fresh conversations, separate profiles, no clipboard permissions and no automatic
resubmission. Login and live completion checks on this machine remain unverified.
The site configuration includes other upstream platforms; the application only
uses the three explicitly selected by the user.

No geo-data-engine or OneGlanse implementation is copied. Their source was read
for comparison; collection questions are never extended with an extraction prompt.
Optional Playwright and greenlet are pinned in `requirements-browser.txt`.

## claude-seo

Source: https://github.com/AgriciDaniel/claude-seo

Pinned commit: `468ed5b0d9e3249394783710e54abb02837e326b` (2.6.2).

`web/js/site-audit-engine.js` adapts selected deterministic checks and check IDs
from `scripts/page_checks.py`: title/description, duplicate metadata, H1,
canonical, noindex, viewport, image alt, JSON-LD syntax, and the explicit
not-checked distinction. The browser implementation uses inert template parsing,
Chinese labels, selected rules rather than all 47 upstream checks, and adds a
store-specific snapshot adapter. Local NAP comparison design is informed by
`skills/seo-local/SKILL.md`; baseline/compare design by `scripts/drift_*.py`.

`web/js/operations.js` and `web/js/views-operations.js` use the content-brief
structure (question/intent, supported facts, evidence gaps, author/reviewer)
informed by `skills/seo-content-brief/SKILL.md` and
`skills/seo-content/SKILL.md` at the same pinned commit. The Chinese templates
are adapted from this project's `geomon/prompts.py`. No GEOInflow components,
360 commercial code, branding or graphics are copied.

No complete upstream Python runtime, FLOW prompt materials or Wikipedia-derived
CC BY-SA phrase lists are bundled into the website. This notice covers the
adapted MIT code and documentation above, not a claim about all upstream assets.

MIT License

Copyright (c) 2026 agricidaniel
Copyright (c) 2026 puneetindersingh (seo-content-brief)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
