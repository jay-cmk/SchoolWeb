// export type TeacherGender =
//   | "MALE"
//   | "FEMALE"
//   | "OTHER";

// export interface CreateTeacherData {
//   employeeId: string;

//   name: string;

//   email: string;

//   mobile?: string;

//   gender?: TeacherGender;

//   qualification?: string;

//   joiningDate?: string;

//   profileImage?: string;
// }

// export interface UpdateTeacherData {
//   employeeId?: string;

//   name?: string;

//   email?: string;

//   mobile?: string;

//   gender?: TeacherGender;

//   qualification?: string;

//   joiningDate?: string;

//   profileImage?: string;
// }




export type TeacherGender =
  | "MALE"
  | "FEMALE"
  | "OTHER";


export interface CreateTeacherData {

  employeeId: string;

  name: string;

  email: string;

  password: string;

  mobile?: string;

  gender?: TeacherGender;

  qualification?: string;

  joiningDate?: string;

  profileImage?: string;
}


export interface UpdateTeacherData {

  employeeId?: string;

  name?: string;

  email?: string;

  mobile?: string;

  gender?: TeacherGender;

  qualification?: string;

  joiningDate?: string;

  profileImage?: string;
}