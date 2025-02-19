export const apiOrigin = process.env.NEXT_PUBLIC_APR_HOST;

export const fetcher = (url: string) =>
  fetch(url, {
    //no-cors
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    mode: "no-cors",
  }).then((res) => res.json());

export const ETERNAL_FARMINGS_API =
  //"http://localhost/api/APR/eternalFarmings/?network=berachain";
  `${apiOrigin}/api/APR/eternalFarmings/?network=berachain`;

export const POOL_MAX_APR_API =
  //"https://localhost/api/APR/pools/max?network=berachain";
  `${apiOrigin}/api/APR/pools/max?network=berachain`;

export const POOL_AVG_APR_API =
  //"https://localhost/api/APR/pools/?network=berachain";
  `${apiOrigin}/api/APR/pools/?network=berachain`;
