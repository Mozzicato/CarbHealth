// thin client that talks to the serverless Sanity proxy endpoints
export async function querySanity(groqQuery) {
  const res = await fetch('/api/sanity-query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: groqQuery }),
  });
  return res.json();
}

export async function mutateSanity(mutations) {
  const res = await fetch('/api/sanity-mutate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations }),
  });
  return res.json();
}
