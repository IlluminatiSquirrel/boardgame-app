import moment, { Moment } from 'moment';

// 1 hour
const CACHING_DURATION = 3600;

export async function checkCache(url: string, cache: Cache): Promise<Response | undefined> {
  const cachedResponse: Response | undefined = await cache.match(url);
  if (cachedResponse) {
    const cacheExpiryDate: string | null = cachedResponse.headers.get('cache-expires');
    if (cacheExpiryDate && moment(cacheExpiryDate).isAfter(moment.utc())) {
      return cachedResponse;
    }
  }
  return undefined;
}

export async function cacheResponse(url: string, cache: Cache): Promise<Response> {
  const response: Response = await fetch(url);
  const responseCopy: Response = response.clone();

  const expires: Moment = moment.utc().add(moment.duration(CACHING_DURATION, 's'));

  const cachedResponseFields = {
    status: response.status,
    statusText: response.statusText,
    headers: { 'cache-expires': expires.toString() },
  };

  response.headers.forEach((v, k) => {
    cachedResponseFields.headers[k] = v;
  });

  const body: string = await response.text();
  cache.put(url, new Response(body, cachedResponseFields));
  return responseCopy;
}
