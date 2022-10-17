package com.example.chatapp.controller;

import com.example.chatapp.model.ChatMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;


public class WebSocketEventListener {

    // propriedade q ajuda no monitoramento daquilo que está ocorrendo com o componente que vêm no parâmetro
    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    // injecão de dependencia
    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    // implementando o "escutador" q observa se há alguma nova conexão de aplicações client
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.info("Uma nova conexão - via web socket - acaba de ocorrer!");
    }
    // implementando o "escutador" q observa se há alguma nova DESconexão de aplicações client
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        // verificar se o nome do usuário existe
        if(username != null) {
            logger.info("Usuario desconectou " + username);
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setType(ChatMessage.MessageType.LEAVE);
            chatMessage.setSender(username);

            messagingTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }
}
