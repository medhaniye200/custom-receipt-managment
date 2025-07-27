export interface Company {
  id: string;
  name: string;
  tinNumber: string; // Tax Identification Number
  address?: string;
  phone?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export type CompanyFormData = {
  name: string;
  tinNumber: string;
  address?: string;
  phone?: string;
  status: "active" | "inactive";
};
