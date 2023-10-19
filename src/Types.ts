export interface ResultItem {
  CodPostal: string;
  Combustivel: string;
  DataAtualizacao: string;
  Distrito: string;
  Id: number;
  Latitude: number;
  Localidade: string;
  Longitude: number;
  Marca: string;
  Morada: string;
  Municipio: string;
  Nome: string;
  Preco: string;
  Quantidade: 26;
  TipoPosto: string;
  price?: number;
}

export interface Selection {
  fuelType: string;
  brands: string;
  districts: string;
  cities: string;
}

export interface Fueltype {
  Descritivo: string;
  UnidadeMedida: string;
  fl_ViewWebSite: boolean | null;
  fl_rodoviario: boolean | null;
  fl_ativo: boolean | null;
  BackGroundColor: string | null;
  Id: number;
}

export interface Brand {
  Descritivo: string;
  Id: number;
}

export interface District {
  Descritivo: string;
  Id: number;
}
export interface City {
  Descritivo: string;
  Distrito: District;
  Id: number;
  IdDistrito: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}
