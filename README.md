# Marvbot

*Depressed Bot That Gives Stars*

## Introduction

A Slack chatbot that doesn't really do much other than giving you grief. It's depressed. It has gone through much. Many lifetimes of the universe. It's cranky. Pardon it. One thing it can do though - it can help you give other people stars. To talk to it, just type "Marvbot" in the message that you want Marvbot to respond to.

## Features

- See what happens when you just call it without saying anything else.
- Say "Hello" to it. Or "Hi".
- Ask it if there is "anything new in your life".
- Ask it to "give me a suggestion".
- Sometimes it can be quite hardworking. You can ask "are you hard at work?"
- There are things it objects to. Find out by asking "do you object".
- It tried to learn music. Find out how good it is by asking "do you know music?"
- Say "bye" to it.
- It can get quite rude. Tell it that it's "so rude".
- **But most importantly, you can ask it to give other people stars**. Tell it who you would like to thank by saying "I would like to thank" followed by tagging the person you would like to thank. And see the magic happen.

## Prototype

Take away the manic depression and wry (irreverent?) humour, this bot could be used to help keep track of people assisting one another and earning kudos from one another.

## Configuration

### Obtain slack bot app token

Follow the instructions on https://api.slack.com/bot-users
Obtain an app token

### Setup

```
$ git clone git@github.com:RenchChua/beestbotnai.git

$ cd beestbotnai

$ npm i

```

## Starting with Node.js

For mac users, in your terminal, type: BOT_API_KEY=your_slack_api_key node bin/bot.js

## Possible Next Steps

- Utilise a natural language processing system that can be trained for a better, more responsive bot.
- Improve the star system to reflect why you are thanking a person.
- Add tests.

## Tech Stack

- Node.js
- Slackbots
- SQLite3

## Credit

- Learnt basics of building a chatbot for slack from this really good resource by [Luciano Mammimo] (https://scotch.io/tutorials/building-a-slack-bot-with-node-js-and-chuck-norris-super-powers)

- Luqman for providing a fresh pair of eyes to look at code, giving ideas, and helping to test Marvbot's ability to give stars.
