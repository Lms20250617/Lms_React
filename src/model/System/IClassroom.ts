export interface IClassroom {
  roomId: number;
  roomPersonnel: number;
  roomName: string;
  roomSize: string;
  roomRemark: string;
}

export interface IClassroomDetail extends IClassroom {
  roomPersonnel: number;
  fileName: string;
  fileExt: string;
  fileSize: number;
  physicalPath: string;
  logicalPath: string;
}

export interface IClassroomResponse {
  count: number;
  list: IClassroom[];
}
