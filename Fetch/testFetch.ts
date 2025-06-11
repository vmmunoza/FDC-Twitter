// scripts/fdcExample/testFetch.ts
import 'dotenv/config';
import fetch from 'node-fetch';

(async () => {
  const token = process.env.TWITTER_BEARER_TOKEN!;
  if (!token) {
    console.error('❌  TWITTER_BEARER_TOKEN not set');
    process.exit(1);
  }

  const res = await fetch(
    'https://api.twitter.com/2/users/by/username/0xQuantic',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'flare-web2json-demo/1.0',
        Accept: 'application/json',
      },
    },
  );

  console.log(res.status, await res.text());
})();
