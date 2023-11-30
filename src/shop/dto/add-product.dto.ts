import { IsNumber, IsString } from 'class-validator';

export class AddProductDto {
  @IsString() // przy DTO konieczne jest dodanie dekoratorów które wskazują jakie pole ma typ (niezbędne do automatycznej konwersji)
  name: string;

  @IsString()
    // @Length(10, 100) - Na przykład 10 - 100 znaków
  description: string;

  @IsNumber()
    //@Min(1) - class-validator posiada bardzo dużo przydatnych opcji walidacji. Na przykład możemy ustawić, że wprowadzona cena to minimum 1 zł
  price: number;
}
