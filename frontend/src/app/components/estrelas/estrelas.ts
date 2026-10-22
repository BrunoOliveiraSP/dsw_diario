import { Component, EventEmitter, Input, Output } from '@angular/core';

// Mostra a avaliação de 1 a 5 em estrelas. Com "editavel", permite escolher.
@Component({
  selector: 'app-estrelas',
  templateUrl: './estrelas.html',
  styleUrl: './estrelas.css'
})
export class Estrelas {
  @Input() valor = 0;
  @Input() editavel = false;
  @Output() valorChange = new EventEmitter<number>();

  estrelas = [1, 2, 3, 4, 5];

  escolher(nota: number): void {
    if (this.editavel) {
      this.valor = nota;
      this.valorChange.emit(nota);
    }
  }
}
