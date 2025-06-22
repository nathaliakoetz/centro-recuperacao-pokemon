# Centro de Recuperação Pokémon 

Este projeto é um sistema simples de gerenciamento para um "Centro de Recuperação Pokémon", desenvolvido em **React Native** com **Expo**. Para a disciplina de **Frameworks para Desenvolvimento Web** ministrada pelo professor **Wagner Loch**.

## Visão Geral do Sistema

O sistema é dividido em duas áreas principais, acessíveis através de telas de login distintas: a **Área de Cadastro** (para funcionários) e a **Área Médica** (para médicos).

## Funcionalidades Detalhadas

### 1\. Telas de Acesso

  - **Tela Inicial (`app/index.tsx`)**: Oferece a escolha entre "ÁREA CADASTRO" e "ÁREA MÉDICA".
  - **Tela de Login - Área de Cadastro (`app/login.tsx`)**: Acesso para funcionários. Credenciais de teste: `Usuário: admin`, `Senha: 1234`.
  - **Tela de Login - Área Médica (`app/loginMedico.tsx`)**: Acesso para médicos. Credenciais de teste: `Usuário: medico`, `Senha: 1234`.

### 2\. Área de Cadastro (`app/(interno)/tela-inicial/index.tsx`)

Após o login como "admin", esta área apresenta as seguintes opções:

  - **Registrar para Consulta (`app/(interno)/cadastro/cadastro-check.tsx`)**: Permite verificar se um Pokémon já possui cadastro.
      - Se "Sim" (`app/(interno)/cadastro/buscar-id.tsx`): Busca Pokémon por ID do treinador e permite iniciar um novo atendimento para um Pokémon existente, atualizando seu histórico e enviando-o para a fila de espera.
      - Se "Não" (`app/(interno)/cadastro/cadastro.tsx`): Realiza o cadastro completo de um novo Pokémon.
  - **URGENTE (`app/(interno)/cadastro/urgente.tsx`)**: Permite o cadastro rápido de Pokémon em situação de emergência, enviando-os diretamente para a fila de espera com status de urgência.

### 3\. Área Médica (`app/(interno)/medico/medico.tsx`)

Após o login como "medico", esta área oferece acesso a:

  - **Pacientes em Espera (`app/(interno)/consulta/espera.tsx`)**: Exibe a fila de Pokémons aguardando consulta, priorizando casos "URGENTES". Permite iniciar a consulta para um paciente.
  - **Consultas em Andamento (`app/(interno)/consulta/emConsulta.tsx`)**: Lista Pokémons atualmente em atendimento. Ao selecionar um Pokémon, o médico pode adicionar notas ao histórico, indicar medicações/curativos e alterar o status para "internado" ou "liberado". Também exibe as fraquezas do Pokémon (buscadas da PokéAPI).
  - **Pacientes na Internação (`app/(interno)/consulta/internacao.tsx`)**: Mostra Pokémons internados. Permite adicionar novas anotações ao histórico de internação e liberar o Pokémon quando o tratamento for concluído.

## Tecnologias Utilizadas

  - **React Native**: Framework para o desenvolvimento de aplicativos móveis multiplataforma.
  - **Expo**: Conjunto de ferramentas para facilitar o desenvolvimento, build e deploy de apps React Native.
  - **Expo Router**: Para roteamento e navegação declarativa no aplicativo.
  - **AsyncStorage (`@react-native-async-storage/async-storage`)**: Utilizado para persistência local dos dados de cadastro e histórico dos Pokémons.
  - **Axios**: Cliente HTTP para fazer requisições a APIs externas, como a PokéAPI.
  - **PokéAPI (`utils/pokeapi.ts`)**: Integrado para buscar informações sobre as espécies de Pokémon, seus tipos, imagens e fraquezas.
  - **Estilos Globais (`styles/estilosGlobais.ts`)**: Define um tema visual consistente com cores, espaçamentos, tipografia (`ChauPhilomeneOne_400Regular` - fonte do Google Fonts).
  - **`react-native-animatable`**: Utilizado para animações em componentes da interface.
  - **`@expo/vector-icons`**: Proporciona uma vasta gama de ícones para uso na aplicação.

## Instalação

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
4.  **Inicie o projeto:**
    ```bash
    expo start
    ```
    Isso irá abrir o Expo Developer Tools no seu navegador. Você pode escanear o QR code com o aplicativo Expo Go ou usar o emulador para visualizar o aplicativo.

## Contribuição

Contribuições são bem-vindas\! Siga os passos abaixo para contribuir:

1.  Faça um fork do projeto.
2.  Crie uma nova branch com sua funcionalidade:
    ```bash
    git checkout -b minha-feature
    ```
3.  Faça suas alterações e commit:
    ```bash
    git commit -m "Minha nova funcionalidade"
    ```
4.  Envie para o repositório principal:
    ```bash
    git push origin minha-feature
    ```
5.  Abra um Pull Request.

## Desenvolvido Por:

<a href="https://github.com/nathaliakoetz"><img src="https://github.com/nathaliakoetz.png" width="100" height="100"></a>
