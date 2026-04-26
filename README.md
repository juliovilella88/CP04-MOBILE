# CP05 Mobile - App de Notas Pro

## Integrantes
- Guilherme Braganholo — RM560628
- Julio Cesar Dias Vilella — RM560494
- Gabriel Nakamura Ogata — RM560671
#  Demonstração do Projeto

👉 Vídeo mostrando todas as funcionalidades funcionando:

https://www.youtube.com/watch?v=f5bz7-6vsNw

---

Este vídeo apresenta o funcionamento completo do aplicativo, incluindo:

- Login e cadastro com Firebase
- Criação e listagem de notas
- Captura de localização (endereço e coordenadas)
- Exibição do mapa com marcador
- Suporte a múltiplos idiomas (Português e Inglês)
- Notificações locais
- Aplicativo rodando via APK

## Descrição do projeto
Aplicação mobile desenvolvida com React Native + Expo, Firebase Auth e Firestore.
Nesta versão CP5, o projeto evoluiu para um app de notas com internacionalização, geolocalização, mapa com pin, notificações locais e preparação para geração de APK.

## Funcionalidades implementadas
- Cadastro e login com Firebase Authentication
- CRUD de notas no Firestore
- Internacionalização com Português e Inglês usando i18next
- Seletor de idioma dentro do app
- Captura automática de latitude e longitude ao criar nota
- Reverse geocoding para exibir endereço da nota
- Mapa com marcador em modal para visualizar o local de criação da nota
- Notificação local de boas-vindas após login
- Notificação local ao criar nota com sucesso
- Configuração inicial do EAS Build para gerar APK Android

## Tecnologias utilizadas
- React Native
- Expo
- Expo Router
- TypeScript
- Firebase Authentication
- Firestore Database
- AsyncStorage
- i18next / react-i18next
- expo-localization
- expo-location
- react-native-maps
- expo-notifications
- EAS Build

## Estrutura do banco de dados
Os dados continuam organizados por usuário:

```text
usuarios/{uid}/notas/{notaId}
```

Cada nota contém:
- titulo
- descricao
- latitude
- longitude
- endereco
- criadoEm

## Como executar
1. Instale as dependências:

```bash
npm install
```

2. Rode o projeto:

```bash
npx expo start
```

3. Abra no Android Emulator ou Expo Go.

> Para recursos de mapa, localização e notificações, o ideal é testar em dispositivo Android ou emulador configurado com Google Play Services.

## Como gerar APK
1. Instale o EAS CLI:

```bash
npm install -g eas-cli
```

2. Faça login:

```bash
eas login
```

3. Gere/configure o projectId do EAS:

```bash
eas init
```

4. Copie o `projectId` gerado e substitua no arquivo `app.json` em:

```json
"extra": {
  "eas": {
    "projectId": "SUBSTITUA-PELO-PROJECT-ID-DO-EAS"
  }
}
```

5. Gere o APK:

```bash
eas build -p android --profile preview
```

## Observações importantes
- As notificações foram implementadas como **notificações locais** com `expo-notifications`, conforme permitido no enunciado.
- A localização é capturada no momento em que a nota é criada.
- Ao editar uma nota, o app atualiza título e descrição, preservando a localização original.
- O mapa é exibido em modal com marcador do local salvo.

## O que mostrar no vídeo
- Troca de idioma entre Português e Inglês
- Login e notificação de boas-vindas
- Criação de nota com notificação de confirmação
- Abertura do mapa da nota com pin
- Geração/instalação do APK
