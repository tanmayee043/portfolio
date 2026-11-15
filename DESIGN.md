# Design system: Portfolio

Shares its colours and type with the Crypto Streaming dashboard (`crypto-streaming-platform/DESIGN.md`, adapted from Kraken), so the portfolio and its projects read as one body of work.

## Idea

The checks my systems run on their own data become the page's proof. Each claim sits next to the test behind it, and the visitor can try to fool the Receipt IQ validator themselves.

## Composition

- One column, 560 px wide, starting at 22% of the viewport width. Below 1000 px it starts at the page margin.
- Screenshots and tables may run wider than the column, from the same left edge. Nothing spans the full width.
- Sections are separated by space only. Lines appear only inside tables and form fields.

## Colour

Tokens are at the top of `src/styles/global.css`, with dark values following the operating system. Purple marks the primary action, hover and focus. Green, red and amber are for validator verdicts, always with a word.

## Type

IBM Plex Sans in two main weights (400, 500), with 600 for emphasis. Sizes: headline 6vw, section title 36 px, body 18 px, small 15–16 px. Numbers use tabular figures.

## Motion

Section parts rise once as they enter, the dashboard screenshots crossfade slowly, and controls respond on hover and press. Reduced-motion settings drop the travel and the crossfade, and everything is visible without JavaScript.
