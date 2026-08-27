import mongoose, {
  Document,
  Schema,
} from "mongoose";


// ============================================
// STUDENT STATUS
// ============================================

export enum StudentStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}


// ============================================
// GENDER
// ============================================

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}


// ============================================
// STUDENT INTERFACE
// ============================================

export interface IStudent extends Document {
  schoolId: mongoose.Types.ObjectId;

  academicSessionId: mongoose.Types.ObjectId;

  classId: mongoose.Types.ObjectId;

  sectionId: mongoose.Types.ObjectId;

  // Basic Information
  admissionNumber: string;
  rollNumber?: string;

  firstName: string;
  lastName?: string;

  gender: Gender;

  dateOfBirth?: Date;

  photo?: string;

  // Contact Information
  email?: string;
  mobile?: string;

  // Parent Information
  parentName?: string;
  parentMobile?: string;
  parentEmail?: string;

  // Address
  address?: {
    addressLine?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };

  // Student Status
  status: StudentStatus;

  // System fields
  createdBy: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}


// ============================================
// STUDENT SCHEMA
// ============================================

const studentSchema =
  new Schema<IStudent>(
    {
      // ======================================
      // SCHOOL
      // ======================================

      schoolId: {
        type: Schema.Types.ObjectId,
        ref: "School",
        required: true,
        index: true,
      },

      // ======================================
      // ACADEMIC SESSION
      // ======================================

      academicSessionId: {
        type: Schema.Types.ObjectId,
        ref: "AcademicSession",
        required: true,
        index: true,
      },

      // ======================================
      // CLASS
      // ======================================

      classId: {
        type: Schema.Types.ObjectId,
        ref: "Class",
        required: true,
        index: true,
      },

      // ======================================
      // SECTION
      // ======================================

      sectionId: {
        type: Schema.Types.ObjectId,
        ref: "Section",
        required: true,
        index: true,
      },

      // ======================================
      // ADMISSION NUMBER
      // ======================================

      admissionNumber: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
      },

      // ======================================
      // ROLL NUMBER
      // ======================================

      rollNumber: {
        type: String,
        trim: true,
      },

      // ======================================
      // NAME
      // ======================================

      firstName: {
        type: String,
        required: true,
        trim: true,
      },

      lastName: {
        type: String,
        trim: true,
      },

      // ======================================
      // GENDER
      // ======================================

      gender: {
        type: String,
        enum: Object.values(Gender),
        required: true,
      },

      // ======================================
      // DATE OF BIRTH
      // ======================================

      dateOfBirth: {
        type: Date,
      },

      // ======================================
      // PHOTO
      // ======================================

      photo: {
        type: String,
        trim: true,
      },

      // ======================================
      // STUDENT CONTACT
      // ======================================

      email: {
        type: String,
        trim: true,
        lowercase: true,
      },

      mobile: {
        type: String,
        trim: true,
      },

      // ======================================
      // PARENT INFORMATION
      // ======================================

      parentName: {
        type: String,
        trim: true,
      },

      parentMobile: {
        type: String,
        trim: true,
      },

      parentEmail: {
        type: String,
        trim: true,
        lowercase: true,
      },

      // ======================================
      // ADDRESS
      // ======================================

      address: {
        addressLine: {
          type: String,
          trim: true,
        },

        city: {
          type: String,
          trim: true,
        },

        state: {
          type: String,
          trim: true,
        },

        pincode: {
          type: String,
          trim: true,
        },

        country: {
          type: String,
          trim: true,
          default: "India",
        },
      },

      // ======================================
      // STATUS
      // ======================================

      status: {
        type: String,
        enum: Object.values(
          StudentStatus
        ),
        default:
          StudentStatus.ACTIVE,
      },

      // ======================================
      // CREATED BY
      // ======================================

      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },

    {
      timestamps: true,
    }
  );


// ============================================
// UNIQUE ADMISSION NUMBER PER SCHOOL
// ============================================

studentSchema.index(
  {
    schoolId: 1,
    admissionNumber: 1,
  },
  {
    unique: true,
  }
);


// ============================================
// ROLL NUMBER INDEX
// ============================================

studentSchema.index({
  schoolId: 1,
  academicSessionId: 1,
  classId: 1,
  sectionId: 1,
  rollNumber: 1,
});


// ============================================
// STUDENT MODEL
// ============================================

export const Student =
  mongoose.model<IStudent>(
    "Student",
    studentSchema
  );