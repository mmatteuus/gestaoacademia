export interface CampeonatoFormValues {
  nome: string;
  data: string;
  local: string;
  modalidade: string;
}

export type CampeonatoFormField = keyof CampeonatoFormValues;
