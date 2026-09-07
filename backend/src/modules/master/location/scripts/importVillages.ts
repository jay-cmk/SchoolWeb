import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import csv from "csv-parser";

import { Village } from "../village.model";

dotenv.config();

// ============================================
// CONFIG
// ============================================

const BATCH_SIZE = 2000;

const VILLAGE_FILE = path.resolve(
  process.cwd(),
  "data",
  "All_Villagesof_India.csv"
);

// ============================================
// TYPES
// ============================================

type CsvRow = Record<string, string>;

// ============================================
// HELPERS
// ============================================

const cleanString = (
  value: unknown
): string | undefined => {
  if (
    value === undefined ||
    value === null
  ) {
    return undefined;
  }

  const cleaned = String(value).trim();

  return cleaned || undefined;
};

const cleanNumber = (
  value: unknown
): number | undefined => {
  const cleaned = cleanString(value);

  if (!cleaned) {
    return undefined;
  }

  const number = Number(cleaned);

  return Number.isFinite(number)
    ? number
    : undefined;
};

// ============================================
// NORMALIZE HEADER
// ============================================

const normalizeHeader = (
  header: string
): string => {
  return header
    .replace(/^\uFEFF/, "")
    .replace(/\r/g, "")
    .trim();
};

// ============================================
// CREATE BULK OPERATION
// ============================================

const createVillageOperation = (
  row: CsvRow
) => {
  const lgdCode = cleanNumber(
    row["Village Code"]
  );

  const stateCode = cleanNumber(
    row["State Code"]
  );

  const districtCode = cleanNumber(
    row["District Code"]
  );

  const subDistrictCode = cleanNumber(
    row["Sub-District Code"]
  );

  const name = cleanString(
    row["Village Name (In English)"]
  );

  if (
    lgdCode === undefined ||
    stateCode === undefined ||
    districtCode === undefined ||
    subDistrictCode === undefined ||
    !name
  ) {
    return null;
  }

  const localName = cleanString(
    row["Village Name (In Local)"]
  );

  const version = cleanNumber(
    row["Village Version"]
  );

  const category = cleanString(
    row["Village Category"]
  );

  const status = cleanString(
    row["Village Status"]
  );

  const census2001Code = cleanString(
    row["Census 2001 Code"]
  );

  const census2011Code = cleanString(
    row["Census 2011 Code"]
  );

  return {
    updateOne: {
      filter: {
        lgdCode,
      },

      update: {
        $set: {
          lgdCode,
          stateCode,
          districtCode,
          subDistrictCode,
          name,

          ...(localName
            ? { localName }
            : {}),

          ...(version !== undefined
            ? { version }
            : {}),

          ...(category
            ? { category }
            : {}),

          ...(status
            ? { status }
            : {}),

          ...(census2001Code
            ? { census2001Code }
            : {}),

          ...(census2011Code
            ? { census2011Code }
            : {}),

          isActive: true,
        },
      },

      upsert: true,
    },
  };
};

// ============================================
// IMPORT VILLAGES
// ============================================

const importVillages =
  async (): Promise<void> => {
    console.log(
      "================================="
    );

    console.log(
      "LGD VILLAGE IMPORT"
    );

    console.log(
      "================================="
    );

    console.log(
      `File: ${VILLAGE_FILE}`
    );

    if (
      !fs.existsSync(VILLAGE_FILE)
    ) {
      throw new Error(
        `Village CSV file not found:\n${VILLAGE_FILE}`
      );
    }

    let processed = 0;
    let valid = 0;
    let skipped = 0;

    let batch: ReturnType<
      typeof createVillageOperation
    >[] = [];

    // ----------------------------------------
    // FLUSH CURRENT BATCH
    // ----------------------------------------

    const flushBatch =
      async (): Promise<void> => {
        const operations =
          batch.filter(
            (
              operation
            ): operation is NonNullable<
              typeof operation
            > => operation !== null
          );

        if (
          operations.length === 0
        ) {
          batch = [];
          return;
        }

        await Village.bulkWrite(
          operations,
          {
            ordered: false,
          }
        );

        valid += operations.length;

        batch = [];

        console.log(
          `Processed: ${processed} | Imported/Updated: ${valid} | Skipped: ${skipped}`
        );
      };

    // ----------------------------------------
    // CREATE STREAM
    // ----------------------------------------

    const stream =
      fs.createReadStream(
        VILLAGE_FILE,
        {
          encoding: "utf8",
        }
      );

    const parser = csv({
      mapHeaders: ({
        header,
      }) =>
        normalizeHeader(
          header
        ),
      skipLines: 1,
    });

    stream.pipe(parser);

    // ----------------------------------------
    // PROCESS ROWS
    // ----------------------------------------

    for await (
      const rawRow of parser
    ) {
      const row =
        rawRow as CsvRow;

      processed += 1;

      const operation =
        createVillageOperation(
          row
        );

      if (!operation) {
        skipped += 1;
      } else {
        batch.push(
          operation
        );
      }

      if (
        batch.length >=
        BATCH_SIZE
      ) {
        /*
          Pause source while MongoDB
          batch is being written.

          This prevents memory growth.
        */

        stream.pause();

        try {
          await flushBatch();
        } finally {
          stream.resume();
        }
      }
    }

    // ----------------------------------------
    // LAST REMAINING BATCH
    // ----------------------------------------

    if (
      batch.length > 0
    ) {
      await flushBatch();
    }

    console.log(
      "\n================================="
    );

    console.log(
      "VILLAGE IMPORT COMPLETED"
    );

    console.log(
      "================================="
    );

    console.log(
      `Rows processed: ${processed}`
    );

    console.log(
      `Imported / Updated: ${valid}`
    );

    console.log(
      `Skipped: ${skipped}`
    );

    const totalVillages =
      await Village.countDocuments();

    console.log(
      `Villages in MongoDB: ${totalVillages}`
    );

    console.log(
      "================================="
    );
  };

// ============================================
// RUN
// ============================================

const run =
  async (): Promise<void> => {
    try {
      if (
        !process.env.MONGODB_URI
      ) {
        throw new Error(
          "MONGODB_URI is missing in .env"
        );
      }

      console.log(
        "Connecting MongoDB..."
      );

      await mongoose.connect(
        process.env.MONGODB_URI
      );

      console.log(
        "MongoDB connected."
      );

      await importVillages();

      console.log(
        "Village import finished successfully."
      );
    } catch (error) {
      console.error(
        "\nVillage import failed:"
      );

      console.error(
        error
      );

      process.exitCode = 1;
    } finally {
      await mongoose.disconnect();

      console.log(
        "MongoDB disconnected."
      );
    }
  };

void run();