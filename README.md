# 🚀 AI Assistant Studio

**AI Assistant Studio** lets you create, customize, and chat with your own AI assistants powered by local language models via [Ollama](https://ollama.com/).

## ✨ Key Features

- 🎨 **Fully Customizable**
  Choose any Ollama model, craft custom prompts, and add specialized input fields for your unique use cases.

- 💬 **Multiple Conversations**
  Create multiple chat sessions with each assistant, keeping your conversations organized and contextual.

- 🔒 **Privacy First**
  Everything runs locally on your machine. Your data stays private, and you can work offline.

- ⚡ **Quick Access**
  Open a floating AI window anytime with a keyboard shortcut, right over whatever you're working on.

- 🛠 **Easy Setup**
  The app helps you set up Ollama and download essential models to power your AI assistants.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Yarn](https://yarnpkg.com/)
- [Ollama](https://ollama.com/) (for local model inference)

### Install Dependencies

```bash
yarn
```

### Development

```bash
yarn dev
```

### Build for Production

```bash
# Windows
yarn build:win

# macOS
yarn build:mac

# Linux
yarn build:linux
```

## 🗺 Roadmap

- [X] Chat feature with conversation history
- [X] JSON-based assistant management
- [X] Default assistants (Proofreader, E-mail assistant, Markdown assistant)
- [X] Welcome/Setup screen
- [X] Functional Ollama Management Integration with Cancellable Requests and Stream Support
- [X] [Shadcn](https://ui.shadcn.com/) UI integration && [Shadcn Chat](https://github.com/jakobhoeg/shadcn-chat)
- [X] Image upload support for vision models (base64 encoding)
- [ ] Dynamic Assistant Management with form powered by A.I. to help with assistant creation
- [ ] Multiple chat sessions with each assistant support
- [ ] Dynamic keyboard shortcut assignment support for Windows and Linux
- [ ] Portable files (.exe and .deb) for running the software with cut releases

---

## 📚 References

- [Electron](https://www.electronjs.org/)
- [Shadcn](https://ui.shadcn.com/)
- [Shadcn Chat](https://github.com/jakobhoeg/shadcn-chat)
- [Ollama API Docs](https://github.com/ollama/ollama/blob/main/docs/api.md)

---
