export interface IField {
  key: string | string[];
  label: string;
  type?: 'date' | 'bool' | 'textbox';
  isConst?: boolean;
}

export const fields: IField[] = [
  {
    key: ['troopName', 'parentName'],
    label: 'הנהגה ושבט'
  },
  {
    key: 'pDate',
    label: 'תאריך כתיבת הדו״ח',
    type: 'date',
    isConst: true
  },
  {
    key: '',
    label: 'סכום ההוצאות הכולל בגינן הוגשו קבלות'
  },
  {
    key: '',
    label: 'הזכאי לקבל ההחזר'
  },
  {
    key: 'merakez',
    label: 'מרכז השבט'
  },
  {
    key: 'phone1',
    label: 'טל מרכז השבט'
  },
  {
    key: 'rashbat',
    label: 'ראש השבט'
  },
  {
    key: 'phone3',
    label: 'טל ראש השבט'
  },
  {
    key: 'iDate',
    label: 'תאריך הפציעה',
    type: 'date'
  },
  {
    key: 'place',
    label: 'מקום הפציעה'
  },
  {
    key: 'injuredName',
    label: 'שם הנפגע'
  },
  {
    key: 'injuredTzNum',
    label: 'ת.ז של הנפגע'
  },
  {
    key: 'injuredAddress',
    label: 'כתובת הנפגע'
  },
  {
    key: 'tahkir',
    label: 'האם הוגש תחקיר ראשוני',
    type: 'bool'
  },
  {
    key: 'phone5',
    label: 'טלפון הנפגע בבית'
  },
  {
    key: 'injuredAge',
    label: 'גיל הנפגע'
  }
];

export const injuryDetails: IField[] = [
  {
    key: 'reason',
    label: 'סיבת הפגיעה'
  },
  {
    key: 'object',
    label: 'החפץ שגרם לתאונה'
  },
  {
    key: 'eventDescription',
    label: 'תאר את השתלשלות המקרה',
    type: 'textbox'
  },
  {
    key: 'placeDescription',
    label: `תאר את אתר הפציעה
          (אם הפציעה אירעה במהלך טיול, ציין/י את מסלול ההליכה באותו היום והיכן, לאורך המסלול זה קרה)`,
    type: 'textbox'
  },
  {
    key: 'bodyPart',
    label: 'האיבר הנפגע'
  },
  {
    key: 'blackout',
    label: 'איבוד הכרה',
    type: 'bool'
  },
  {
    key: 'blackoutTime',
    label: `זמן ללא הכרה
      (רק אם איבד הכרה)`
  }
];

export const treatment: IField[] = [
  {
    key: 'treatmentOnsite',
    label: 'טיפול באתר הפציעה',
    type: 'bool'
  },
  {
    key: 'treatmentPerson',
    label: `מעניק הטיפול
      (רופא/מדריך/חבר וכו')`
  },
  {
    key: 'treatmentTime',
    label: 'הזמן שחלף מהפציעה ועד הטיפול'
  },
  {
    key: 'treatmentDescription',
    label: 'פרט את הטיפול בשטח'
  },
  {
    key: 'evacuation',
    label: 'פינוי מהשטח	',
    type: 'bool'
  },
  {
    key: 'evacuationPlace',
    label: `המקום אליו פונה
      (לבי"ח/לבית/בחזרה למחנה וכו')`
  },
  {
    key: 'evacuationVehicle',
    label: `אופן הפינוי
      (אמבולנס/רכב פרטי וכו')`
  },
  {
    key: 'evacuationPerson',
    label: 'שם המלווה בפינוי'
  },
  {
    key: 'phone7',
    label: 'טלפון של המלווה'
  },
  {
    key: 'evacuationAnnouncement',
    label: 'הודעה להורי החניך',
    type: 'bool'
  },
  {
    key: 'evacuationPersonAnnouncement',
    label: 'מי הודיע להורים'
  },
  {
    key: 'police',
    label: `הזעקת משטרה
      (אם הוזעקה משטרה, נא לצרף סריקת דו"ח)`,
    type: 'bool'
  }
];

export const more: IField[] = [
  {
    key: 'comments',
    label: 'הערות כלליות'
  },
  {
    key: 'phone9',
    label: 'טלפון מגיש הדוח'
  }
];
