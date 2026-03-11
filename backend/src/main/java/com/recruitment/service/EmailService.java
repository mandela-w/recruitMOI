package com.recruitment.service;


public interface EmailService {
    void sendHrAccountCredentials(String toEmail, String firstName, String plainPassword);
    void sendApplicationStatusUpdate(String toEmail, String firstName, String status, String reason);
}
