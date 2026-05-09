import React from "react"
import ReactDOM from "react-dom/client"
import AppPage from "./AppPage"
import { Analytics } from "@vercel/analytics/react"
import { ChakraProvider } from "@chakra-ui/react"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <ChakraProvider>
        <AppPage />
        <Analytics
            beforeSend={(e) => {
                if (e.url.includes("private")) return null
                return e
            }}
        />
    </ChakraProvider>
)
