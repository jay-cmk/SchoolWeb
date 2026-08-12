import { School } from "../schools/school.model";

export const getSchoolAdminDashboard = async (
  schoolId: string
) => {
  const school = await School.findById(schoolId).lean();

  if (!school) {
    throw new Error("School not found");
  }

  return {
    school: {
      id: school._id,
      name: school.name,
      code: school.code,
      email: school.email,
      phone: school.phone,
      logo: school.logo,
    },

    statistics: {
      students: 0,
      teachers: 0,
      classes: 0,
      parents: 0,
    },
  };
};