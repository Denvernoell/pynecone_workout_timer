import {Fragment, useEffect, useRef, useState} from "react"
import {useRouter} from "next/router"
import {E, connect, updateState} from "/utils/state"
import "focus-visible/dist/focus-visible"
import {Box, Button, ButtonGroup, Center, CircularProgress, CircularProgressLabel, Heading, Text, VStack} from "@chakra-ui/react"
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
<Center sx={{"paddingTop": "2%", "paddingBottom": "2%"}}><VStack spacing="1.5em"
sx={{"fontSize": "2em"}}><Heading sx={{"fontSize": "2em"}}>{`Workout Timer`}</Heading>
<Text as="span"
sx={{"fontSize": "1em"}}>{`Set: `}
{state.set_number}</Text>
<Text as="span"
sx={{"fontSize": "1em"}}>{``}
{state.exercises[state.set_number]}</Text>
<CircularProgress value={((state.time_remaining / state.total_time) * 100)}
thickness={15}><CircularProgressLabel sx={{"trackColor": "green"}}>{state.time_remaining}</CircularProgressLabel></CircularProgress>
<ButtonGroup><Button colorScheme="blue"
variant="outline"
onClick={() => Event([E("state.start", {})])}
sx={{"borderRadius": "1em"}}>{`Start`}</Button>
<Button colorScheme="yellow"
variant="outline"
onClick={() => Event([E("state.pause", {})])}
sx={{"borderRadius": "1em"}}>{`Pause`}</Button></ButtonGroup>
<ButtonGroup><Button colorScheme="purple"
variant="outline"
onClick={() => Event([E("state.previous", {})])}
sx={{"borderRadius": "1em"}}>{`Previous`}</Button>
<Button colorScheme="orange"
variant="outline"
onClick={() => Event([E("state.next", {})])}
sx={{"borderRadius": "1em"}}>{`Next`}</Button></ButtonGroup>
<ButtonGroup><Button colorScheme="green"
variant="outline"
onClick={() => Event([E("state.restart", {})])}
sx={{"borderRadius": "1em"}}>{`Restart`}</Button></ButtonGroup>
{(state.time_remaining == 0) ? <Box dangerouslySetInnerHTML={{"__html": "\n                <audio autoplay\n                    src=\"https://cdn.pixabay.com/download/audio/2021/08/04/audio_dea21d9092.mp3?filename=game-start-6104.mp3\">\n                </audio>\n                "}}/> : <Fragment/>}</VStack>
<NextHead><title>{`Pynecone App`}</title>
<meta name="description"
content="A Pynecone app."/>
<meta property="og:image"
content="favicon.ico"/></NextHead></Center>
)
}