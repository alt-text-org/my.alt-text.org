My.Alt-Text.org
=====

A static site for handling alt text.

See a preview of some functionality live at [https://my-alt-text-org.glitch.me](https://my-alt-text-org.glitch.me)


Rough Release Roadmap
=====================

Alpha Follow On
---------------

- Initial accessibility work
- Import/Export of local and Mastodon archives
- Hide archive unless it's active
- Aux image download/copy prompt
- Reactive styling for mobile
- Make search a dropdown, opened on image upload/search usage. 
- Allow editing of work items in larger textbox where search is now
- Resizeable work areas
- Search for image without loading
- Move to hyperlegible

Beta
----

- Accessibility
   - Basics
   - Keyboard controls
   - Zoom canvas
   - Option to play sound if hit edge of canvas
- Undo
- Pattern package manager via git, shipped with site
- Name only first then matching body in search
- Filter archive by language, incl user entered
- Filters
  - Ordering
  - Re-arrangeable popup menu 
  - Editable if just search/replace
- Expand editor
- Configuration exposed

Release
-------

- As accessible as possible
- Browser Extensions
- Link for what makes good alt text/resources
- Plugin system
   - Build plugin library separately.
- Paste image with alt text into composer? Needs site-specific, but probably doable in usual sites + mastodon by
  looking for appropriate functions/flags
- Save image and alt to library on right click in extensions
- Description tags, store images in plugin
- Support PDFs
- AI suggestion of crop areas?