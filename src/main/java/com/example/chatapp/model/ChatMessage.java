package com.example.chatapp.model;

public class ChatMessage {

    // estabelecer uma enum p/ q o tipo construído MessageType - disponibilizado e definindo uma propriedade
    // possa indicar o comportamento da aplicacao cliente diante do socket
    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }

    // model domain
    private MessageType type;
    private String content;
    private String sender;

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }
}
