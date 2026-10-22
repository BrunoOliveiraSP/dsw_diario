package br.senac.diario.dto;

public record TokenResponse(String token, String tipo, long expiraEmMinutos, String nome) {
}
