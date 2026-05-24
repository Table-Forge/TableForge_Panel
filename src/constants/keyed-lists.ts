const LOG_ERROR_KEYS: Record<string, { name: string; color: string }> = {
  information: {
    name: "Informação",
    color: "#576ad9",
  },
  warning: {
    name: "Aviso",
    color: "#ffbb00",
  },
  error: {
    name: "Erro",
    color: "#AA1A12",
  },
  critical: {
    name: "Erro Crítico",
    color: "#ff0000",
  },
  unknown: {
    name: "Desconhecido",
    color: "#b4b4b4",
  },
};

export { LOG_ERROR_KEYS };
