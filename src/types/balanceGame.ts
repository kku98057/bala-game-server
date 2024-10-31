export interface BalanceGameItem {
  name: string;
  imageUrl: File;
}

export interface CreateBalanceGameRequest {
  title: string;
  list: BalanceGameItem[];
  username: string;
}

export interface BalanceGameResponse {
  id: number; // 서버에서 생성된 ID
  title: string;
  list: BalanceGameItem[];
  username: string;
  createdAt: Date; // 서버에서 생성된 시간
}
export interface GetBalanceGameResponse {
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
