export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: number | string;
  children?: string[];
  avatar?: string;
}

export const ADMIN_ROLE = 'ADMIN';
export const PARENT_ROLE = 'PARENT';
export const TEACHER_ROLE = 'TEACHER';
export const USER_ROLE = 'USER';
export const STUDENT_ROLE = 'STUDENT';

export const ADMIN_ROLE_ID = '682872fc954ffe41c849b2ad';
export const USER_ROLE_ID = '68287347954ffe41c849b2b3';
export const PARENT_ROLE_ID = '6828734d954ffe41c849b2b6';
export const STUDENT_ROLE_ID = '68287380954ffe41c849b2b9';
export const TEACHER_ROLE_ID = '6828732a954ffe41c849b2b0';
