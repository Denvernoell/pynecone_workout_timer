import {useEffect, useRef, useState} from "react"
import {useRouter} from "next/router"
import {E, connect, updateState} from "/utils/state"
import "focus-visible/dist/focus-visible"
import {Box, Center, Code, Heading, Link, VStack} from "@chakra-ui/react"
import NextLink from "next/link"
import NextHead from "next/head"

const EVENT = "ws://localhost:8000/event"
export default function Component() {
const [state, setState] = useState({"count": 0, "exercise_names": ["Squats/Wall Squat", "Push-ups/Bench Press", "Pull-ups", "Leg Raises"], "exercises": {"1": "Squats/Wall Squat", "2": "Push-ups/Bench Press", "3": "Pull-ups", "4": "Leg Raises", "5": "Squats/Wall Squat", "6": "Push-ups/Bench Press", "7": "Pull-ups", "8": "Leg Raises", "9": "Squats/Wall Squat", "10": "Push-ups/Bench Press", "11": "Pull-ups", "12": "Leg Raises"}, "rest_time": 3, "rest_time_remaining": 3, "running": true, "set_number": 1, "sound": "", "time": "17:04:19", "time_remaining": 60, "total_sets": 3, "total_time": 60, "events": [{"name": "state.hydrate"}]})
const [result, setResult] = useState({"state": null, "events": [], "processing": false})
const router = useRouter()
const socket = useRef(null)
const { isReady } = router;
const Event = events => setState({
  ...state,
  events: [...state.events, ...events],
})
useEffect(() => {
  if(!isReady) {
    return;
  }
  if (!socket.current) {
    connect(socket, state, setState, result, setResult, router, EVENT)
  }
  const update = async () => {
    if (result.state != null) {
      setState({
        ...result.state,
        events: [...state.events, ...result.events],
      })
      setResult({
        state: null,
        events: [],
        processing: false,
      })
    }
    await updateState(state, setState, result, setResult, router, socket.current)
  }
  update()
})
return (
<Center sx={{"paddingTop": "10%"}}><VStack spacing="1.5em"
sx={{"fontSize": "2em"}}><Heading sx={{"fontSize": "2em"}}>{`Welcome to Pynecone!`}</Heading>
<Box>{`Get started by editing `}
<Code sx={{"fontSize": "1em"}}>{`timer_app/timer_app.py`}</Code></Box>
<NextLink href="https://pynecone.io/docs/getting-started/introduction"
passHref={true}><Link sx={{"border": "0.1em solid", "padding": "0.5em", "borderRadius": "0.5em", "_hover": {"color": "rgb(107,99,246)"}}}>{`Check out our docs!`}</Link></NextLink></VStack>
<NextHead><title>{`Pynecone App`}</title>
<meta name="description"
content="A Pynecone app."/>
<meta property="og:image"
content="favicon.ico"/></NextHead></Center>
)
}