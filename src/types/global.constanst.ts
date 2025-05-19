export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export const ADMIN_ROLE = 'ADMIN';
export const PARENT_ROLE = 'PARENT';
export const TEACHER_ROLE = 'TEACHER';
export const USER_ROLE = 'USER';
export const STUDENT_ROLE = 'STUDENT';
