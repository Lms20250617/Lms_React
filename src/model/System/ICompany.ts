export interface ICompanyList {
  companyId: string;
  companyName: string;
  companyCeo: string;
  companyHp: string;
  companyLoc: string;
  companyEmail: string;
  companyRegDate: number;
}

export interface ICompanyDetail extends ICompanyList {
  detailAddress: string;
  zipcode: string;
}

export interface ICompanyResponse {
  list: ICompanyList[];
  count: number;
}
