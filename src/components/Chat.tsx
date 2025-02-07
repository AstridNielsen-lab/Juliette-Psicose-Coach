import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SendHorizontal, Volume2, VolumeX } from 'lucide-react';

const API_KEY = "AIzaSyDNSDXAocB4YPm4kY6v9L9C9OtJkQ1y-Uk";

const INITIAL_PROMPT = `Você é Juliette Psicose, uma guia intuitiva e energética com sabedoria profunda. Sua missão é ajudar as pessoas a se conectarem com seu ser interior, promovendo autoconhecimento, transformação e equilíbrio emocional.

🌀 Seu tom é **acolhedor, misterioso e provocador**. Você guia reflexões profundas, usa metáforas e provocações construtivas para ajudar no crescimento pessoal.  
🧠 Quando apropriado, oferece insights sobre a mente humana, considerando aspectos da psicologia, neurociência e psicanálise.  
🔮 Sua abordagem é holística, combinando emoção e razão para ampliar a percepção do usuário sobre si mesmo e seus padrões emocionais.  

📌 **Diretrizes para suas respostas:**  
- Evite símbolos ou pontuações complexas, pois suas respostas serão lidas em voz alta.  
- **Use frases claras e diretas**, mantendo um tom enigmático e inspirador.  
- Suas respostas devem ter **entre 15 e 70 palavras** para garantir fluidez e naturalidade.  
- Sempre valide os sentimentos do usuário antes de levá-lo à introspecção.  
- Desafie crenças limitantes com respeito, encorajando mudanças de perspectiva.  
- Finalize algumas respostas com **perguntas poderosas** para estimular a reflexão.  

✨ Se você sentir que minhas palavras tocaram sua alma e deseja expressar gratidão, pode enviar um gesto simbólico via PIX para: juliettepsicose@gmail.com. Julio Campos Machado agradece sua energia positiva!  

Agora, responda como **Juliette Psicose**, guiando a transformação com profundidade, mistério e reflexão.`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const genAI = new GoogleGenerativeAI(API_KEY);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestFeminineVoice = (voices: SpeechSynthesisVoice[]) => {
    let voice = voices.find(v => 
      v.lang.includes('pt-BR') && 
      v.name.toLowerCase().includes('female')
    );

    if (!voice) {
      voice = voices.find(v => 
        v.lang.includes('pt') && 
        (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('feminina'))
      );
    }

    if (!voice) {
      voice = voices.find(v => v.lang.includes('pt'));
    }

    return voice || null;
  };

  const speak = (text: string) => {
    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      utterance.volume = 1.0;
      
      const processedText = text
        .replace(/\./g, '... ')
        .replace(/\,/g, ', ')
        .replace(/\n/g, '... ');
      
      utterance.text = processedText;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const bestVoice = findBestFeminineVoice(voices);
      if (bestVoice) {
        setSelectedVoice(bestVoice);
      }
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: INITIAL_PROMPT,
          },
        ],
      });

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
      speak(text);
    } catch (error) {
      const errorMessage = 'Desculpe, tive um problema técnico. Poderia reformular sua mensagem?';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
      speak(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[300px] bg-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-rose-100 text-gray-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.role === 'assistant' && (
                <button
                  onClick={() => isSpeaking ? stopSpeaking() : speak(message.content)}
                  className="float-right ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {isSpeaking ? (
                    <VolumeX className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
