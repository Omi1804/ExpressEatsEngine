import { IsEmail, IsEmpty, Length } from "class-validator";

//we make customer interface little different through class-validator and class-transformer
export class CreateCustomerInputs {
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @Length(6, 12)
  password: string;
}
