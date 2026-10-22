package br.senac.diario.controller;

import br.senac.diario.dto.AnotacaoRequest;
import br.senac.diario.dto.AnotacaoResponse;
import br.senac.diario.service.AnotacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** O idConta nunca vem da requisição: é lido do token JWT (principal da autenticação). */
@RestController
@RequestMapping("/anotacoes")
@RequiredArgsConstructor
public class AnotacaoController {

    private final AnotacaoService anotacaoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AnotacaoResponse inserir(@AuthenticationPrincipal Long idConta,
                                    @RequestBody @Valid AnotacaoRequest request) {
        return anotacaoService.inserir(idConta, request);
    }

    @PutMapping("/{id}")
    public AnotacaoResponse atualizar(@AuthenticationPrincipal Long idConta, @PathVariable Long id,
                                      @RequestBody @Valid AnotacaoRequest request) {
        return anotacaoService.atualizar(idConta, id, request);
    }

    @GetMapping("/ultimas")
    public List<AnotacaoResponse> ultimas(@AuthenticationPrincipal Long idConta,
                                          @RequestParam(defaultValue = "10") int quantidade) {
        return anotacaoService.ultimas(idConta, quantidade);
    }

    @GetMapping("/{id}")
    public AnotacaoResponse buscarPorId(@AuthenticationPrincipal Long idConta, @PathVariable Long id) {
        return anotacaoService.buscarPorId(idConta, id);
    }

    @GetMapping
    public List<AnotacaoResponse> porPeriodo(@AuthenticationPrincipal Long idConta,
                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        return anotacaoService.porPeriodo(idConta, inicio, fim);
    }
}
