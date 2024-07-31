import { StateProvider } from "@/context/stateContext"
import { initialState, reducer } from "@/context/stateReducers"
import "@/styles/globals.css"
import Head from "next/head"

export default function App({ Component, pageProps }) {
    return (
        <StateProvider initialState={initialState} reducer={reducer}>
            <Head>
                <title>SparkWave</title>
                <link rel="shortcut icon" href="/favicon.png" />
            </Head>
            <Component {...pageProps} />
        </StateProvider>
    )
}
