import Main from "@/components/Main";
import { useStateProvider } from "@/context/stateContext";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function Index() {

  const [{ userInfo, onBoarded }] = useStateProvider()
  const router = useRouter()

  useEffect(() => {
    if (!userInfo?.email && !onBoarded) {
      router.push("/login")
    } else if (userInfo?.email && !onBoarded) {
      router.push('/onboarding')
    }
  }, [userInfo, onBoarded, router])

  return <Main />
}

export default Index;