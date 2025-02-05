import axios from 'axios';

export class NebiusAIProvider {
    private readonly baseUrl = 'https://api.studio.nebius.ai/v1/';

    async sendMessage(message: string, model: string, apiKey: string, codeContext: string): Promise<string> {
        try {
            const fullMessage = `You are a highly skilled coder and developer. Here is the code context:\n\n${codeContext}\n\nUser question: ${message}`;
            const response = await axios.post(
                `${this.baseUrl}chat/completions`,
                {
                    model: model,
                    messages: [
                        {
                            role: 'user',
                            content: fullMessage
                        }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7,
                    stream: false
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error calling Nebius AI:', error);
            throw new Error('Failed to get response from Nebius AI');
        }
    }
} 