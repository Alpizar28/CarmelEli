## Work Plan

1. [x] Implement a 25/75 split editor layout with a real live preview pane in the admin content editor.
2. [x] Add a production-faithful preview runtime (iframe route) that updates in real time from editor changes.
3. [x] Add section-focused visual feedback in preview when editing specific sections.
4. [x] Apply the same live preview experience to blog post editing, including text and image URL updates.
5. [x] Force the entire admin UI to English and improve readability (slightly larger fonts + darker text).
6. [x] Validate the changes with a full build.

## Evidence

- `npm run build` passed successfully.
- Preview route is available at `/admin/preview` and fed in real time from admin editors.
