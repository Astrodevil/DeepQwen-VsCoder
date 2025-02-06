import * as vscode from 'vscode';
import { NebiusAIProvider } from '../nebiusAIProvider';

export class ChatPanel {
    public static currentPanel: ChatPanel | undefined;

    private readonly _panel: vscode.WebviewPanel;
    private readonly nebiusProvider: NebiusAIProvider;

    private constructor(panel: vscode.WebviewPanel, selectedCode: string | undefined) {
        this._panel = panel;
        this.nebiusProvider = new NebiusAIProvider();

        // Set up the webview content
        this._panel.webview.html = this.getWebviewContent(selectedCode);

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(async message => {
            switch (message.command) {
                case 'sendMessage':
                    const response = await this.nebiusProvider.sendMessage(message.text, message.model, message.apiKey, message.codeContext);
                    this._panel.webview.postMessage({ command: 'receiveMessage', text: response });
                    break;
            }
        });
    }

    public static createOrShow(selectedCode?: string) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (ChatPanel.currentPanel) {
            ChatPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'nebiusAIChat',
            'DeepQwen Coder Chat',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        ChatPanel.currentPanel = new ChatPanel(panel, selectedCode);
    }

    private getWebviewContent(selectedCode: string | undefined) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>DeepQwen Coder Chat</title>
            <style>
                body { 
                    font-family: 'Arial', sans-serif; 
                    padding: 20px; 
                    background-color: #f4f4f4; 
                    color: #333; 
                }
                h1 { 
                    color: #007acc; 
                    text-align: center; 
                }
                #chat { 
                    border: 1px solid #ccc; 
                    height: 300px; 
                    overflow-y: scroll; 
                    margin-bottom: 10px; 
                    padding: 10px; 
                    background-color: #fff; 
                    border-radius: 5px; 
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                #input, #codeContext { 
                    width: 100%; 
                    border-radius: 5px; 
                    border: 1px solid #ccc; 
                    padding: 10px; 
                    margin-bottom: 10px; 
                }
                button { 
                    background-color: #007acc; 
                    color: white; 
                    padding: 10px; 
                    border: none; 
                    border-radius: 5px; 
                    cursor: pointer; 
                    transition: background-color 0.3s;
                }
                button:hover { 
                    background-color: #005a9e; 
                }
                .message { 
                    margin: 5px 0; 
                    padding: 5px; 
                    border-radius: 5px; 
                }
                .user { 
                    background-color: #e0f7fa; 
                    color: #007acc; 
                    font-weight: bold; 
                }
                .ai { 
                    background-color: #ffe0b2; 
                    color: #d14; 
                    font-weight: bold; 
                }
                pre { 
                    background-color: #f0f0f0; 
                    padding: 10px; 
                    border-radius: 5px; 
                    overflow-x: auto; 
                    white-space: pre-wrap; 
                    word-wrap: break-word; 
                }
                code { 
                    font-family: monospace; 
                    color: #d14; 
                    background-color: #f9f9f9; 
                    padding: 2px 4px; 
                    border-radius: 3px; 
                }
            </style>
        </head>
        <body>
            <h1>DeepQwen Coder Chat</h1>
            <label for="apiKey">API Key:</label>
            <input type="text" id="apiKey" placeholder="Enter your API key" />
            <label for="modelSelect">Select Model:</label>
            <select id="modelSelect">
                <option value="deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct">DeepSeek Coder V2 Lite</option>
                <option value="Qwen/Qwen2.5-Coder-7B">Qwen 2.5 Coder 7B</option>
                <option value="Qwen/Qwen2.5-Coder-7B-Instruct">Qwen 2.5 Coder 7B Instruct</option>
                <option value="Qwen/Qwen2.5-Coder-32B-Instruct">Qwen 2.5 Coder 32B Instruct</option>
                <option value="deepseek-ai/DeepSeek-V3">DeepSeek V3</option>
            </select>
            <label for="codeContext">Code Context:</label>
            <textarea id="codeContext" rows="5" placeholder="Selected code will appear here...">${selectedCode || ''}</textarea>
            <div id="chat"></div>
            <textarea id="input" rows="3" placeholder="Type your message here..."></textarea>
            <button id="send">Send</button>
            <button id="addCode">Add Selected Code</button>
            <script>
                const vscode = acquireVsCodeApi();
                document.getElementById('send').onclick = () => {
                    const text = document.getElementById('input').value;
                    const model = document.getElementById('modelSelect').value;
                    const apiKey = document.getElementById('apiKey').value;
                    const codeContext = document.getElementById('codeContext').value;

                    if (!text || !apiKey) return;

                    vscode.postMessage({
                        command: 'sendMessage',
                        text,
                        model,
                        apiKey,
                        codeContext
                    });

                    document.getElementById('chat').innerHTML += '<div class="message user">You: ' + text + '</div>';
                    document.getElementById('input').value = '';
                };

                document.getElementById('addCode').onclick = () => {
                    const selectedCode = window.getSelection().toString();
                    if (selectedCode) {
                        document.getElementById('codeContext').value += selectedCode + '\\n';
                    } else {
                        vscode.window.showWarningMessage('No code selected. Please select some code to add.');
                    }
                };

                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.command === 'receiveMessage') {
                        const formattedResponse = message.text.includes('\\n') 
                            ? '<pre><code>' + message.text.replace(/\\n/g, "<br>") + '</code></pre>' 
                            : '<div class="message ai">AI: <strong>' + message.text + '</strong></div>';
                        document.getElementById('chat').innerHTML += formattedResponse;
                    }
                });
            </script>
        </body>
        </html>`;
    }
}