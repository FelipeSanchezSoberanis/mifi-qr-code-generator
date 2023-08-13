import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

interface ValidationError {
  errorType: string;
  info: null | string | number;
}

interface MinlengthValidationError {
  actualLength: number;
  requiredLength: number;
}

interface MinValidationError {
  min: number;
  actual: number;
}

interface MaxValidationError {
  max: number;
  actual: number;
}

@Component({
  selector: "form-error-message",
  templateUrl: "./form-error-message.component.html",
  styleUrls: ["./form-error-message.component.scss"]
})
export class FormErrorMessageComponent {
  @Input() control!: FormControl;

  getValidationErrors(): ValidationError[] {
    const controlErrors = this.control.errors;
    if (!controlErrors) return [];
    const validationErrors: ValidationError[] = [];

    for (let [errorType, errorInfo] of Object.entries(controlErrors)) {
      switch (errorType) {
        case "minlength":
          validationErrors.push({
            errorType: "minlength",
            info: (errorInfo as MinlengthValidationError).requiredLength
          });
          break;
        case "nonMatchingPasswordVerification":
          validationErrors.push({ errorType: errorType, info: null });
          break;
        case "required":
          validationErrors.push({ errorType: errorType, info: null });
          break;
        case "email":
          validationErrors.push({ errorType: errorType, info: null });
          break;
        case "min":
          validationErrors.push({
            errorType: errorType,
            info: (errorInfo as MinValidationError).min
          });
          break;
        case "max":
          validationErrors.push({
            errorType: errorType,
            info: (errorInfo as MaxValidationError).max
          });
          break;
        default:
          break;
      }
    }

    return validationErrors;
  }
}
