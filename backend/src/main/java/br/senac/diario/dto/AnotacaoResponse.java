package br.senac.diario.dto;

import br.senac.diario.entity.Anotacao;

import java.time.LocalDateTime;

public record AnotacaoResponse(Long id, String titulo, String descricao, LocalDateTime inclusao, Integer avaliacao) {

    public static AnotacaoResponse de(Anotacao anotacao) {
        return new AnotacaoResponse(anotacao.getId(), anotacao.getTitulo(), anotacao.getDescricao(),
                anotacao.getInclusao(), anotacao.getAvaliacao());
    }
}
