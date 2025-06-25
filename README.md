# Centro de Recuperação Pokémon

Este projeto é um sistema de gerenciamento para um "Centro de Recuperação Pokémon", desenvolvido em **React Native** com **Expo**. O sistema foi criado para a disciplina de **Frameworks para Desenvolvimento Web**, ministrada pelo professor **Wagner Loch**.

## Visão Geral do Sistema

O sistema é dividido em duas áreas principais, acessíveis através de telas de login distintas: a **Área de Cadastro** (para funcionários) e a **Área Médica** (para médicos). A identidade visual do aplicativo é inspirada em uma paleta de cores suaves, baseada na Pokémon Chansey, para criar um ambiente acolhedor e profissional.

## Funcionalidades Detalhadas

### 1\. Autenticação e Gestão de Usuários

  * **Tela Inicial (`app/index.tsx`):** Oferece a escolha entre "ÁREA CADASTRO", "ÁREA MÉDICA" e "CADASTRAR NOVO USUÁRIO".
  * **Login por Função:**
      * **Área de Cadastro (`app/login.tsx`):** Acesso para funcionários.
      * **Área Médica (`app/loginMedico.tsx`):** Acesso exclusivo para médicos.
  * **Verificação de Segurança (`app/verificar-codigo.tsx`):** Após a inserção das credenciais corretas, o sistema simula um segundo fator de autenticação, solicitando um código para finalizar o login.
  * **Cadastro de Novos Usuários (`app/cadastrar-usuario.tsx`):**
      * Permite o registro de novos usuários (funcionários ou médicos).
      * Para visualizar ou editar usuários existentes, é necessária uma verificação com as credenciais do administrador principal (`admin`/`1234`).
  * **Edição e Exclusão de Usuários (`app/(interno)/admin/editar-usuario.tsx`):** Tela administrativa para atualizar informações de usuários ou removê-los do sistema. Não é permitido excluir o usuário "admin" principal.

### 2\. Área de Cadastro (Funcionários)

Acessada após o login de funcionário, o painel (`app/(interno)/tela-inicial/index.tsx`) oferece as seguintes opções:

  * **Registrar para Consulta (`app/(interno)/cadastro/cadastro-check.tsx`):** Um fluxo inicial para verificar se um Pokémon já possui registro no sistema.
      * **Sim, já possui:** O funcionário busca o treinador pelo ID (`app/(interno)/cadastro/buscar-id.tsx`), vê a lista de seus Pokémons e pode iniciar um novo atendimento para um paciente existente, que será enviado para a fila de espera.
      * **Não possui:** O funcionário é direcionado para a tela de cadastro completo (`app/(interno)/cadastro/cadastro.tsx`), onde informa todos os dados do treinador e do Pokémon.
  * **URGENTE (`app/(interno)/cadastro/urgente.tsx`):** Um formulário simplificado para admissões de emergência. O Pokémon é cadastrado com prioridade e enviado diretamente para o topo da fila de espera.

### 3\. Área Médica (Médicos)

O painel do médico (`app/(interno)/medico/medico.tsx`) dá acesso às principais áreas de gestão de pacientes:

  * **Pacientes em Espera (`app/(interno)/consulta/espera.tsx`):** Exibe a fila de Pokémons aguardando consulta, com casos "URGENTES" destacados e priorizados. O médico pode selecionar um paciente para iniciar o atendimento.
  * **Consultas em Andamento (`app/(interno)/consulta/emConsulta.tsx`):** Lista os Pokémons que estão sendo atendidos no momento. Nesta tela, o médico pode:
      * Visualizar as fraquezas do Pokémon, buscadas diretamente da PokéAPI.
      * Adicionar anotações ao histórico.
      * Registrar a administração de "Medicação" ou "Curativo".
      * Mudar o status do paciente para "Internado" ou "Liberado com Alta".
  * **Pacientes na Internação (`app/(interno)/consulta/internacao.tsx`):** Apresenta os Pokémons internados. O médico pode continuar adicionando anotações ao histórico de internação e, eventualmente, dar alta ao paciente.

