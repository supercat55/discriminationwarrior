interface Option {
  arid: string;
  Coefficient: string;
  "T-Value": string;
  Significance: string;
  Zipcode?: string;
  State?: string;
  Bank_Name: string;
  County?: string;
  Institution_Name?: string;
}

interface Rule {
  Zipcode: string;
  State: string;
  County: string
}