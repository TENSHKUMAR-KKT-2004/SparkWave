import { StateProvider } from "@/context/stateContext"
import { initialState, reducer } from "@/context/stateReducers"
import "@/styles/globals.css"
import Head from "next/head"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

export default function App({ Component, pageProps }) {
    return (
        <StateProvider initialState={initialState} reducer={reducer}>
            <Head>
                <title>SparkWave</title>
                <link rel="shortcut icon" href="/favicon.png" />
            </Head>

            <ToastContainer 
                position="top-right" 
                autoClose={5000} 
                hideProgressBar={false} 
                newestOnTop={false} 
                closeOnClick 
                rtl={false} 
                pauseOnFocusLoss 
                draggable 
                pauseOnHover 
                theme="light" 
            />

            <Component {...pageProps} />
        </StateProvider>
    )
}
