# Face recog

Aplicativo em Cordova para reconhecer a emoção da pessoa através da camera frontal utilizando a API [deepface](https://github.com/serengil/deepface)

# Detalhes de implementação

\[WIP\]

# Roadmap

-   [x] Montar API de face recog, em Python Flask
-   [x] Deploy API de face recog na [Railway](https://railway.com)
-   [ ] Montar backend do app em ~~Laravel~~ Express (Laravel não estava compilando direito e eu não vou formatar minha maquina agora), contendo cadastro de usuário no banco de dados MySQL (cada usuário tem seu UUID formato Base64 guardado em localstorage como chave primaria) e uma rota para enviar e receber dados para a API da face recog. Talvez seja necessário o uso de WebSockets para manter uma conexão consistente com o backend
-   [ ] Deploy backend do app na Railway
-   [ ] Criação do frontend no monaca (esse repo)
