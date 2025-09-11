from chatterbot import ChatBot
import os

Bot = ChatBot(name='Calculator',
              read_only=True,
              logic_adapters=["chatterbot.logic.MathematicalEvaluation"],
              storage_adapter="chatterbot.storage.SQLStorageAdapter")

os.system('cls' if os.name == 'nt' else 'clear')
print("Hello, I am a calculator. How may I help you?")
while (True):

    user_input = input("me: ")

    if user_input.lower() == 'quit':
        print("Exiting")
        break

    try:
        response = Bot.get_response(user_input)
        print("Calculator:", response)
    except:
        print("Calculator: Please enter valid input.")