package br.senac.diario.service;

import br.senac.diario.dto.AnotacaoRequest;
import br.senac.diario.dto.AnotacaoResponse;
import br.senac.diario.entity.Anotacao;
import br.senac.diario.exception.RegraNegocioException;
import br.senac.diario.repository.AnotacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Limit;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnotacaoService {

    private static final int MAX_ULTIMAS = 50;

    private final AnotacaoRepository anotacaoRepository;

    @Transactional
    public AnotacaoResponse inserir(Long idConta, AnotacaoRequest request) {
        LocalDateTime inclusao = request.inclusao() != null ? request.inclusao() : LocalDateTime.now();
        validarData(inclusao);

        Anotacao anotacao = new Anotacao();
        anotacao.setIdConta(idConta);
        anotacao.setTitulo(request.titulo().trim());
        anotacao.setDescricao(request.descricao().trim());
        anotacao.setAvaliacao(request.avaliacao());
        anotacao.setInclusao(inclusao);
        return AnotacaoResponse.de(anotacaoRepository.save(anotacao));
    }

    @Transactional
    public AnotacaoResponse atualizar(Long idConta, Long id, AnotacaoRequest request) {
        Anotacao anotacao = anotacaoRepository.findByIdAndIdConta(id, idConta)
                .orElseThrow(() -> new RegraNegocioException(HttpStatus.NOT_FOUND, "Anotação não encontrada"));

        if (request.inclusao() != null) {
            validarData(request.inclusao());
            anotacao.setInclusao(request.inclusao());
        }

        anotacao.setTitulo(request.titulo().trim());
        anotacao.setDescricao(request.descricao().trim());
        anotacao.setAvaliacao(request.avaliacao());
        return AnotacaoResponse.de(anotacaoRepository.save(anotacao));
    }

    // regra: apenas anotações do dia atual ou de dias anteriores (nunca futuras)
    private void validarData(LocalDateTime inclusao) {
        if (inclusao.toLocalDate().isAfter(LocalDate.now())) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST,
                    "Não é permitido registrar anotações com data futura");
        }
    }

    @Transactional(readOnly = true)
    public AnotacaoResponse buscarPorId(Long idConta, Long id) {
        // filtra pela conta: anotação de outro usuário é tratada como inexistente
        return anotacaoRepository.findByIdAndIdConta(id, idConta)
                .map(AnotacaoResponse::de)
                .orElseThrow(() -> new RegraNegocioException(HttpStatus.NOT_FOUND, "Anotação não encontrada"));
    }

    @Transactional(readOnly = true)
    public List<AnotacaoResponse> ultimas(Long idConta, int quantidade) {
        if (quantidade < 1 || quantidade > MAX_ULTIMAS) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST,
                    "quantidade deve ser entre 1 e " + MAX_ULTIMAS);
        }
        return anotacaoRepository.findByIdContaOrderByInclusaoDesc(idConta, Limit.of(quantidade))
                .stream().map(AnotacaoResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public List<AnotacaoResponse> porPeriodo(Long idConta, LocalDate inicio, LocalDate fim) {
        if (inicio.isAfter(fim)) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST, "inicio deve ser anterior ou igual a fim");
        }
        return anotacaoRepository.findByIdContaAndInclusaoBetweenOrderByInclusaoDesc(
                        idConta, inicio.atStartOfDay(), fim.atTime(LocalTime.MAX))
                .stream().map(AnotacaoResponse::de).toList();
    }
}
