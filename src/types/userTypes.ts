export interface JwtPayload {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string | null;
    image: string | null;
    role: string;
    userType: 'LEADER' | 'MEMBER';
  }
  