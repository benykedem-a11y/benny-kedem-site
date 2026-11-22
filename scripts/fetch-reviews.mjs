// Pulls Benny's rating, review count and latest reviews from Google (Places API, New)
// and writes them to data/reviews.json. Runs daily from .github/workflows/update-reviews.yml.
// Needs the secret GOOGLE_PLACES_API_KEY. If anything fails, the existing file is left untouched.
import { readFile, writeFile } from 'node:fs/promises';

const PLACE_ID = 'ChIJTTHLI9S3AhUReR-AG2YUrLQ';
const KEY = process.env.GOOGLE_PLACES_API_KEY;
const OUT = new URL('../data/reviews.json', import.meta.url);

if (!KEY) { console.error('Missing GOOGLE_PLACES_API_KEY'); process.exit(1); }

const res = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=he`, {
  headers: { 'X-Goog-Api-Key': KEY, 'X-Goog-FieldMask': 'rating,userRatingCount,reviews' },
});
if (!res.ok) { console.error('Google answered', res.status, await res.text()); process.exit(1); }
const place = await res.json();

const reviews = (place.reviews || []).map(r => ({
  author: r.authorAttribution?.displayName || '',
  rating: r.rating ?? 5,
  // originalText is the review as the person wrote it; text may be a translation
  text: (r.originalText?.text || r.text?.text || '').trim(),
  time: r.publishTime || '',
})).filter(r => r.text);

const prev = JSON.parse(await readFile(OUT, 'utf8').catch(() => '{}'));
const data = {
  updated: new Date().toISOString().slice(0, 10),
  rating: place.rating ?? prev.rating,
  count: place.userRatingCount ?? prev.count,
  // Google returns at most 5 reviews; keep the old ones if it returned none
  reviews: reviews.length ? reviews : (prev.reviews || []),
};
await writeFile(OUT, JSON.stringify(data, null, 2) + '\n');
console.log(`rating ${data.rating}, ${data.count} reviews, ${data.reviews.length} shown`);
