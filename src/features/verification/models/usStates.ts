/**
 * US state directory — code ↔ name 2-way map.
 *
 * Source of truth for the criminal-check form's state-of-residence
 * picker. The persistence contract is **full name** (`"Arizona"`, not
 * `"AZ"`) so the backend record is human-readable and stable across
 * any future picker UI changes that might re-order codes. Persona /
 * Checkr sometimes send back two-letter codes, sometimes the full
 * name, sometimes empty — `normalizeState` collapses all three into
 * the canonical full-name form (or `''` if it can't match).
 */

export type UsState = {
  readonly code: string;
  readonly name: string;
};

/**
 * 50 states + DC. Alphabetical by `name` so the picker reads in
 * natural sort order without an extra `.sort()` call.
 */
export const US_STATES: ReadonlyArray<UsState> = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

// Pre-built lookups keyed by uppercase code and lowercased name so
// matching is case-insensitive without per-call work.
const NAME_BY_CODE: ReadonlyMap<string, string> = new Map(
  US_STATES.map((s) => [s.code, s.name]),
);

const CODE_BY_NAME: ReadonlyMap<string, string> = new Map(
  US_STATES.map((s) => [s.name.toLowerCase(), s.code]),
);

/**
 * Maps anything Persona / Checkr might hand us into the canonical
 * full-name form. Accepts:
 *   - empty / whitespace / null / undefined → `''`
 *   - 2-letter code (`"AZ"` / `"az"`) → matching full name
 *   - full name (`"Arizona"` / `"arizona"`) → canonical capitalization
 *   - anything else → `''` (caller falls back to picker placeholder)
 */
export const normalizeState = (input: string | null | undefined): string => {
  if (!input) {
    return '';
  }
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return '';
  }
  // Try code first (`"az"` → `"Arizona"`).
  const upperCode = trimmed.toUpperCase();
  const matchByCode = NAME_BY_CODE.get(upperCode);
  if (matchByCode) {
    return matchByCode;
  }
  // Then name (`"arizona"` → `"AZ"` → `"Arizona"`).
  const matchByName = CODE_BY_NAME.get(trimmed.toLowerCase());
  if (matchByName) {
    return NAME_BY_CODE.get(matchByName) ?? '';
  }
  return '';
};

/**
 * Convenience for the rare case a caller has a full name and wants
 * the 2-letter code (e.g. for analytics tagging). Returns `''` if the
 * name isn't recognised.
 */
export const toStateCode = (name: string | null | undefined): string => {
  if (!name) {
    return '';
  }
  return CODE_BY_NAME.get(name.trim().toLowerCase()) ?? '';
};
