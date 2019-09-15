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
}

export interface Session {
  duration: number;
  cancellations: string | Date[];
  venue: Venue;
  repeatType: string;
  repeatGap: number;
  sessionType: string;
  nextDate: string | Date;
  courseCode: string | undefined;
  date: Date | string | undefined;
  time: Date | string | undefined;
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

  sessions: Session[];
  announcements: Announcement[];
  forums: Forum[];
  questionForum: Forum;
}
