package br.senac.diario.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record AnotacaoRequest(
        @NotBlank(message = "titulo é obrigatório")
        @Size(max = 150, message = "titulo deve ter no máximo 150 caracteres")
        String titulo,

        @NotBlank(message = "descricao é obrigatória")
        String descricao,

        @NotNull(message = "avaliacao é obrigatória")
        @Min(value = 1, message = "avaliacao deve ser entre 1 e 5")
        @Max(value = 5, message = "avaliacao deve ser entre 1 e 5")
        Integer avaliacao,

        // opcional: se não informado, usa o momento atual. Não aceita datas futuras.
        LocalDateTime inclusao
) {
}
