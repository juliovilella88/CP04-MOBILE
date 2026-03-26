Projeto Mobile - App de Notas com Firebase

//Integrantes//
Guilherme Braganholo RM560628
Julio Cesar Dias Vilella RM560494
Gabriel Nakamura Ogata RM560671
 
//Descrição do Projeto//
Aplicação mobile desenvolvida com React Native + Expo, que permite ao usuário:
Criar conta
Realizar login
Gerenciar notas pessoais (CRUD)
Armazenar dados em tempo real no Firebase
O sistema utiliza autenticação e banco de dados em nuvem, garantindo persistência e organização dos dados por usuário.

//Funcionalidades//
Cadastro de usuário com e-mail e senha
Login com autenticação Firebase
Criação de notas
Listagem de notas
Edição de notas
Exclusão de notas
Logout do sistema

//Tecnologias Utilizadas//
React Native
Expo
TypeScript
Firebase Authentication
Firestore Database
AsyncStorage

//Estrutura do Banco de Dados//
Os dados são armazenados no Firebase Firestore, organizados por usuário autenticado.
Estrutura:
usuarios/{uid}/notas/{notaId}
Cada nota contém:
titulo
descricao
criadoEm

//Como Executar o Projeto//
Instalar dependências:
npm install
Rodar o projeto:
npx expo start
Abrir no celular com o app Expo Go ou emulador Android

//Configuração do Firebase//
O projeto utiliza Firebase para autenticação e banco de dados.
É necessário configurar:
Authentication (Email/Senha)
Firestore Database (modo teste)
As credenciais estão no arquivo:
services/firebaseConfig.tsx

//Observações//
Os dados são armazenados por usuário autenticado
O sistema utiliza persistência local com AsyncStorage
O Firestore está configurado em modo teste para facilitar o desenvolvimento

