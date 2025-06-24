

export interface IEquipment {
  equipId: number;
  equipSerial: string;
  equipName: string;
  equipPurchaseDate: string; // Date → ISO 문자열로 받음
  equipGroup: string;
  equipPerioduseDate: string;
  remainPeroid: number;
  equipQuantity: number;
  fileName: string;
  fileExt: string;
  logicalPath: string;
}

export interface IEquipmentDetail extends IEquipment {
  equipPerioduseDate: string;      // 사용기한 종료일
  remainPeroid: number;            // 잔여 일수
  fileName: string;
  fileExt: string;
  logicalPath: string;             // 실제 경로
}

export interface IEquipmentResponse {
  count: number;
    list: IEquipment[];
}
