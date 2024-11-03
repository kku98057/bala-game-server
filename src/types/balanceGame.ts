// CreateBalanceGameDTO - 게임 생성 요청 데이터 형식 정의
export interface CreateBalanceGameDTO {
  title: string; // 게임 제목
  username: string; // 작성자 이름
  questions: {
    title: string; // 질문 내용
    items: {
      name: string; // 선택지 내용
    }[];
  }[];
}

// BalanceGameResponseDTO - 게임 조회 응답 데이터 형식 정의
export interface BalanceGameResponseDTO {
  id: number;
  title: string;
  username: string;
  createdAt: Date;
  questions: {
    id: number;
    title: string;
    items: {
      id: number;
      name: string;
      selectCount: number;
    }[];
  }[];
}
