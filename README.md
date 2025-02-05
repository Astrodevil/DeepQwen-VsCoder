# DeepQwen Coder

DeepQwen Coder is a Visual Studio Code extension that allows developers to interact with AI models to enhance their coding experience. Users can chat with AI, select code snippets, and receive code-formatted responses.

## Features

- Chat with multiple AI models.
- Select code snippets directly from your codebase.
- Receive AI responses in both text and code formats.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/deepqwen-coder.git
   ```

2. Navigate to the project directory:

   ```bash
   cd deepqwen-coder
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Compile the TypeScript code:

   ```bash
   npm run compile
   ```

## Usage

1. Open Visual Studio Code.
2. Press `F5` to start the extension in the Extension Development Host.
3. Use the command palette (`Ctrl + Shift + P` or `Cmd + Shift + P`) and type "DeepQwen Coder: Chat" to open the chat interface.
4. Enter your API key and select an AI model.
5. You can select code from your editor and click "Add Selected Code" to include it in the chat context.

## Obtaining Nebius API Key

To use the DeepQwen Coder extension, you need an API key from Nebius. Follow these steps to obtain your key:

1. Go to the Nebius Studio website: [Nebius Studio](https://studio.nebius.ai/).
2. Sign up for an account or log in if you already have one.
3. Navigate to the API section in your account settings.
4. Generate a new API key and copy it for use in the extension.

## Supported AI Models

The following AI models are supported in the DeepQwen Coder extension:

- **DeepSeek Coder V2 Lite**: `deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct`
- **Qwen 2.5 Coder 7B**: `Qwen/Qwen2.5-Coder-7B`
- **Qwen 2.5 Coder 7B Instruct**: `Qwen/Qwen2.5-Coder-7B-Instruct`
- **Qwen 2.5 Coder 32B Instruct**: `Qwen/Qwen2.5-Coder-32B-Instruct`
- **DeepSeek V3**: `deepseek-ai/DeepSeek-V3`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.