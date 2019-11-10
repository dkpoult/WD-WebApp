export interface ScriptableEvent {
  eventCode: string;
  eventName: string;
  eventDescription: string;
  startDate: string;
  endDate: string;
  temporaryVenues: Building[];
  stages: EventStage[];
}

export interface EventStage {
  title: string;
  text: string;
  optional: boolean;
  steps: EventStep[];
}

export interface EventStep {
  text: string;
  venue?: { buildingCode: string, floor: number, venueCode: string, eventSpecific: boolean };
}

export interface User {
  personNumber: string;
  userToken: string | undefined;
  preferences: any | undefined;
}

export interface Person {
  personNumber: string;
  firstName: string;
  lastName: string;
}

export interface Permission {
  identifier: string;
  value: number;
}

export interface Venue {
  buildingCode: string;
  subCode: string;
  coordinates: any | undefined; // TODO: This should be an actual type
  // venueCode: string;
  // venueName: string;
  // hasImage: boolean; // .png
  // coordinates: {
  //   x: number,
  //   y: number,
  // };
  // attributes: {
  //   [key: string]: any
  // };
}

export interface Building {
  buildingCode: string;
  buildingName: string;
  coordinates: {
    lat: number,
    lng: number,
  };
  floors: [
    {
      hasImage: boolean,
      floorName: string,
      venues: [
        {
          venueCode: string,
          venueName: string,
          hasImage: boolean, // .png
          coordinates: {
            x: number,
            y: number,
          },
          attributes: {
            [key: string]: any
          },
        }
      ] | [],
    }
  ];
}


export enum SessionType {'LECTURE', 'LAB', 'TUTORIAL', 'TEST', 'CONSULTATION', 'MEETING'}

export enum RepeatType {'DAILY', 'WEEKLY', 'MONTHLY', 'ONCE'}

export interface Session {
  duration: number;
  cancellations: (string | Date)[];
  venue: Venue;
  repeatType: string; // RepeatType;
  repeatGap: number;
  sessionType: SessionType | string;
  startDate: string | Date;
  endDate: string | Date | undefined;
  time: Date | string | undefined;
  courseCode: string | undefined;
}

export interface BookableSession extends Session {
  slotCount: number;
  slotGap: number;
  lecturer: User | string;
  bookings: Booking[];
  id: number;
}

export interface Booking {
  allocated: boolean; // Taken?
  personNumber: string | null; // By whom?
}

export interface Announcement {
  time: string | Date;
  title: string;
  body: string;
}

export interface Forum {
  forumCode: string;
}

export interface Course {
  courseCode: string;
  courseName: string;
  courseDescription: string;
  lecturer: Person;
  hasPassword: boolean;
  permissions: number | undefined;

  moodleId: number | undefined;

  announcements: Announcement[];
  forums: Forum[];
  questionForum: Forum;

  sessions: Session[];
  bookableSessions: {
    [key: string]: BookableSession[]; // Maps lecturer to sessions
  };
}
