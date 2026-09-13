export interface OrganicResult {
  position: number;
  title: string;
  url: string;
  snippet: string;
}

export interface LocalResult {
  position: number;
  business_name: string;
  rating: number | null;
  reviews: number | null;
  address: string | null;
}

export interface SearchObservation {
  query: string;
  observed_at: string;
  organic_results: OrganicResult[];
  local_results: LocalResult[];
}

export function normalizeObservation(
  query: string,
  raw: any
): SearchObservation {
  const organicResults: OrganicResult[] = (
    raw.organic_results || []
  )
    .slice(0, 10)
    .map((result: any) => ({
      position: result.position || 0,
      title: result.title || "",
      url: result.link || "",
      snippet: result.snippet || ""
    }));

  const localResults: LocalResult[] = (
    raw.local_results || raw.local_map_results || []
  )
    .slice(0, 10)
    .map((result: any, index: number) => ({
      position: result.position || index + 1,
      business_name:
        result.title ||
        result.name ||
        "Unknown Business",
      rating:
        typeof result.rating === "number"
          ? result.rating
          : null,
      reviews:
        typeof result.reviews === "number"
          ? result.reviews
          : null,
      address:
        result.address ||
        result.address_line ||
        null
    }));

  return {
    query,
    observed_at: new Date().toISOString(),
    organic_results: organicResults,
    local_results: localResults
  };
}

export function extractCompetitors(
  observation: SearchObservation
): string[] {
  return observation.local_results.map(
    (business) => business.business_name
  );
}

export function businessAppears(
  observation: SearchObservation,
  businessName: string
): boolean {
  const target = businessName.toLowerCase();

  return observation.local_results.some(
    (business) =>
      business.business_name
        .toLowerCase()
        .includes(target)
  );
}
