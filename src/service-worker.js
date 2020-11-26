import forEach from 'lodash/fp/forEach';
import replace from 'lodash/fp/replace';
import includes from 'lodash/fp/includes';
import { registerRoute } from 'workbox-routing';
import { precacheAndRoute } from 'workbox-precaching';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { version } from '../package.json';

const replaceDotToDash = replace('.', '-');
const VERSION = `v-${replaceDotToDash(version)}`;
const DAY = 24 * 60 * 60;

precacheAndRoute(self.__WB_MANIFEST);

const includesVersion = includes(VERSION);

const deleteOldCache = cacheName => {
  if (!includesVersion(cacheName)) {
    caches.delete(cacheName);
  }
};

const deleteAllOldCaches = forEach(deleteOldCache);

const clearCache = () => {
  caches.keys().then(deleteAllOldCaches);
};

clearCache();

registerRoute(
  new RegExp(/\.(png|svg|jpg|jpeg|gif|webp|webm)$/),
  new StaleWhileRevalidate({ cacheName: `${VERSION}-images` }),
);

registerRoute(
  new RegExp(/\.(ttf|otf)$/),
  new CacheFirst({
    cacheName: `${VERSION}-fonts`,
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 30 * DAY })],
  }),
);

registerRoute(
  new RegExp(/\.(js|js\.gz)$/),
  new StaleWhileRevalidate({ cacheName: `${VERSION}-js` }),
);
