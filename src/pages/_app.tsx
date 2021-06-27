import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import { store } from 'stores/index'
import 'normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import './global.css'

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
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </Provider>
    </>
  )
}
