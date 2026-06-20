# Documentação do Projeto — App Dropmessage

## 1. Descrição geral

O projeto **App Dropmessage** é uma aplicação front-end mobile-first construída com **Angular 18** e empacotada com **Capacitor** para rodar como aplicativo Android (e potencialmente em outras plataformas compatíveis com Capacitor).

A aplicação apresenta um fluxo de onboarding e interação social com foco em:
- autenticação e cadastro de usuário;
- perfil, avatar e descrição pessoal;
- publicação de mensagens e interações sociais;
- chat e notificações;
- integração com anúncios (AdMob), pagamentos/assinaturas e recompensas por vídeo;
- uso de recursos nativos como câmera, localização, splash screen e status bar.

O projeto aparenta ser um app de relacionamento / engajamento social com telas específicas para cadastro, perfil, mensagens, IA e assinatura premium.

---

## 2. Arquitetura da aplicação

### 2.1 Visão geral da arquitetura
A aplicação segue um padrão baseado em:
- **Angular standalone components**;
- **rutas lazy-loaded**;
- **services** para consumo de APIs e lógica compartilhada;
- **guards/resolvers** para controle de acesso;
- **interceptors** para autenticação;
- **Capacitor** para acesso a funcionalidades nativas.

### 2.2 Fluxo de inicialização
1. O bootstrap ocorre em [src/main.ts](src/main.ts).
2. O arquivo [src/app/app.config.ts](src/app/app.config.ts) configura:
   - roteamento;
   - HTTP client;
   - internacionalização (`ngx-translate`);
   - máscara de inputs (`ngx-mask`);
   - animações;
   - conexão com Socket.IO;
   - interceptadores.
3. O componente raiz [src/app/app.component.ts](src/app/app.component.ts) executa inicialização de idioma, status bar e splash screen.
4. As rotas principais estão definidas em [src/app/app.routes.ts](src/app/app.routes.ts), que agrupam:
   - rotas de autenticação;
   - rotas da área logada (home).

### 2.3 Padrão de organização
A estrutura do projeto foi organizada em camadas:
- **pages**: telas da aplicação;
- **shared**: serviços, diretivas, interfaces, adapters, utilidades, validadores e componentes reutilizáveis;
- **assets**: imagens, fontes, ícones, animações e traduções;
- **android**: configuração nativa do Android/Capacitor.

---

## 3. Estrutura de pastas e arquivos

### 3.1 Estrutura raiz
```text
app-dropmessage/
├── android/                  # Projeto Android gerado pelo Capacitor
├── assets/                   # Assets estáticos globais
├── cert/                     # Certificados/SSL (caso usados localmente)
├── icons/                    # Ícones do app
├── public/                   # Arquivos públicos estáticos
├── src/                      # Código-fonte da aplicação Angular
├── angular.json              # Configuração do Angular CLI
├── capacitor.config.ts       # Configuração do Capacitor
├── package.json               # Dependências e scripts
├── proxy.conf.json            # Proxy para desenvolvimento
├── server.ts                  # Servidor SSR/Express (atualmente comentado)
├── tsconfig.json              # Configurações do TypeScript
├── tsconfig.app.json          # Configurações para app
└── tsconfig.spec.json         # Configurações para testes
```

### 3.2 Pasta `src`
```text
src/
├── app/
│   ├── pages/
│   │   ├── auth/             # Telas de login, cadastro e políticas
│   │   └── home/             # Telas da área logada (feed, chat, perfil, IA, pagamentos etc.)
│   ├── shared/
│   │   ├── adapter/          # Adaptadores de resposta da API para models visuais
│   │   ├── animation/        # Animações customizadas
│   │   ├── component/        # Componentes reutilizáveis
│   │   ├── constants/        # Constantes globais
│   │   ├── directives/       # Diretivas customizadas
│   │   ├── enums/            # Enumerações
│   │   ├── guard/            # Guards de rota
│   │   ├── interceptors/     # Interceptadores HTTP
│   │   ├── interface/        # Tipagens e contratos
│   │   ├── mock/             # Dados mockados ou scaffolding
│   │   ├── resolver/         # Resolvers de rota
│   │   ├── service/          # Serviços de domínio e integração
│   │   ├── utils/            # Helpers utilitários
│   │   └── validators/       # Validadores customizados
│   ├── app.component.ts     # Componente raiz
│   ├── app.config.ts        # Configuração global da app
│   └── app.routes.ts        # Definição das rotas principais
├── assets/
│   ├── fonts/                # Fontes personalizadas
│   ├── i18n/                 # Traduções em PT/EN
│   ├── icon-animation/       # Animações Lottie/JSON
│   ├── icon-static/          # Ícones estáticos SVG
│   ├── images/               # Imagens de apoio
│   └── movie/                # Vídeos/mídia usados no app
├── environment.config.ts     # Configuração de ambientes (prod/dev/mock)
├── index.html                 # HTML base da aplicação
├── main.ts                    # Ponto de entrada da aplicação
└── styles.scss                # Estilos globais e importações do Swiper
```

