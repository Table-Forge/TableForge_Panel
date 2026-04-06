export const invalidEmails = [
  "gmail.con",
  "gmail.con.br",
  "gmail.co",
  "outlook.con",
  "outlook.co",
  "outlook.com.b",
  "outlook.co.br",
  "outlook.con.br",
  "hotmail.con",
  "hotmail.co",
  "hotmail.com.b",
  "hotmail.co.br",
  "hotmail.con.br",
];

export const invalidDomains = [
  "hotmeil",
  "hotmeiu",
  "rotmail",
  "gmeil",
  "gmeiu",
  "gmaiu",
  "altlook",
  "autlook",
  "outluk",
  "autluk",
  "outluc",
  "autluc",
];

const validateEmail = (email: string) => {
  if (!email) return false;

  const sufixDomain = email.split("@")[1];

  if (sufixDomain) {
    const emailsTested = invalidEmails.map((invalidemail) => {
      return sufixDomain === invalidemail;
    });

    const DomainsTested = invalidDomains.map((invalidemail) => {
      return sufixDomain.includes(invalidemail);
    });
    if (emailsTested.includes(true) || DomainsTested.includes(true))
      return false;
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{1,3}$/;

  return regexEmail.test(email);
};

const validateNoNumbers = (input: string): boolean => {
  const hasNumbers = /\d/.test(input);
  return !hasNumbers;
};

const validateCPF = (cpf: string | null | undefined): boolean => {
  if (!cpf) return false;

  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  for (let t = 9; t < 11; t++) {
    let sum = 0;
    for (let i = 0; i < t; i++) {
      sum += Number(cpf[i]) * (t + 1 - i);
    }
    let digit = (sum * 10) % 11;
    if (digit === 10) digit = 0;
    if (digit !== Number(cpf[t])) return false;
  }

  return true;
};

const validateCNPJ = (cnpj: string | null | undefined): boolean => {
  if (!cnpj) return false;

  cnpj = cnpj.replace(/[^\d]+/g, "");
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  const validateDigit = (base: string, weight: number[]): number => {
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      sum += Number(base[i]) * weight[i];
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const weight1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weight2 = [6, ...weight1];

  const dig1 = validateDigit(cnpj.slice(0, 12), weight1);
  const dig2 = validateDigit(cnpj.slice(0, 12) + dig1, weight2);

  return cnpj.endsWith(`${dig1}${dig2}`);
};

export { validateCNPJ, validateCPF, validateEmail, validateNoNumbers };
