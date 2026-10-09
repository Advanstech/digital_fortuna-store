export async function getListings() {
  const res = await fetch('http://localhost:4000/listings');
  if (!res.ok) throw new Error('Failed to fetch listings');
  return res.json();
}

export async function getListing(slug: string) {
  const res = await fetch(`http://localhost:4000/listings/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch listing');
  return res.json();
}
