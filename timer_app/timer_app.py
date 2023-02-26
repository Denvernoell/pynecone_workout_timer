"""Welcome to Pynecone! This file outlines the steps to create a basic app."""
from pcconfig import config
import arrow
import pynecone as pc
from datetime import datetime
# import pytz
import asyncio

docs_url = "https://pynecone.io/docs/getting-started/introduction"
filename = f"{config.app_name}/{config.app_name}.py"

class State(pc.State):
    """The app state."""
    count: int = 0
    # running: bool = False
    running: bool = True

    time = arrow.now().naive.strftime("%H:%M:%S")

    exercise_names = [
        "Squats/Wall Squat",
        "Push-ups/Bench Press",
        # "Lateral Raise",
        "Pull-ups",
        # "Plank Gauntlet (choose 3)",
        # "Lunges/Split Squat",
        "Leg Raises",
    ]
    total_sets = 3
    
    exercises = {x+1:y for x,y in zip(range(total_sets * len(exercise_names)), exercise_names * total_sets)}

    set_number = 1

    # sets_total = 3
    total_time = 60

    time_remaining = total_time
    rest_time = 3
    rest_time_remaining = rest_time

    sound = ""
    

    async def tick(self):
        """Update the clock every second."""
        if self.running:
            await asyncio.sleep(1)
            self.time = arrow.now().naive.strftime("%H:%M:%S")
            if self.time_remaining > 0:
                self.time_remaining -= 1
            if self.time_remaining == 0:
                self.rest_time_remaining -=1
                if self.rest_time_remaining == 0:

                    if self.set_number == self.total_sets * len(self.exercise_names):
                        self.complete = True
                    else:
                        self.set_number += 1
                        self.time_remaining = self.total_time
                        self.rest_time_remaining = self.rest_time

            return self.tick

    # def flip_switch(self, start):
    #     """Start or stop the clock."""
    #     self.start = start
    #     if self.start:
    #         return self.tick
    
    def restart(self):
        self.time_remaining = self.total_time
        self.set_number = 1
    
    def pause(self):
        self.running = False
    
    def start(self):
        self.running = True
        if self.running:
            return self.tick
    
    def previous(self):
        if self.set_number > 1:
            self.set_number -= 1
            self.time_remaining = self.total_time
            self.rest_time_remaining = self.rest_time
    def next(self):
        if self.set_number < self.total_sets * len(self.exercise_names):
            self.set_number += 1
            self.time_remaining = self.total_time
            self.rest_time_remaining = self.rest_time

    def play_sound(self):
        self.sound = 'controls autoplay loop'
        

# def workout():
def index():
    return pc.center(
        pc.vstack(
            pc.heading("Workout Timer", font_size="2em"),
            pc.span("Set: ", State.set_number, font_size="1em"),
            pc.span("", State.exercises[State.set_number], font_size="1em"),
            # pc.heading("Time: ", State.time, font_size="2em"),
            pc.circular_progress(
                pc.circular_progress_label(State.time_remaining, track_color="green"),
                value=(State.time_remaining / State.total_time) * 100,
                # track_color="green",
                thickness=15,
            ),



            # pc.switch(is_checked=State.start, on_change=State.flip_switch),

            pc.button_group(
                pc.button(
                    "Start",
                    color_scheme="blue",
                    variant="outline",
                    border_radius="1em",
                    on_click=State.start,
                ),
                pc.button(
                    "Pause",
                    color_scheme="yellow",
                    variant="outline",
                    border_radius="1em",
                    on_click=State.pause,
                ),
            ),
            pc.button_group(
                pc.button(
                    "Previous",
                    color_scheme="purple",
                    variant="outline",
                    border_radius="1em",
                    on_click=State.previous,
                ),
                pc.button(
                    "Next",
                    color_scheme="orange",
                    variant="outline",
                    border_radius="1em",
                    on_click=State.next,
                ),
            ),
            pc.button_group(
                pc.button(
                    "Restart",
                    color_scheme="green",
                    variant="outline",
                    border_radius="1em",
                    on_click=State.restart,
                ),
            ),
                # pc.button(
                #     "Skip",
                #     color_scheme="yellow",
                #     variant="outline",
                #     border_radius="1em",
                #     on_click=State.decrement,
                # ),
                # space="1em",
            # ),
            pc.cond(
                State.time_remaining == 0,
                # pc.span('Hello')

                pc.html( f"""
                <audio autoplay
                    src="https://cdn.pixabay.com/download/audio/2021/08/04/audio_dea21d9092.mp3?filename=game-start-6104.mp3">
                </audio>
                """
                ),
            ),
# https://cdn.pixabay.com/download/audio/2021/09/14/audio_de61fb9b7d.mp3?filename=beep-sound-8333.mp3
# "https://cdn.pixabay.com/download/audio/2021/08/04/audio_dea21d9092.mp3?filename=game-start-6104.mp3"

            spacing="1.5em",
            font_size="2em",
        ),
        padding_top="2%",
        padding_bottom="2%",

    )
    
    


# def index():
#     return pc.center(
#         pc.vstack(
#             pc.heading("Welcome to Pynecone!", font_size="2em"),
#             pc.box("Get started by editing ", pc.code(filename, font_size="1em")),
#             pc.link(
#                 "Check out our docs!",
#                 href=docs_url,
#                 border="0.1em solid",
#                 padding="0.5em",
#                 border_radius="0.5em",
#                 _hover={
#                     "color": "rgb(107,99,246)",
#                 },
#             ),
#             spacing="1.5em",
#             font_size="2em",
#         ),
#         padding_top="10%",
#     )





# Add state and page to the app.
app = pc.App(state=State)
app.add_page(index)
# app.add_page(workout)
app.compile()