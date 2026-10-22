package br.senac.diario.controller;

import br.senac.diario.dto.CadastroRequest;
import br.senac.diario.dto.ContaResponse;
import br.senac.diario.dto.LoginRequest;
import br.senac.diario.dto.TokenResponse;
import br.senac.diario.service.ContaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final ContaService contaService;

    @PostMapping("/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public ContaResponse cadastrar(@RequestBody @Valid CadastroRequest request) {
        return contaService.cadastrar(request);
    }

    @PostMapping("/login")
    public TokenResponse login(@RequestBody @Valid LoginRequest request) {
        return contaService.login(request);
    }
}
