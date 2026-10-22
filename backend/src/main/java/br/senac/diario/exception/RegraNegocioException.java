package br.senac.diario.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class RegraNegocioException extends RuntimeException {

    private final HttpStatus status;

    public RegraNegocioException(HttpStatus status, String mensagem) {
        super(mensagem);
        this.status = status;
    }
}
