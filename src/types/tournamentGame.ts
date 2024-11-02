import { TournamentGame } from "@prisma/client";

export interface TournamentGameItem {
  name: string;
  imageUrl: File;
}

export interface CreateTournamentGameRequest {
  title: string;
  list: TournamentGameItem[];
  username: string;
}

export interface TournamentResponse {
  id: number; // 서버에서 생성된 ID
  title: string;
  list: TournamentGameItem[];
  username: string;
  createdAt: Date; // 서버에서 생성된 시간
}
export interface GetTournamentResponse {
  message: string;
  data: {
    id: number;
    title: string;
    username: string;
    createdAt: Date;
    items: {
      id: number;
      name: string;
      imageUrl: string;
      balanceGameId: number;
    }[];
  };
}
export interface TournamentGamesResponse {
  payload: {
    games: (TournamentGame & {
      items: TournamentGameItem[];
    })[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    list: number;
  };
}
