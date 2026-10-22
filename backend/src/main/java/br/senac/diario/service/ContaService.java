package br.senac.diario.service;

import br.senac.diario.dto.CadastroRequest;
import br.senac.diario.dto.ContaResponse;
import br.senac.diario.dto.LoginRequest;
import br.senac.diario.dto.TokenResponse;
import br.senac.diario.entity.Conta;
import br.senac.diario.exception.RegraNegocioException;
import br.senac.diario.repository.ContaRepository;
import br.senac.diario.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContaService {

    private final ContaRepository contaRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public ContaResponse cadastrar(CadastroRequest request) {
        String email = request.email().trim().toLowerCase();
        if (contaRepository.existsByEmail(email)) {
            throw new RegraNegocioException(HttpStatus.CONFLICT, "Já existe uma conta com este email");
        }

        Conta conta = new Conta();
        conta.setNome(request.nome().trim());
        conta.setEmail(email);
        conta.setSenha(passwordEncoder.encode(request.senha()));
        return ContaResponse.de(contaRepository.save(conta));
    }

    public TokenResponse login(LoginRequest request) {
        Conta conta = contaRepository.findByEmail(request.email().trim().toLowerCase())
                .filter(c -> passwordEncoder.matches(request.senha(), c.getSenha()))
                .orElseThrow(() -> new RegraNegocioException(HttpStatus.UNAUTHORIZED, "Email ou senha inválidos"));

        String token = jwtService.gerarToken(conta.getId(), conta.getEmail());
        return new TokenResponse(token, "Bearer", jwtService.getExpiracaoMinutos(), conta.getNome());
    }
}
