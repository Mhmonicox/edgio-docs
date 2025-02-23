---
title: Svelte
---

This guide shows you how to deploy a [Svelte](https://svelte.dev/) application to {{ PRODUCT }}.

## Example {/*example*/}

<ExampleButtons
  title="Svelte"
  siteUrl="https://layer0-docs-layer0-svelte-example-default.layer0-limelight.link"
  repoUrl="https://github.com/layer0-docs/layer0-svelte-example" 
  deployFromRepo />

{{ PREREQ }}

## Create a new Svelte app {/*create-a-new-svelte-app*/}

If you don't already have a Svelte app, create one by running the following:

```bash
npx degit sveltejs/template-webpack svelte-app
cd svelte-app
npm install
```

You can verify your app works by running it locally with:

```bash
npm run dev
```

## Configuring your Svelte app for {{ PRODUCT }} {/*configuring-your-svelte-app-for*/}

### Initialize your project {/*initialize-your-project*/}

In the root directory of your project run `{{ FULL_CLI_NAME }} init`:

```bash
{{ FULL_CLI_NAME }} init
```

This will automatically update your `package.json` and add all of the required {{ PRODUCT }} dependencies and files to your project. These include:

- The `{{ PACKAGE_NAME }}/core` package - Allows you to declare routes and deploy your application on {{ PRODUCT }}
- The `{{ PACKAGE_NAME }}/prefetch` package - Allows you to configure a service worker to prefetch and cache pages to improve browsing speed
- `{{ CONFIG_FILE }}` - A configuration file for {{ PRODUCT }}
- `routes.js` - A default routes file that sends all requests to Svelte.

### Adding {{ PRODUCT }} Service Worker {/*adding-service-worker*/}

To add service worker to your Svelte app, run the following in the root folder of your project:

```bash
npm i process register-service-worker workbox-webpack-plugin
```

Create `service-worker.js` at the root of your project with the following:

```js
import { skipWaiting, clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { Prefetcher } from '{{ PACKAGE_NAME }}/prefetch/sw'

skipWaiting()
clientsClaim()
precacheAndRoute(self.__WB_MANIFEST || [])

new Prefetcher().route()
```

To register the service worker, first create `registerServiceWorker.js` in the `src` folder:

```js
/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`/service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB',
      )
    },
    registered() {
      console.log('Service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
    },
    updated() {
      console.log('New content is available; please refresh.')
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    },
  })
}
```

and to include the service worker in the app, edit `main.js` (in the `src` folder) as follows:

```js ins={3}
import './global.css'
import App from './App.svelte'
import './registerServiceWorker'

const app = new App({
  target: document.body,
  props: {
    name: 'world',
  },
})

export default app
```

Now, in `webpack.config.js` make the following additions:

```js filename='webpack.config.js' ins={1-2,5-10}
const { InjectManifest } = require("workbox-webpack-plugin");
const webpack = require('webpack')

plugins: [
  new webpack.ProvidePlugin({
    process: 'process/browser',
  }),
  new InjectManifest({
    swSrc: "./service-worker.js",
  })
]
```

### Configure the routes {/*configure-the-routes*/}

Next you'll need to configure {{ PRODUCT }} routing in the `routes.js` file.
Replace the `routes.js` file that was created during `{{ FULL_CLI_NAME }} init` with the following:

```js
const { Router } = require('{{ PACKAGE_NAME }}/core/router')

module.exports = new Router()
  
  // Send requests to static assets in the build output folder `public`
  .static('public')

  // Send everything else to the App Shell
  .fallback(({ appShell }) => {
    appShell('public/index.html')
  })
```

The example above assumes you're using Svelte as a single page app. It routes the static assets (JavaScript, CSS, and Images) in the production build folder `public` and maps all other requests to the app shell in `public/index.html`.

Refer to the [CDN-as-code](/guides/performance/cdn_as_code) guide for the full syntax of the `routes.js` file and how to configure it for your use case.

### Run the Svelte app locally on {{ PRODUCT }} {/*run-the-svelte-app-locally-on*/}

Create a production build of your app by running the following in your project's root directory:

```bash
npm run build
```

Test your app with the {{ PRODUCT_PLATFORM }} on your local machine by running the following command in your project's root directory:

```bash
npm run dev
```

Load the site http://127.0.0.1:3000

## Deploying {/*deploying*/}

Create a production build of your app by running the following in your project's root directory:

```bash
npm run build
```

Deploy your app to the {{ PRODUCT_PLATFORM }} by running the following command in your project's root directory:

```bash
{{ FULL_CLI_NAME }} deploy
```

Refer to the [Deployments](/guides/basics/deployments) guide for more information on the `deploy` command and its options.
