import mongoose from "mongoose";

import {
  AcademicSession,
} from "./academicSession.model";

import type {
  CreateAcademicSessionData,
  UpdateAcademicSessionData,
} from "./academicSession.types";


export const createAcademicSession =
  async (
    schoolId: string,
    data: CreateAcademicSessionData
  ) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        schoolId
      )
    ) {
      throw new Error(
        "Invalid school ID"
      );
    }

    const existing =
      await AcademicSession.findOne({
        schoolId,
        name: data.name.trim(),
      });

    if (existing) {
      throw new Error(
        "Academic session already exists"
      );
    }

    if (
      new Date(data.startDate) >=
      new Date(data.endDate)
    ) {
      throw new Error(
        "Start date must be before end date"
      );
    }

    if (data.isCurrent) {
      await AcademicSession.updateMany(
        {
          schoolId,
          isCurrent: true,
        },
        {
          isCurrent: false,
        }
      );
    }

    const session =
      await AcademicSession.create({
        schoolId,
        name: data.name.trim(),
        startDate: data.startDate,
        endDate: data.endDate,
        isCurrent:
          data.isCurrent ?? false,
      });

    return {
      ...session.toObject(),

      academicStatus:
        getAcademicStatus(
          session.startDate,
          session.endDate
        ),
    };
  };


export const getAcademicSessions = async (
  schoolId: string
) => {
  const sessions = await AcademicSession.find({
    schoolId,
  })
    .sort({
      startDate: -1,
    })
    .lean();

  return sessions.map((session) => ({
    ...session,
    academicStatus: getAcademicStatus(
      session.startDate,
      session.endDate
    ),
  }));
};

export const getAcademicSessionById = async (
  schoolId: string,
  sessionId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new Error("Invalid session ID");
  }

  const session = await AcademicSession.findOne({
    _id: sessionId,
    schoolId,
  }).lean();

  if (!session) {
    throw new Error("Academic session not found");
  }

  return {
    ...session,
    academicStatus: getAcademicStatus(
      session.startDate,
      session.endDate
    ),
  };
};


export const updateAcademicSession =
  async (
    schoolId: string,
    sessionId: string,
    data: UpdateAcademicSessionData
  ) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        sessionId
      )
    ) {
      throw new Error(
        "Invalid session ID"
      );
    }

    const session =
      await AcademicSession.findOne({
        _id: sessionId,
        schoolId,
      });

    if (!session) {
      throw new Error(
        "Academic session not found"
      );
    }

    if (data.name !== undefined) {
      session.name =
        data.name.trim();
    }

    if (
      data.startDate !== undefined
    ) {
      session.startDate =
        new Date(data.startDate);
    }

    if (
      data.endDate !== undefined
    ) {
      session.endDate =
        new Date(data.endDate);
    }

    if (
      session.startDate >=
      session.endDate
    ) {
      throw new Error(
        "Start date must be before end date"
      );
    }

    if (
      data.isCurrent === true
    ) {
      await AcademicSession.updateMany(
        {
          schoolId,
          _id: {
            $ne: session._id,
          },
          isCurrent: true,
        },
        {
          isCurrent: false,
        }
      );

      session.isCurrent = true;
    }

    if (
      data.isCurrent === false
    ) {
      session.isCurrent = false;
    }

    await session.save();

    return session;
  };


  export const setCurrentAcademicSession = async (
  schoolId: string,
  sessionId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new Error("Invalid session ID");
  }

  const session = await AcademicSession.findOne({
    _id: sessionId,
    schoolId,
  });

  if (!session) {
    throw new Error("Academic session not found");
  }

  // Current session ko false karo
  await AcademicSession.updateMany(
    {
      schoolId,
      isCurrent: true,
    },
    {
      $set: {
        isCurrent: false,
      },
    }
  );

  // Selected session ko current karo
  session.isCurrent = true;

  await session.save();

  return session;
};


const getAcademicStatus = (
  startDate: Date,
  endDate: Date
) => {
  const today = new Date();

  if (today < startDate) {
    return "UPCOMING";
  }

  if (today > endDate) {
    return "COMPLETED";
  }

  return "ACTIVE";
};


