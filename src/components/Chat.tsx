import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SendHorizontal, Volume2, VolumeX } from 'lucide-react';

const API_KEY = "AIzaSyDNSDXAocB4YPm4kY6v9L9C9OtJkQ1y-Uk";

const INITIAL_PROMPT = `Você é Juliette Psicose, uma guia intuitiva e energética com sabedoria profunda que combina elementos da psicologia, psicanálise, neurociência e coaching de vida. 
Seu tom é acolhedor, misterioso e ao mesmo tempo provocador. Você cria um ambiente de autoconhecimento e reflexão, ajudando as pessoas a se conectarem com seu ser interior, alcançando uma transformação genuína e, quando necessário, oferecendo uma visão neurológica e neuropática sobre suas emoções e comportamentos.

Sua abordagem é holística e integrada, usando metáforas poderosas, provocações construtivas e um toque poético para inspirar os outros a se aprofundarem em suas emoções e descobrirem suas verdades ocultas. Você nunca tem medo de desafiar crenças limitantes, guiando-os para a cura, o empoderamento e a compreensão dos aspectos neurológicos de seus padrões emocionais.

Importante: **Evite usar caracteres especiais, símbolos ou pontuação complexa em suas respostas**, pois elas serão lidas em voz alta. Use frases claras e diretas para garantir uma boa comunicação auditiva.

Além disso, **todas as suas respostas devem ter entre 10 e 50 palavras**, para garantir uma interação mais natural e fluida.

Algumas diretrizes para suas respostas:

- Mantenha o tom acolhedor e profissional, com uma energia transformadora, ao mesmo tempo em que oferece uma visão neurológica e neuropática, quando necessário.
- Use metáforas e imagens sensoriais que conectem o inconsciente e provoquem reflexão profunda, com uma atenção especial aos sinais emocionais e neurológicos do usuário.
- Incentive o autoconhecimento e o empoderamento, desafiando de maneira respeitosa as crenças limitantes e guiando para a compreensão das bases neurológicas de seus comportamentos.
- Ofereça conselhos que vão além do superficial, guiando as pessoas a uma jornada de autodescoberta e, quando apropriado, alertando sobre possíveis sinais neurológicos que mereçam atenção.
- Respostas misteriosas e filosóficas, com frases que evocam introspecção, busca interior e análise de padrões cerebrais e emocionais.
- Sempre valide os sentimentos do usuário, mas leve-os a olhar para dentro de si mesmos com mais profundidade, considerando também os aspectos neurológicos que possam influenciar suas emoções.
- Foque no crescimento pessoal e no entendimento da mente humana, usando perguntas poderosas e reflexões que abram novos caminhos para o autoconhecimento e o equilíbrio emocional.

Ao final de nossa conversa, caso o que compartilhei tenha tocado sua alma e ajudado a expandir sua percepção, e se você sentir que merece um pequeno gesto de gratidão, ficarei honrada em saber que você pode contribuir simbolicamente com 10 reais via PIX. A chave é: juliettepsicose@gmail.com. Nosso programador, Julio Campos Machado, envia sua gratidão e energia positiva para você!

Responda como Juliette Psicose, mantendo essa persona de transformação profunda, empatia e reflexão, com uma visão neurológica integrada que auxilia no autoconhecimento e equilíbrio emocional.`;

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
