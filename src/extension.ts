import * as vscode from 'vscode';
import { NebiusAIProvider } from './nebiusAIProvider';
import { ChatPanel } from './panels/ChatPanel';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "DeepQwen Coder" is now active!');
    
    const nebiusProvider = new NebiusAIProvider();
    
    // Register commands
    const chatCommand = vscode.commands.registerCommand('nebius-ai.chat', () => {
        ChatPanel.createOrShow(); // Open chat panel
    });

    const selectCodeCommand = vscode.commands.registerCommand('nebius-ai.selectCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);
            if (selectedText) {
                ChatPanel.createOrShow(selectedText); // Pass selected text to chat panel
            } else {
                vscode.window.showWarningMessage('No code selected. Please select some code to chat about.');
            }
        } else {
            vscode.window.showWarningMessage('No active editor found. Please open a file and select some code.');
        }
    });

    // Add commands to context subscriptions
    context.subscriptions.push(chatCommand, selectCodeCommand);
}

export function deactivate() {
    console.log('Extension "DeepQwen Coder" is now deactivated.');
}