### 3.3 Pastas de domínio importantes
- **`src/app/pages/auth`**: fluxo inicial de autenticação e cadastro.
- **`src/app/pages/home`**: telas principais da experiência logada.
- **`src/app/shared/service`**: camada de integração com backend e armazenamento local.
- **`src/app/shared/interceptors`**: tratamento automático de tokens e requisições.
- **`src/assets/i18n`**: internacionalização com tradução em múltiplos idiomas.

---

## 4. Tecnologias e versões utilizadas

### 4.1 Framework principal
| Tecnologia | Versão | Observação |
|---|---:|---|
| Angular CLI | 18.2.4 | Ferramenta de build e scaffolding |
| Angular Core | 18.2.0 | Framework principal |
| Angular Router | 18.2.0 | Navegação da aplicação |
| Angular Forms | 18.2.0 | Formulários reativos |
| Angular Material | 18.2.4 | Componentes visuais |
| Angular CDK | 18.2.4 | Componentes base do Material |
| TypeScript | 5.5.2 | Linguagem principal |
| Zone.js | 0.14.10 | Detecção de mudanças |

### 4.2 Mobile / plataforma nativa
| Tecnologia | Versão | Observação |
|---|---:|---|
| Capacitor CLI | 6.1.2 | Ferramenta de build mobile |
| Capacitor Core | 6.1.2 | Runtime nativo |
| Capacitor Android | 6.1.2 | Suporte para Android |
| @capacitor-community/admob | 6.1.0 | Ads / monetização |
| @capacitor/camera | 6.0.2 | Acesso à câmera |
| @capacitor/geolocation | 6.0.1 | Geolocalização |
| @capacitor/preferences | 6.0.2 | Persistência local |
| @capacitor/splash-screen | 6.0.0 | Splash screen |
| @capacitor/status-bar | 6.0.1 | Controle da barra de status |
| codetrix-studio/capacitor-google-auth | 3.4.0-rc.4 | Login com Google |

### 4.3 Reatividade e comunicação
| Tecnologia | Versão | Observação |
|---|---:|---|
| RxJS | 7.8.0 | Streams reativos |
| Socket.IO Client | 4.8.0 | Comunicação em tempo real |
| JWT Decode | 4.0.0 | Decodificação de tokens |
| jsonwebtoken | 9.0.2 | Manipulação de JWT |

### 4.4 UI / UX / mídia
| Tecnologia | Versão | Observação |
|---|---:|---|
| Swiper | 11.1.14 | Carrosséis e telas de conteúdo |
| ngx-lottie | 12.0.0 | Animações Lottie |
| lottie-web | 5.12.2 | Engine de animações |
| ngx-mask | 18.0.3 | Máscara para inputs |
| @ngx-translate/core | 16.0.4 | Internacionalização |
| @ngx-translate/http-loader | 16.0.1 | Loader de traduções |
| Stripe JS | 5.5.0 | Processamento de pagamentos |
| DOMPurify | 3.1.7 | Sanitização de HTML |

### 4.5 Testes e tooling
| Tecnologia | Versão | Observação |
|---|---:|---|
| Karma | 6.4.0 | Runner de testes |
| Jasmine | 5.1.0 | Framework de testes |
| Angular TestBed | (via Angular) | Testes unitários |
| @types/node | 18.18.0 | Tipagens do Node |

### 4.6 Versão do app
- **`package.json`** define a versão da aplicação como: **1.174.0**

---

## 5. Relação entre camadas

```text
UI (Components / Templates)
        ↓
Services (HTTP, Storage, Socket, AdMob, Payments)
        ↓
API / Backend / WebSocket / Capacitor Plugins
        ↓
Persistence / Preferences / Native APIs
```

### 5.1 Camada de apresentação
Responsável por telas, formulários, navegação e componentes visuais.

### 5.2 Camada de domínio / serviços
Responsável por:
- chamadas HTTP;
- cache local;
- sockets;
- autenticação;
- lógica de perfil, chat, anúncio e assinatura.

### 5.3 Camada de infraestrutura
Responsável por:
- configuração de ambiente;
- interceptadores;
- internacionalização;
- plugins nativos;
- build e deploy.

---

## 6. Observações importantes
- O projeto utiliza **rotas lazy-loaded**, o que ajuda na divisão da aplicação em módulos/telas menores.
- A configuração de ambiente permite variar comportamento entre `production`, `development` e `mock`.
- O uso de Capacitor sugere que a aplicação foi desenhada para rodar como app mobile com acesso a APIs nativas.
- Há integração com serviços externos como Stripe, AdMob e autenticação via Google.

---

## 7. Resumo rápido
Este projeto é uma aplicação Angular + Capacitor voltada para mobile, com forte foco em:
- fluxo de cadastro e perfil;
- interação social e mensagens;
- monetização via anúncios e assinatura;
- integração com recursos nativos e serviços externos.
