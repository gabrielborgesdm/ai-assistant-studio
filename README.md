
<p align="center">
  <img src="./build/icon.png" alt="AI Assistant Studio Logo" width="50" />
</p>

<h1 align="center">AI Assistant Studio</h1>

<p align="center">
  Create, customize, and chat with your own AI assistants powered by local language models via <a href="https://ollama.com/">Ollama</a>.
</p>

---

## ✨ Features

- ⚡ **Auto-Generated Assistants**  
  Easily create intelligent, contextual assistants in seconds — powered by AI-driven auto-generation. Whether you need a **conversational partner** or a **task performer** (like a proofreader, email writer, or markdown editor), just describe what you want, and the app will do the rest.

- 🎨 **Fully Customizable**  
  Choose from any Ollama-compatible model, fine-tune behavior with custom instructions, and define input fields tailored to your workflow.

- 💬 **Conversation Management**  
  Keep your interactions organized with persistent history and support for multiple assistants.

- 🔒 **Privacy First**  
  100% local. No internet required. Your data stays on your machine — always.

- ⌨️ **Quick Access Anywhere**  
  Launch a floating assistant window instantly with a keyboard shortcut — on top of any app.

- 🛠 **Effortless Setup**  
  The guided onboarding helps you install Ollama, choose your models, and get started without the technical hassle.

---

## 🖼 Preview

### 🧭 Welcome Screen  
<!-- Insert welcome screen screenshot below -->
![Welcome Screen](public/welcome-page.png)

### 💻 Main App Interface  
<!-- Insert main interface screenshot below -->
![Main Interface](public/chat-interface.png)

---

## 🎥 How It Works

Sure! Here's a polished explanation you can use to accompany that section of your README or documentation:

---

### ✨ Creating a Custom Assistant


![Create Assistant Demo](public/create-assistant.gif)

In this video, I create a **Proofreader assistant** using **Task mode**, which is designed to respond only to the **latest user message**—perfect for focused, one-shot tasks like grammar correction or rewriting.

After generating the initial assistant, I also **adjust the system instructions** to better tailor its behavior to my specific needs. This allows the assistant to follow more precise guidelines, ensuring more accurate and helpful responses.


---

## 🚀 Getting Started

### Installation

Head to the [releases page](https://github.com/gabrielborgesdm/ai-assistant-studio/releases) and download the latest version for your operating system.

---

## 🗺 Roadmap

- ✅ Multiple assistant support with saved conversations  
- ✅ Default assistants: Proofreader, Email Assistant, Markdown Helper, Multimodal (Gemma 3)  
- ✅ Ollama model management with stream + cancellation support  
- ✅ Modern UI powered by [Shadcn UI](https://ui.shadcn.com/) & [Shadcn Chat](https://github.com/jakobhoeg/shadcn-chat)  
- ✅ Image upload for vision models (Base64 support)  
- ✅ AI-powered assistant behavior + instruction auto-generation  
- ✅ Live model listing with metadata and variants via Ollama scraping  
- ✅ Dynamic keyboard shortcut support (Windows & Linux)  
- ✅ Streamed markdown rendering with code block highlighting  
- ✅ Welcome/setup onboarding screen  
- 🔄 In Progress: Multiple simultaneous chat sessions per assistant  
- 🔜 Planned: Contextual search over local markdown files using Langchain  
- 🔜 Planned: Support for ChatGPT and other cloud model backends  

---

## 📚 Tech Stack & Shoutouts

This project wouldn’t be possible without:

- [Electron](https://www.electronjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-markdown](https://www.npmjs.com/package/react-markdown)
- [react-syntax-highlighter](https://www.npmjs.com/package/react-syntax-highlighter)
- [Shadcn Chat](https://github.com/jakobhoeg/shadcn-chat)
- [shortcut-recorder-hook](https://github.com/BlazeStorm001/shortcut-recorder-hook)

---

## 🛠 Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- [Yarn](https://yarnpkg.com/)
- [Ollama](https://ollama.com/) — required for running local models

### Install Dependencies

```bash
yarn
````

### Start in Development Mode

```bash
yarn dev
```

### Build for Production

```bash
# For Windows
yarn build:win

# For macOS
yarn build:mac

# For Linux
yarn build:linux
```

