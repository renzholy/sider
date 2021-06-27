import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import { store } from 'stores/index'
import { injectGlobal } from '@emotion/css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import Layout from 'components/layout'

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
injectGlobal`
::-webkit-scrollbar {
  display: none;
}

* {
  outline: none !important;
}

html,
body {
  height: 100vh;
  width: 100vw;
  min-width: 1200px;
  font-family: 'Consolas', 'Lucida Console', monospace;
}

@media (prefers-color-scheme: light) {
  body {
    background-color: #f5f8fa;
  }
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: #394b59;
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
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </>
  )
}
