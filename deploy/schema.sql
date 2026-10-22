-- Opcional: a aplicação cria as tabelas sozinha (ddl-auto=update).
CREATE DATABASE IF NOT EXISTS diario;
USE diario;

CREATE TABLE IF NOT EXISTS conta (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome      VARCHAR(100) NOT NULL,
    email     VARCHAR(150) NOT NULL UNIQUE,
    senha     VARCHAR(255) NOT NULL,
    inclusao  DATETIME(6)  NOT NULL
);

CREATE TABLE IF NOT EXISTS anotacao (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    idConta    BIGINT       NOT NULL,
    titulo     VARCHAR(150) NOT NULL,
    descricao  TEXT         NOT NULL,
    inclusao   DATETIME(6)  NOT NULL,
    avaliacao  INT          NOT NULL,
    CONSTRAINT fk_anotacao_conta FOREIGN KEY (idConta) REFERENCES conta (id),
    INDEX idx_anotacao_conta_inclusao (idConta, inclusao)
);
