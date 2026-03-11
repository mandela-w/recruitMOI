package com.recruitment.service.impl;

import com.recruitment.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.name:Recruitment System}")
    private String appName;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    @Async
    public void sendHrAccountCredentials(String toEmail, String firstName, String plainPassword) {
        String loginUrl = frontendUrl + "/login";
        String changePasswordUrl = frontendUrl + "/change-password";

        String subject = appName + " — Your Account Credentials";

        String body = """
                Dear %s,

                Your account on the %s has been created by the system administrator.

                Here are your login credentials:

                  Email:    %s
                  Password: %s

                To get started, click the link below to log in:
                %s

                For security reasons, you are required to change your password
                immediately after your first login:
                %s

                If you did not expect this email, please contact your system
                administrator immediately.

                Important: Do not share your credentials with anyone.

                Regards,
                %s
                """.formatted(
                        firstName,
                        appName,
                        toEmail,
                        plainPassword,
                        loginUrl,
                        changePasswordUrl,
                        appName
                );

        sendEmail(toEmail, subject, body);
    }

    @Override
    @Async
    public void sendApplicationStatusUpdate(String toEmail, String firstName,
                                             String status, String reason) {
        String applicationUrl = frontendUrl + "/applicant/application";

        String subject = appName + " — Application Status Update";

        String body = """
                Dear %s,

                We are writing to inform you that your application status
                has been updated.

                New Status : %s
                Reason     : %s

                You can log in to the portal to view the full details
                of your application:
                %s

                If you have any questions, please contact our HR team.

                Regards,
                HR Team
                %s
                """.formatted(
                        firstName,
                        status,
                        reason,
                        applicationUrl,
                        appName
                );

        sendEmail(toEmail, subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (MailException ex) {
            log.error("Failed to send email to {}: {}", to, ex.getMessage());
        }
    }
}