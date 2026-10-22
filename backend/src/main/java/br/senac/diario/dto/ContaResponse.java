package br.senac.diario.dto;

import br.senac.diario.entity.Conta;

import java.time.LocalDateTime;

public record ContaResponse(Long id, String nome, String email, LocalDateTime inclusao) {

    public static ContaResponse de(Conta conta) {
        return new ContaResponse(conta.getId(), conta.getNome(), conta.getEmail(), conta.getInclusao());
    }
}
