package com.example.chatapp.controller;

import com.example.chatapp.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;


// aqui é definido  os recursos necessarios para estabelecer o funcionamento da aplicacao
@Controller
public class ChatController {

    // o método mapeia a mensagem, envia e além disso, envia para um contexto específico
    @MessageMapping("chat.sendMessage")
    @SendTo("/topic/public")
    // @Payload é o carregador de mensagens da aplicacao
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    // estabelecer um novo método p/ q possa ser adicionado a aplicacao a um novo usuario
    // - assim que ele, o usuario fizer seu acesso
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }
}
