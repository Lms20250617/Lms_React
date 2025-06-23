

export interface IClassroom {
  roomId: number;
  roomPersonnel: number;
  roomName: string;
  roomSize: string;
  roomRemark: string;
}

export interface IClassroomDetail extends IClassroom {
  roomPersonnel: number;
}



export interface IClassroomResponse {
  count: number;
  list: IClassroom[];
}
