# Arquitetura do Projeto — App Dropmessage

## 1. Objetivo da arquitetura
A arquitetura do projeto foi pensada para separar claramente:
- a interface com o usuário;
- a lógica de negócio e integrações;
- os serviços de persistência e comunicação;
- os recursos nativos do dispositivo.

O resultado é uma aplicação modular, com componentes standalone e serviços especializados que facilitam manutenção e evolução.

---

## 2. Arquitetura geral

### 2.1 Camadas principais

```text
┌──────────────────────────────────────────────┐
│               Camada de Apresentação          │
│  Components, Pages, Templates, Directives     │
└──────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────┐
│          Camada de Serviços / Aplicação       │
│  Guards, Resolvers, Interceptors, Services    │
└──────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────┐
│      Camada de Integração e Infraestrutura    │
│  HTTP API, Socket.IO, Capacitor Plugins, Env  │
└──────────────────────────────────────────────┘
```

### 2.2 Padrões adotados
- **Standalone components** para reduzir dependência de módulos gigantes;
- **Lazy loading** nas rotas para carregamento sob demanda;
- **Services** para centralizar acesso a dados e APIs;
- **Guards** para proteger telas com autenticação;
- **Resolvers** para validar e preparar dados antes da navegação;
- **Interceptors** para automatizar autenticação e headers;
- **Capacitor** para usar recursos nativos como câmera, splash e status bar.

---

## 3. Estrutura lógica do projeto

### 3.1 `src/app/pages`
Esta pasta reúne as telas da aplicação separadas por domínio:

- `auth/`
  - rotas relacionadas a login, cadastro e consentimento
- `home/`
  - fluxo principal do app após autenticação
  - contém módulos como:
    - feed / publicação
    - chat
    - notificações
    - perfil
    - IA
    - checkout e assinatura
    - telas de recompensa e anúncios

### 3.2 `src/app/shared`
Esta pasta concentra código reutilizável entre telas.

#### Subpastas principais
- `service/`
  - comunicação com backend
  - persistência local
  - socket events
  - pagamentos e anúncios
- `interceptors/`
  - interceptação de requests para token/autenticação
- `guard/`
  - controle de acesso
- `resolver/`
  - preparação de dados para navegação
- `interface/`
  - contratos e modelos usados na aplicação
- `adapter/`
  - transformação de dados de API para formato adequado da UI
- `component/`
  - elementos reutilizáveis
- `directives/`
  - comportamentos e manipulação visual/customização
- `validators/`
  - validação de formulário
- `utils/`
  - helpers específicos da aplicação

---

## 4. Fluxo de navegação

### 4.1 Rotas principais
A aplicação possui dois grandes blocos de navegação:

1. **Autenticação**
   - `/auth/sign`
   - `/auth/signup`
   - `/auth/information-user-registred`
   - `/auth/privacy-police`

2. **Área logada**
   - `/home/main`
   - `/home/main/post-message`
   - `/home/main/chat`
   - `/home/main/notification`
   - `/home/main/profile`
   - telas complementares para assinatura, pagamento, recompensa e perfil

### 4.2 Comportamento das rotas
- `AuthGuard` controla acesso inicial à autenticação.
- `AuthHomeGuard` controla acesso à área logada.
- `VerifyUserPermissionResolver` prepara validações antes de abrir o fluxo principal.

---

## 5. Integrações principais

### 5.1 HTTP e API
A aplicação consome backend via `HttpClient` e usa configuração dinâmica conforme o ambiente.

### 5.2 WebSockets
Socket.IO é usado para eventos em tempo real, especialmente para:
- novas mensagens;
- atualizações de post/message;
- notificações/expiração de conteúdo.

### 5.3 Recursos nativos
Capacitor fornece acesso a:
- câmera;
- geolocalização;
- splash screen;
- status bar;
- preferências locais;
- Google Auth;
- anúncios e monetização.

### 5.4 Internacionalização
O projeto carrega traduções de arquivos em `assets/i18n` e usa `TranslateModule` para alternar idioma com base no dispositivo.

---

## 6. Configuração de ambientes
O arquivo [src/environment.config.ts](src/environment.config.ts) define 3 ambientes:

- `production`
- `development`
- `mock`

Cada ambiente define:
- URL base da API;
- URL base do WebSocket;
- path da API;
- flags de produção/mock;
- chave de geolocalização.

Isso facilita testes locais, ambientes simulados e produção real.

---

## 7. Arquitetura do build

### 7.1 Angular build
O projeto usa configuração do Angular CLI para build em:
- `dist/app-dropmessage`

### 7.2 Capacitor build
A plataforma mobile é configurada pelo arquivo [capacitor.config.ts](capacitor.config.ts), que define:
- identificador do app;
- nome do app;
- diretório web;
- plugins nativos;
- esquema de deep link.

### 7.3 Android
A pasta [android](android) contém o projeto Android gerado pelo Capacitor, incluindo:
- gradle;
- recursos;
- manifest;
- assets do app nativo.

---

## 8. Padrões de código observados
- componentes com estrutura `component.ts`, `component.html`, `component.scss`;
- arquivos `.spec.ts` para testes unitários;
- separação entre telas e serviços compartilhados;
- uso de tipagens interfaces para contratos;
- manipulação de respostas via `Observable` com RxJS.

---

## 9. Resumo da arquitetura
A arquitetura do projeto pode ser entendida como:

- **Angular standalone + rotas orientadas a telas**;
- **camada de serviços para integração**;
- **uso de Capacitor para mobile nativo**;
- **socket e HTTP em paralelo**;
- **arquitetura favorável a escalabilidade e manutenção**.

Em resumo, o app é uma aplicação front-end mobile com forte separação entre UI, regras de acesso, integrações externas e recursos nativos.
