# Comprehensive Prose Component Tree

**기준**: 인터넷 리서치 기반 (Tailwind Typography, Ghost CMS, Medium, Substack, W3C WAI)

---

## 🌲 Complete Tree Structure

```
Prose
├── Layout
│   ├── Section
│   │   ├── Centered
│   │   ├── Full
│   │   └── Split
│   ├── Document
│   │   ├── Narrow
│   │   ├── Default
│   │   ├── Wide
│   │   └── Full
│   ├── Container
│   │   ├── Article
│   │   ├── Aside
│   │   └── Footer
│   └── Divider
│       ├── Default
│       ├── Thick
│       ├── Dashed
│       ├── Dotted
│       └── Spacer
│
├── Text
│   ├── Title
│   │   ├── xl
│   │   ├── lg
│   │   ├── md
│   │   ├── sm
│   │   ├── xs
│   │   └── xxs
│   ├── Body
│   │   ├── Default
│   │   ├── Small
│   │   └── Lead
│   ├── Note
│   │   ├── Default
│   │   ├── Small
│   │   └── Footnote
│   ├── Code
│   │   ├── Inline
│   │   └── Kbd
│   ├── Emphasis
│   │   ├── Strong
│   │   ├── Em
│   │   ├── Mark
│   │   ├── Underline
│   │   └── Strikethrough
│   └── Link
│       ├── Default
│       ├── External
│       └── Anchor
│
├── Block
│   ├── Blockquote
│   │   ├── Default
│   │   ├── Callout
│   │   ├── Pullquote
│   │   └── Cite
│   ├── CodeBlock
│   │   ├── Default
│   │   ├── WithLineNumbers
│   │   ├── WithHighlight
│   │   ├── WithFilename
│   │   └── Diff
│   ├── Alert
│   │   ├── Info
│   │   ├── Success
│   │   ├── Warning
│   │   ├── Error
│   │   └── Tip
│   ├── Callout
│   │   ├── Note
│   │   ├── Important
│   │   ├── Caution
│   │   └── Aside
│   └── Card
│       ├── Default
│       ├── WithImage
│       ├── Bookmark
│       └── Feature
│
├── List
│   ├── Ordered
│   │   ├── Default
│   │   ├── LetterLower
│   │   ├── LetterUpper
│   │   ├── RomanLower
│   │   └── RomanUpper
│   ├── Unordered
│   │   ├── Disc
│   │   ├── Circle
│   │   ├── Square
│   │   └── Dash
│   ├── Task
│   │   ├── Unchecked
│   │   ├── Checked
│   │   └── InProgress
│   └── Description
│       └── Default
│
├── Media
│   ├── Image
│   │   ├── Default
│   │   ├── WithCaption
│   │   ├── Full
│   │   ├── Wide
│   │   ├── Rounded
│   │   └── Circle
│   ├── Gallery
│   │   ├── Grid
│   │   ├── Masonry
│   │   ├── Carousel
│   │   └── Lightbox
│   ├── Video
│   │   ├── Native
│   │   ├── YouTube
│   │   ├── Vimeo
│   │   └── WithCaption
│   ├── Audio
│   │   ├── Native
│   │   ├── Podcast
│   │   ├── Spotify
│   │   └── SoundCloud
│   └── Figure
│       ├── Default
│       ├── WithCredit
│       └── Numbered
│
├── Data
│   ├── Table
│   │   ├── Simple
│   │   ├── Striped
│   │   ├── Bordered
│   │   ├── Hoverable
│   │   ├── Compact
│   │   ├── Responsive
│   │   └── WithCaption
│   ├── Stats
│   │   ├── Simple
│   │   ├── WithChange
│   │   ├── WithIcon
│   │   └── Grid
│   └── Chart
│       ├── Bar
│       ├── Line
│       └── Pie
│
├── Interactive
│   ├── Accordion
│   │   ├── Single
│   │   └── Multiple
│   ├── Tabs
│   │   ├── Default
│   │   ├── Pills
│   │   └── Underline
│   ├── Toggle
│   │   ├── Details
│   │   └── Expandable
│   ├── Button
│   │   ├── Primary
│   │   ├── Secondary
│   │   ├── Outline
│   │   └── Link
│   └── Form
│       ├── Input
│       ├── Textarea
│       ├── Select
│       ├── Checkbox
│       └── Radio
│
├── Embed
│   ├── Social
│   │   ├── Twitter
│   │   ├── Instagram
│   │   ├── Facebook
│   │   ├── LinkedIn
│   │   └── Threads
│   ├── Code
│   │   ├── GitHub
│   │   ├── CodePen
│   │   ├── JSFiddle
│   │   └── CodeSandbox
│   ├── Document
│   │   ├── PDF
│   │   ├── GoogleDocs
│   │   ├── Notion
│   │   └── Airtable
│   └── Map
│       ├── GoogleMaps
│       └── MapBox
│
├── Navigation
│   ├── TableOfContents
│   │   ├── Sticky
│   │   ├── Floating
│   │   └── Inline
│   ├── Breadcrumb
│   │   ├── Default
│   │   └── WithIcons
│   ├── Pagination
│   │   ├── Numbered
│   │   ├── PrevNext
│   │   └── Infinite
│   └── Anchor
│       ├── HashLink
│       └── SmoothScroll
│
├── Metadata
│   ├── Author
│   │   ├── Simple
│   │   ├── WithAvatar
│   │   ├── WithBio
│   │   └── Multiple
│   ├── Date
│   │   ├── Published
│   │   ├── Updated
│   │   ├── Relative
│   │   └── Range
│   ├── ReadingTime
│   │   ├── Minutes
│   │   └── WithProgress
│   ├── Tags
│   │   ├── Inline
│   │   ├── Pills
│   │   └── Badges
│   └── ShareButtons
│       ├── Social
│       ├── Copy
│       └── Print
│
├── Special
│   ├── Footnote
│   │   ├── Inline
│   │   ├── Sidebar
│   │   └── Bottom
│   ├── Sidenote
│   │   ├── Left
│   │   └── Right
│   ├── Comment
│   │   ├── Inline
│   │   ├── Thread
│   │   └── Annotation
│   ├── Newsletter
│   │   ├── Inline
│   │   ├── Popup
│   │   └── Sticky
│   └── Paywall
│       ├── Blur
│       ├── Truncate
│       └── Preview
│
└── Theme
    ├── Size
    │   ├── sm
    │   ├── base
    │   ├── lg
    │   ├── xl
    │   └── 2xl
    ├── Color
    │   ├── Default
    │   ├── Invert
    │   ├── Neutral
    │   ├── Warm
    │   └── Cool
    └── Density
        ├── Compact
        ├── Default
        └── Comfortable
```
