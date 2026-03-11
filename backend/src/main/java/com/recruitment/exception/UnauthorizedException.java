package com.recruitment.exception;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends ApplicationException {
    public UnauthorizedException(String message) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}
