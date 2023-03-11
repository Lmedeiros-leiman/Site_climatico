# Site climático

Este é um projeto que utiliza [React](https://github.com/facebook/create-react-app).
e por padrão é obrigatório ter ele instalado em seu projeto para utilizar esta aplicação.

## Sobre

O objetivo deste projeto é desenvolver um aplicativo que utiliza uma API para adquirir seus dados e mostra-los para o usuário.
O usuario podera colocar sua localização atual OU a de uma cidade qualquer que exista no planeta Terra e então os dados serão exibidos na tela.

A API utilizada nesta aplicação é a [Open Weather API](https://api.openweathermap.org)

*por utilizar uma api, qualquer erro nos dados será por erro da open weather. este aplicativo apenas mostra os dado.*

## Requesitos para utilizar

- [React](https://github.com/facebook/create-react-app)
- [Conta e chave no site da open weather](https://openweathermap.org/)
### Importante:
ao criar a chave, criar um arquivo na pasta public com o nome "chaveapi.txt" com a chave dentro dele.

caso tenha interesse em mudar para um local mais seguro, a função responsavel pela chave está localizada na pasta chaveapi em src

# Atualizações

### Dia 1:
criado parte principal da aplicação, o usuário pode receber dados da api da sua localização atual.
a fazer :
- adicionar opção de busca por cidade especifica.
- adicinar lista 10 cidades globais (ou proximas?)

* Imagem das modificações visuais no primeiro dia:
  ![Imagem do projeto no primeiro dia:](https://user-images.githubusercontent.com/57924586/224162796-1ec71793-60ab-41c2-872e-bd63d221c64f.png)

### Dia 2:
adicionado entrada de usuário por botão.
a fazer :
### Dia 3:
código optimizado para uma melhor leitura
retiradas funções duplicadas
pequena atualização de segurança
(trocado chave de api)
corrigidos bugs 


