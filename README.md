
## 📦 llm-quick-access

**llm-quick-access** is an Electron application built with React and TypeScript. It provides a floating, always-available interface to interact with local LLMs via [Ollama](https://ollama.com/). Designed to boost productivity, it allows you to perform common AI-powered tasks—like proofreading, writing emails, or generating content—via configurable actions and keyboard shortcuts.

You can:

* ⚡ **Open a floating AI window anytime, anywhere**
  Just hit a keyboard shortcut (like `Alt + Space`) and a clean, draggable window pops up—right over whatever you’re doing. It’s like having your own personal assistant, always ready to help without interrupting your flow.

* 🧠 **Get help with everyday writing tasks—fast**
  Need to polish a message, write a quick email, or draft something for LinkedIn? Set up actions once, and trigger them whenever you need. No copy-pasting between apps, no friction.

* 🤖 **Let the app handle all the model setup for you**
  You don’t have to worry about downloading or managing LLMs. Behind the scenes, the app talks to Ollama, runs the right commands, and makes sure everything’s ready to go—automatically.

* ✍️ **Customize how actions behave and respond**
  You decide how each action works: set an initial prompt, choose the model, format the response, and control what goes in and out. It’s flexible, so it fits the way *you* work.

* 🎹 **Use global shortcuts to trigger specific actions**
  Want to launch a proofreader or email writer with a single key combo? You can assign shortcuts to any action you create and use them from anywhere on your desktop.

* 📁 **Organize everything in a handy sidebar**
  All your custom actions live in a simple side panel—easy to browse, update, or launch on the fly.


## 🚀 Getting Started

### 📦 Install Dependencies

```bash
yarn
```

### 🧪 Run in Development

```bash
yarn dev
```

### 🛠 Build for Production

```bash
# Windows
yarn build:win

# macOS
yarn build:mac

# Linux
yarn build:linux
```

---

## 🗺 Roadmap

* [ ] JSON-based action configuration (fields: `keepHistory`, `initialPrompt`, `model`, `outputTemplate`, `inputFormat`)
* [ ] Built-in actions:

  * Proofreader
  * Email writer
  * LinkedIn content generator
* [ ] Ollama integration:

  * Check for installed models
  * Pull models defined in actions
  * Handle stream-based LLM requests
* [ ] Side panel UI to manage & trigger actions
* [ ] Dynamic keyboard shortcut assignment per action

---

## 📚 References

* Ollama API Docs: [https://github.com/ollama/ollama/blob/main/docs/api.md#chat-request-structured-outputs](https://github.com/ollama/ollama/blob/main/docs/api.md#chat-request-structured-outputs)

---