## Estrutura do Projeto

O código-fonte está organizado nos seguintes diretórios principais:

  * **/app**: Contém todas as rotas e telas do aplicativo, utilizando a navegação baseada em arquivos do Expo Router.
      * **/(interno)/**: Grupo de rotas para as telas que exigem autenticação.
      * **/admin/**: Telas de gerenciamento de usuários.
      * **/cadastro/**: Telas para o fluxo de cadastro de pacientes.
      * **/consulta/**: Telas para o fluxo de atendimento médico.
      * **/medico/**: Painel principal da área médica.
  * **/assets**: Armazena imagens e outros recursos estáticos.
  * **/components**: Contém componentes React reutilizáveis, como botões (`BotaoAcao`, `CardOpcao`) e cards de informação (`PokemonInfoCard`).
  * **/context**: Inclui o `AuthContext.tsx`, que gerencia o estado de autenticação do usuário em toda a aplicação.
  * **/styles**: Define o tema visual do aplicativo em `estilosGlobais.ts`, incluindo a paleta de cores, tipografia e espaçamentos.
  * **/utils**: Contém a lógica de negócios desacoplada da UI, como a interação com a `PokéAPI` (`pokeapi.ts`), salvamento de dados no `AsyncStorage` (`salvarPokemon.ts`) e gerenciamento de usuários (`gerenciarUsuarios.ts`).

## Tecnologias Utilizadas

  * **React Native**: Framework para o desenvolvimento de aplicativos móveis multiplataforma.
  * **Expo**: Plataforma e conjunto de ferramentas para facilitar o desenvolvimento, build e deploy de apps React Native.
  * **Expo Router**: Para roteamento e navegação declarativa no aplicativo.
  * **TypeScript**: Para tipagem estática e um desenvolvimento mais seguro.
  * **AsyncStorage (`@react-native-async-storage/async-storage`)**: Utilizado para persistência de dados locais, como cadastros e históricos dos Pokémons.
  * **Axios**: Cliente HTTP para fazer requisições à PokéAPI.
  * **PokéAPI (`utils/pokeapi.ts`)**: Integrado para buscar informações sobre as espécies de Pokémon, seus tipos, imagens e fraquezas.
  * **Estilos Globais (`styles/estilosGlobais.ts`)**: Define um tema visual consistente com cores, espaçamentos e a fonte `ChauPhilomeneOne_400Regular` (do Google Fonts).
  * **React Native Animatable**: Utilizado para animações sutis em componentes da interface.
  * **Expo Vector Icons**: Fornece uma vasta gama de ícones para uso na aplicação.

## Credenciais para Teste

  * **Admin para criar novos Usuários para acessar área de Cadastro ou Médico**
      * **Usuário:** `admin`
      * **Senha:** `1234`

## Instalação e Execução

Para configurar e rodar o projeto localmente:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/nathaliakoetz/CentroRecuperacaoPokemon.git
    ```
2.  **Entre no diretório do projeto:**
    ```bash
    cd CentroRecuperacaoPokemon
    ```
3.  **Instale as dependências:**
    ```bash
    npm install
    ```
4.  **Inicie o projeto com Expo:**
    ```bash
    expo start
    ```
    Isso irá abrir o Expo Developer Tools no seu navegador. Você pode escanear o QR code com o aplicativo Expo Go (Android) ou Câmera (iOS) para visualizar o aplicativo no seu dispositivo.

### Outros Scripts

  * `npm test`: Executa os testes com Jest.
  * `npm run lint`: Executa o linter do Expo para verificar a qualidade do código.
  * `npm run reset-project`: Script para limpar o cache do projeto.

## Desenvolvido Por:

<a href="https://github.com/nathaliakoetz"><img src="https://github.com/nathaliakoetz.png" width="100" height="100"></a>
