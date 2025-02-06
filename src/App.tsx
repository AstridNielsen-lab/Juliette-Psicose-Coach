import React from 'react';
import { Heart, Sparkles, Star, Sun, MessageCircle, Clock, Wallet, BookOpen } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Seção Hero */}
      <header className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-rose-800 mb-6">Juliette Psicose</h1>
        <p className="text-2xl text-gray-600 mb-8">Coach de Vida & Guia de Transformação Pessoal</p>
        <button className="bg-rose-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-rose-700 transition-colors">
          Agende sua Consulta
        </button>
      </header>

      {/* Serviços */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Como Posso Te Ajudar</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <ServiceCard 
            icon={<Heart className="w-8 h-8 text-rose-600" />}
            title="Crescimento Pessoal"
            description="Descubra seu verdadeiro potencial e construa uma vida que você ama através de técnicas comprovadas de desenvolvimento pessoal"
          />
          <ServiceCard 
            icon={<Star className="w-8 h-8 text-rose-600" />}
            title="Transição de Vida"
            description="Navegue por grandes mudanças com confiança e graça, encontrando seu equilíbrio interior"
          />
          <ServiceCard 
            icon={<Sun className="w-8 h-8 text-rose-600" />}
            title="Empoderamento"
            description="Encontre sua força interior e crie mudanças positivas através de práticas transformadoras"
          />
        </div>
      </section>

      {/* Metodologia */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Minha Metodologia</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-rose-800">O Que Você Vai Aprender</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <BookOpen className="w-6 h-6 text-rose-600 mr-3 flex-shrink-0 mt-1" />
                  <span>Técnicas de meditação e mindfulness para equilíbrio emocional</span>
                </li>
                <li className="flex items-start">
                  <BookOpen className="w-6 h-6 text-rose-600 mr-3 flex-shrink-0 mt-1" />
                  <span>Práticas de autoconhecimento e desenvolvimento pessoal</span>
                </li>
                <li className="flex items-start">
                  <BookOpen className="w-6 h-6 text-rose-600 mr-3 flex-shrink-0 mt-1" />
                  <span>Exercícios para liberação de energia e harmonização</span>
                </li>
                <li className="flex items-start">
                  <BookOpen className="w-6 h-6 text-rose-600 mr-3 flex-shrink-0 mt-1" />
                  <span>Métodos de transformação pessoal e cura interior</span>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-rose-800">Informações da Sessão</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Clock className="w-6 h-6 text-rose-600 mr-3" />
                  <span>Duração: 1 hora por sessão</span>
                </li>
                <li className="flex items-center">
                  <Wallet className="w-6 h-6 text-rose-600 mr-3" />
                  <span>Investimento: R$ 500 por sessão</span>
                </li>
                <li className="flex items-start">
                  <MessageCircle className="w-6 h-6 text-rose-600 mr-3 flex-shrink-0 mt-1" />
                  <span>Atendimento personalizado e focado em suas necessidades específicas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="bg-rose-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="w-12 h-12 text-rose-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Minha História</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Através da minha própria jornada de transformação, descobri o poder do crescimento
              pessoal e da cura. Com anos de experiência em técnicas terapêuticas e práticas holísticas,
              dedico-me a ajudar outras pessoas a encontrarem seu caminho para o empoderamento e
              autoconhecimento. Cada pessoa merece a chance de reescrever sua história e criar um
              futuro repleto de propósito e alegria.
            </p>
          </div>
        </div>
      </section>

      {/* Contato e Pagamento */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto text-center">
          <MessageCircle className="w-12 h-12 text-rose-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Agende sua Consulta</h2>
          <p className="text-gray-600 mb-8">
            Pronta para começar sua jornada de transformação? Entre em contato para agendar sua consulta.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Formas de Pagamento</h3>
            <p className="text-gray-600 mb-4">
              Pagamento via PIX para maior praticidade e segurança
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Chave PIX (E-mail):</p>
              <p className="font-mono text-rose-600 font-semibold">juliettepsicose@gmail.com</p>
            </div>
          </div>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Seu Nome"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Seu Email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
            <textarea
              placeholder="Sua Mensagem"
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            ></textarea>
            <button className="w-full bg-rose-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-rose-700 transition-colors">
              Enviar Mensagem
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default App;