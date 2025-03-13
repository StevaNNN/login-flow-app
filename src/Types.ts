export interface USER {
  userName?: string;
  fullName?: string;
  email?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  photo?: string;
  birthDate?: string;
  role: "admin" | "user" | string;
  _id: string;
  _v?: number;
}

export interface USER_RESULT {
  fullName: string;
  matchWon: number;
  matchLost: number;
  matchPlayed: number;
  setsWon: number;
  setsLost: number;
  gamesWon: number;
  gamesLost: number;
  totalScore: number;
}

export interface GROUP {
  name: string;
  color?: string;
  results?: USER_RESULT[];
}

export type _PARTICIPANT_TYPE = {
  label: USER["fullName"];
  id: string;
  selected: boolean;
};
export type _GROUP_TYPE = {
  label: string;
  id: string;
  selected: boolean;
};

export interface GROUP_TYPE {
  group: _GROUP_TYPE;
  participants: _PARTICIPANT_TYPE[];
}

export interface SEASON {
  seasonName: string;
  seasonParticipants?: _PARTICIPANT_TYPE[];
  seasonGroups: GROUP_TYPE[];
}
