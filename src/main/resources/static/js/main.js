var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

// criar duas novas propriedades para uso e "conexão " com o SpringBoot
var stompClient = null;
var username = null;

// criar um arrya com cores hexadecimais para os avatares dos usuarios
var colors = ['#2196F3', '#32C787', '#00BCD4', '#FF56525',
    '#FFC107', '#FF85AF', '#FF9800', '#39BBB0'];

/*
===========================================================================================
ESTA É O "CORAÇÃO" DA APLICAÇÃO CLIENT - A LÓGICA DE CONEXÃO, ADIÇÃO DE USUARIO E ENVIO
DE MENSAGEM
===========================================================================================
*/

// definir uma função para estabelecer a conexão da aplicação client com a aplicação
// server
function connect(event){
    username = document.querySelector('#name').value.trim();

    // estabelecer uma estrutura de decisão obervar se existe um valor neste input
    // se caso exister o usuário será devidamente conetado
    if(username){
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        // criar uma variavel local para instaciar a conexão com o socket
        var socket = new SockJS('/ws');
        // fazer uso da conexão criada para estabelecer e fazer uso do
        // protocolo de troca de mensagem
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}


// definir uma nova função para estabelever o contexto de operação da aplicação
// client
function onConnected(){
    // estabelecer o acesso ao chat pelo topico public "/topic/public"
    stompClient.subscribe('/topic/public', onMessageReceived);

    // informar a aplicação server o nome do usuario
    stompClient.send('/app/chat.addUser', {},
        JSON.stringify({sender: username, type: 'JOIN'}))
    connectingElement.classList.add('hidden');
}

// estabelecer a função onError
function onError(){
    connectingElement.textContent =
        'Não foi possivel concetar ao servidor WebSocket. Tente novamente mais tarde.'
    connectingElement.style.color = 'red';

}

// estabelecer um novo método - sendMessage() - para que a aplicação client
// possa, uma vez devidamente conectada ao WebSocket, enviar as mensagens

function sendMessage(event){
// aqui, está estabelecida a propriedade que obtem do input de mensagens
// o valor a ser enviado para o chat
    var messageContent = messageInput.value.trim();

    // estrutura de decisão para que se ocorrer um valor a partir do input
    // este mesmo valor possa ser enviado para a conversa junto com o nome
    // do usuario

    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };


        // definir a "rota" de envio para a mensagem
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}
/*
=================================================================
LÓGICA PARA FORMATAR A EXIBICAO DA CONVERSA, MANIPULACAO DA VIEW
=================================================================
 */

// funcao para definir propriedades das mensagens recebidas
function onMessageReceived(payload){
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    // estabelecer uma estrutura de decisao para que seja observado o comportamento da aplicacao
    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' entrou na conversa';
    } else if(message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' saiu da conversa';
    } else {
        messageElement.classList.add('chat-message');

        // criacao do avatar do usuario
        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        // aqui, cada mensagem enviada por um usuario recebe seu icone de identificacao
        messageElement.appendChild(avatarElement);

        // definir as propriedades em exibicao do usuario
        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);

        // aqui, cada mensagem enviada por um usuario recebe sua identificacao
        messageElement.appendChild(usernameElement);
    }

    // aqui, estabelecer a formatacao de exibicao das mensagens da conversa entre as aplicacoes
    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);

    textElement.appendChild(messageText);
    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

// funcao para obter uma cor para o avatar do usuario
function getAvatarColor(messageSender){
    // definir uma propriedade p/ ser acumuladora de determinados valores
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        //     32 (-1)                                     01234
        hash = 31 * hash + messageSender.charCodeAt(i); // Rhama
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

// definir o uso das propriedades usernameForm e messageForm
usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);