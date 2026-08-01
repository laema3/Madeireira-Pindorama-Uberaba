import React, { useEffect } from 'react';
import { Shield } from 'lucide-react';
import { PageBanner } from '../components/PageBanner';

export function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-stone-50 min-h-screen">
      <PageBanner 
        title="Política de Privacidade" 
      />
      
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
          <div className="bg-emerald-900 px-6 py-8 md:px-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-800 rounded-full flex items-center justify-center shrink-0">
              <Shield className="text-emerald-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">Política de Privacidade</h2>
              <p className="text-emerald-200 mt-1">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
          
          <div className="p-6 md:p-10 text-stone-700 space-y-8">
            
            <section>
              <h3 className="text-xl font-bold text-emerald-900 mb-3 uppercase tracking-wide text-sm">1. Coleta de Informações</h3>
              <p className="leading-relaxed">
                A Madeireira Pindorama coleta informações pessoais fornecidas voluntariamente por você ao preencher nossos formulários de contato, solicitar orçamentos ou interagir com nosso chat e assistente virtual. Essas informações podem incluir seu nome, e-mail, número de telefone (WhatsApp) e outras informações fornecidas na sua mensagem. 
                Além disso, coletamos dados de navegação anonimamente através de cookies para melhorar a experiência no site.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-emerald-900 mb-3 uppercase tracking-wide text-sm">2. Uso das Informações</h3>
              <p className="leading-relaxed">
                Utilizamos os dados coletados exclusivamente para retornar seus contatos, enviar orçamentos personalizados, responder às suas dúvidas e manter a comunicação sobre nossos produtos e serviços. Caso você autorize, poderemos ocasionalmente enviar novidades e promoções. Seus dados de navegação são usados para fins estatísticos e para aprimorar as funcionalidades da nossa plataforma.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-emerald-900 mb-3 uppercase tracking-wide text-sm">3. Uso de Cookies</h3>
              <p className="leading-relaxed">
                Nosso site utiliza "cookies" para lembrar suas preferências, entender como o site é utilizado e personalizar o conteúdo exibido para você. Você pode configurar seu navegador para recusar todos os cookies ou indicar quando um cookie está sendo enviado, mas isso pode limitar algumas das funcionalidades da página.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-emerald-900 mb-3 uppercase tracking-wide text-sm">4. Compartilhamento e Segurança</h3>
              <p className="leading-relaxed">
                A Madeireira Pindorama leva a segurança de seus dados a sério e adota medidas técnicas adequadas para protegê-los. Nós não comercializamos, alugamos ou repassamos suas informações pessoais a terceiros não autorizados. Elas podem ser acessadas apenas por nossa equipe interna para os fins descritos acima, ou em caso de exigência legal por autoridades competentes.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-emerald-900 mb-3 uppercase tracking-wide text-sm">5. Direitos do Usuário (LGPD)</h3>
              <p className="leading-relaxed">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de solicitar o acesso, a correção ou a exclusão dos seus dados pessoais em nossos registros a qualquer momento. Para exercer esses direitos, ou esclarecer dúvidas sobre esta política, pedimos que entre em contato direto conosco através dos canais oficiais listados em nosso rodapé, como o nosso telefone ou e-mail de atendimento.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-emerald-900 mb-3 uppercase tracking-wide text-sm">6. Alterações da Política</h3>
              <p className="leading-relaxed">
                Reservamo-nos o direito de atualizar esta política de privacidade periodicamente. Quaisquer modificações entrarão em vigor assim que publicadas nesta página. Recomendamos que você revise este documento rotineiramente para se manter atualizado sobre a forma como protegemos suas informações.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
