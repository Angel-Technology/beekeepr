// Don't burn a round-trip until the user has typed enough for the
// backend's substring match to mean anything. There's no enforced
// minimum on the create-profile handle in the codebase today
// (server-side rules in `checkHandleAvailability`), so 3 is a
// product-side floor matched to typical fuzzy-search behavior. The
// constant lives in `models/` so both the search hook AND the
// SearchResultsList (which suppresses its empty-state for 1–2 char
// queries) can read it without crossing layer boundaries.
export const MIN_QUERY_LENGTH = 3;
