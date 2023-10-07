export interface IReport {
  id: number;
  troopId: number;
  userId: number;
  userAddress: string;
  pDate: string;
  totalExpanse: number;
  personExpanse: string;
  merakez: string;
  rashbat: string;
  iDate: string;
  place: string;
  injuredName: string;
  injuredAge: number;
  injuredAddress: string;
  tahkir: number;
  reason: string;
  object: string;
  eventDescription: string;
  placeDescription: string;
  bodyPart: string;
  blackout: number;
  blackoutTime: string;
  treatmentOnsite: number;
  treatmentPerson: string;
  treatmentTime: number;
  treatmentDescription: string;
  evacuation: number;
  evacuationPlace: string;
  evacuationVehicle: string;
  evacuationPerson: string;
  evacuationAnnouncement: number;
  evacuationPersonAnnouncement: string;
  police: number;
  safetyId: number;
  comments: string;
  phone1: string;
  phone3: string;
  phone5: string;
  phone7: string;
  phone9: string;
  insurance: string;
  troopName?: string;
  parentName?: string;
  injuredTzNum: string;
  files: File[];
  logs: Log[];
}

export interface File {
  _id: string;
  id: number;
  fileName: string;
  fileSize: number;
  fileDesc: string;
  tableId: number;
  itemId: number;
  fileSerialized: string;
}

export interface Log {
  _id: string;
  id: number;
  reportId: number;
  userId: number;
  changeDate: string;
  comments: string;
  username: string;
}
