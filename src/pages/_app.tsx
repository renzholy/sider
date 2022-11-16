import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import { store } from 'stores/index'
import { injectGlobal } from '@emotion/css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css'
import Layout from 'components/layout'

injectGlobal`
::-webkit-scrollbar {
  display: none;
}

* {
  outline: none !important;
}

:root {
  --dark-gray4: #30404d;
  --dark-gray5: #394b59;
  --light-gray4: #ebf1f5;
  --light-gray5: #f5f8fa;
}

html,
body {
  margin: 0;
  height: 100vh;
  width: 100vw;
  min-width: 900px;
  font-family: 'Consolas', 'Lucida Console', monospace;
}

@media (prefers-color-scheme: light) {
  body {
    background-color: var(--light-gray5);
  }
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: var(--dark-gray5);
  }
}
`

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=900, minimum-scale=0.5, maximum-scale=2.0"
        />
        <title>Sider</title>
      </Head>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </>
  )
}
