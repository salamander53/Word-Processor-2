// redux/types.ts

export interface AuthState {
  token: string | null;
  tokenPayload: any | null; // Bạn có thể thay đổi `any` thành kiểu cụ thể của tokenPayload nếu muốn
}
