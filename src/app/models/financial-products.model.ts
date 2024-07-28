export interface CreateFinancialProductDTO{
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export interface ReponseCreateFinancialProduct{
  data: CreateFinancialProductDTO;
  message: string;
}

export interface FinancialProduct{
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}