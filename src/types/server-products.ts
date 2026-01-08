export interface ServerProduct {
  softwareProductTypeCode: string;
  regionNo: string;
  platformDetailTypeCode: string;
  softwareProductPrice: number;
  infraResourceDetailTypeCode: string | null;
  diskTypeCode: string;
  diskTypeDetailCode: string;
  serverProductCode: string;
  serverProductName: string;
  memorySizeInGb: number;
  baseBlockStorageSizeInGb: number;
  serverProductPrice: string;
  serverProductTypeCode: string;
  infraResourceTypeCode: string;
  osTypeCode: string;
  softwareInfraResourceDetailTypeCode: string | null;
  generationCode: string;
  vcpuCount: number;
}

export interface ServerProductData {
  serverAndSelectableSoftwareProductPriceList: ServerProduct[];
}
