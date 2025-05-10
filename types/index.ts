export interface FieldErrors {
  username?: string[];
  password?: string[];
  email?: string[];
  bio?: string[];
  general?: string[];
}

export interface ActionState {
  fieldErrors?: FieldErrors;
  success?: boolean;
}
