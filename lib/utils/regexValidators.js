export const fullNameValidator =
  /^(?=.*[A-Za-zÀ-ÖØ-öø-ÿ].*[A-Za-zÀ-ÖØ-öø-ÿ].*[A-Za-zÀ-ÖØ-öø-ÿ])[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;

export const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const phoneNumberValidator =
  /^(\+?61\s?)?0?4[\s\-]?\d{2}[\s\-]?\d{3}[\s\-]?\d{3}$/;
