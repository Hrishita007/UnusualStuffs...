import turtle
import random
import time

# Screen
screen = turtle.Screen()
screen.title("🏎️ Racing Game")
screen.bgcolor("gray")
screen.setup(width=600, height=700)
screen.tracer(0)

# Road
road = turtle.Turtle()
road.penup()
road.goto(-250, -350)
road.pendown()
road.color("black")
road.begin_fill()

for _ in range(2):
    road.forward(500)
    road.left(90)
    road.forward(700)
    road.left(90)

road.end_fill()
road.hideturtle()

# Player car
player = turtle.Turtle()
player.shape("square")
player.color("blue")
player.shapesize(stretch_wid=1.5, stretch_len=1)
player.penup()
player.goto(0, -280)

# Enemy cars
enemies = []

for i in range(4):
    enemy = turtle.Turtle()
    enemy.shape("square")
    enemy.color("red")
    enemy.shapesize(stretch_wid=1.5, stretch_len=1)
    enemy.penup()
    enemy.goto(random.choice([-200, -100, 0, 100, 200]),
               random.randint(100, 600))
    enemies.append(enemy)

# Score
score = 0
score_display = turtle.Turtle()
score_display.color("white")
score_display.penup()
score_display.hideturtle()
score_display.goto(0, 310)
score_display.write(
    "Score: 0",
    align="center",
    font=("Arial", 20, "bold")
)

# Movement
def left():
    x = player.xcor()
    if x > -220:
        player.setx(x - 30)

def right():
    x = player.xcor()
    if x < 220:
        player.setx(x + 30)

screen.listen()
screen.onkeypress(left, "Left")
screen.onkeypress(right, "Right")

# Game
speed = 5

while True:
    screen.update()

    for enemy in enemies:
        enemy.sety(enemy.ycor() - speed)

        # Enemy reaches bottom
        if enemy.ycor() < -350:
            enemy.goto(
                random.choice([-200, -100, 0, 100, 200]),
                random.randint(400, 700)
            )

            score += 1
            score_display.clear()
            score_display.write(
                f"Score: {score}",
                align="center",
                font=("Arial", 20, "bold")
            )

            # Increase difficulty
            if score % 10 == 0:
                speed += 1

        # Collision
        if player.distance(enemy) < 30:
            score_display.clear()
            score_display.goto(0, 0)
            score_display.write(
                f"GAME OVER!\nScore: {score}",
                align="center",
                font=("Arial", 25, "bold")
            )

            screen.update()
            time.sleep(3)
            screen.bye()
            break

    time.sleep(0.03)