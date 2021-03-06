/// <reference lib="es2018" />
/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching'
import { clientsClaim, skipWaiting } from 'workbox-core'
import { Prefetcher } from '@layer0/prefetch/sw'
import DeepFetchPlugin from '@layer0/prefetch/sw/DeepFetchPlugin'
import { getOptimizedImageUrl } from './layer0/cms'

declare const self: ServiceWorkerGlobalScope

skipWaiting()
clientsClaim()

precacheAndRoute(self.__WB_MANIFEST || [])

new Prefetcher({
  plugins: [
    new DeepFetchPlugin([
      // query the PLP API response for images to prefetch
      {
        jsonQuery: 'picture:picture',
        jsonQueryOptions: {
          locals: {
            picture: (input: any) => {
              if (input.map) {
                return input.map(getOptimizedImageUrl)
              }

              return []
            },
          },
        },
        maxMatches: 10,
        as: 'image',
      },
    ]),
  ],
}).route()
