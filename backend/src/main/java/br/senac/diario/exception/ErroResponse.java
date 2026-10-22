package br.senac.diario.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErroResponse(LocalDateTime momento, int status, String mensagem, Map<String, String> campos) {

    public ErroResponse(int status, String mensagem) {
        this(LocalDateTime.now(), status, mensagem, null);
    }

    public ErroResponse(int status, String mensagem, Map<String, String> campos) {
        this(LocalDateTime.now(), status, mensagem, campos);
    }
}
