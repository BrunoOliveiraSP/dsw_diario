package br.senac.diario.repository;

import br.senac.diario.entity.Anotacao;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AnotacaoRepository extends JpaRepository<Anotacao, Long> {

    List<Anotacao> findByIdContaOrderByInclusaoDesc(Long idConta, Limit limit);

    Optional<Anotacao> findByIdAndIdConta(Long id, Long idConta);

    List<Anotacao> findByIdContaAndInclusaoBetweenOrderByInclusaoDesc(Long idConta, LocalDateTime inicio, LocalDateTime fim);
}
