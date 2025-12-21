import 'dotenv/config';
import createDefaultClient from '../../src/api/client';

async function main() {
  // Use nullish coalescing and explicit casting to string for TS safety
  const discordId = String(process.env.DISCORD_ID ?? '475378131373654026');
  const apiKey = process.env.LANYARD_API_KEY ? String(process.env.LANYARD_API_KEY) : null;
  const client = createDefaultClient();

  console.log('Fetching user', discordId);
  const res1 = await client.getUser(discordId, apiKey);
  console.log('Response (first):');
  console.log(JSON.stringify(res1, null, 2));

  const stats1 = await client.getCacheStats();
  console.log('Cache stats after first fetch:', stats1);

  console.log('Fetching again to demonstrate cache hit...');
  const res2 = await client.getUser(discordId, apiKey);
  console.log('Response (second):');
  console.log(JSON.stringify(res2, null, 2));

  const stats2 = await client.getCacheStats();
  console.log('Cache stats after second fetch:', stats2);

  // Example: request specific fields only (dot-notation)
  console.log('Fetching with select -> data.spotify.track_id and data.discord_user.username');
  const partial = await client.getUser(discordId, apiKey, ['data.spotify.track_id', 'data.discord_user.username']);
  console.log('Partial response:');
  console.log(JSON.stringify(partial, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
