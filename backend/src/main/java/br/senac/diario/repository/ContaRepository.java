package br.senac.diario.repository;

import br.senac.diario.entity.Conta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContaRepository extends JpaRepository<Conta, Long> {

    boolean existsByEmail(String email);

    Optional<Conta> findByEmail(String email);
}
