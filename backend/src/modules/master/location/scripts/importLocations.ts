import dotenv from "dotenv";
import mongoose from "mongoose";
import * as XLSX from "xlsx";

import { Country } from "../country.model";
import {
  State,
  StateType,
} from "../state.model";
import { District } from "../district.model";
import { SubDistrict } from "../subDistrict.model";
import { Village } from "../village.model";

dotenv.config();

// ============================================
// CONFIG
// ============================================

const BATCH_SIZE = 2000;

// ============================================
// FILE PATHS
// ============================================

const STATE_FILE =
  "./data/All_Stateof_India.xlsx";

const DISTRICT_FILE =
  "./data/All_Districtof_India.xlsx";

const SUB_DISTRICT_FILE =
  "./data/All_Sub_Districtof_India.xlsx";

const VILLAGE_FILE =
  "./data/All_Villagesof_India.xlsx";

// ============================================
// TYPES
// ============================================

type ExcelRow = Record<
  string,
  unknown
>;

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

  const cleaned =
    String(value).trim();

  if (!cleaned) {
    return undefined;
  }

  return cleaned;
};

const cleanNumber = (
  value: unknown
): number | undefined => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return undefined;
  }

  const number =
    Number(value);

  if (
    Number.isNaN(number)
  ) {
    return undefined;
  }

  return number;
};

// ============================================
// READ EXCEL
// ============================================

const readExcel = (
  filePath: string
): ExcelRow[] => {
  const workbook =
    XLSX.readFile(filePath);

  const sheetName =
    workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error(
      `No sheet found in ${filePath}`
    );
  }

  const worksheet =
    workbook.Sheets[
      sheetName
    ];

  if (!worksheet) {
    throw new Error(
      `Worksheet not found in ${filePath}`
    );
  }

  /*
    LGD Excel structure:

    Row 1 = Report title
    Row 2 = Actual header
    Row 3 onwards = Data
  */

  const rawRows =
    XLSX.utils.sheet_to_json<
      unknown[]
    >(worksheet, {
      header: 1,
      defval: "",
      raw: false,
    });

  if (
    rawRows.length < 3
  ) {
    return [];
  }

  const headerRow =
    rawRows[1];

  if (!headerRow) {
    return [];
  }

  const headers =
    headerRow.map(
      (value) =>
        String(
          value ?? ""
        ).trim()
    );

  const dataRows =
    rawRows.slice(2);

  const result:
    ExcelRow[] = [];

  for (
    const row of dataRows
  ) {
    const object:
      ExcelRow = {};

    let hasData = false;

    headers.forEach(
      (
        header,
        index
      ) => {
        if (!header) {
          return;
        }

        const value =
          row[index];

        object[header] =
          value;

        if (
          value !==
            undefined &&
          value !== null &&
          String(
            value
          ).trim() !== ""
        ) {
          hasData = true;
        }
      }
    );

    if (hasData) {
      result.push(
        object
      );
    }
  }

  return result;
};

// ============================================
// IMPORT COUNTRY
// ============================================

const importCountry =
  async (): Promise<void> => {
    console.log(
      "Importing country..."
    );

    await Country.updateOne(
      {
        iso2: "IN",
      },
      {
        $set: {
          name: "India",
          iso2: "IN",
          iso3: "IND",
          phoneCode: "+91",
          isActive: true,
        },
      },
      {
        upsert: true,
      }
    );

    console.log(
      "Country imported."
    );
  };

// ============================================
// IMPORT STATES
// ============================================

const importStates =
  async (): Promise<void> => {
    console.log(
      "Reading states..."
    );

    const rows =
      readExcel(
        STATE_FILE
      );

    console.log(
      `States found: ${rows.length}`
    );

    const operations =
      rows
        .map((row) => {
          const lgdCode =
            cleanNumber(
              row[
                "State Code"
              ]
            );

          const name =
            cleanString(
              row[
                "State Name (In English)"
              ]
            );

          if (
            lgdCode ===
              undefined ||
            !name
          ) {
            return null;
          }

          const stateOrUT =
            cleanString(
              row[
                "State or UT"
              ]
            );

          const localName =
            cleanString(
              row[
                "State Name (In Local)"
              ]
            );

          const version =
            cleanNumber(
              row[
                "State Version"
              ]
            );

          const census2001Code =
            cleanString(
              row[
                "Census 2001 Code"
              ]
            );

          const census2011Code =
            cleanString(
              row[
                "Census 2011 Code"
              ]
            );

          return {
            updateOne: {
              filter: {
                countryCode:
                  "IN",
                lgdCode,
              },

              update: {
                $set: {
                  lgdCode,
                  name,

                  ...(localName
                    ? {
                        localName,
                      }
                    : {}),

                  ...(version !==
                  undefined
                    ? {
                        version,
                      }
                    : {}),

                  ...(census2001Code
                    ? {
                        census2001Code,
                      }
                    : {}),

                  ...(census2011Code
                    ? {
                        census2011Code,
                      }
                    : {}),

                  type:
                    stateOrUT ===
                    "U"
                      ? StateType.UNION_TERRITORY
                      : StateType.STATE,

                  countryCode:
                    "IN",

                  isActive:
                    true,
                },
              },

              upsert: true,
            },
          };
        })
        .filter(
          (
            operation
          ): operation is NonNullable<
            typeof operation
          > =>
            operation !==
            null
        );

    if (
      operations.length >
      0
    ) {
      await State.bulkWrite(
        operations,
        {
          ordered: false,
        }
      );
    }

    console.log(
      `States imported: ${operations.length}`
    );
  };

// ============================================
// IMPORT DISTRICTS
// ============================================

const importDistricts =
  async (): Promise<void> => {
    console.log(
      "Reading districts..."
    );

    const rows =
      readExcel(
        DISTRICT_FILE
      );

    console.log(
      `Districts found: ${rows.length}`
    );

    const operations =
      rows
        .map((row) => {
          const lgdCode =
            cleanNumber(
              row[
                "District Code"
              ]
            );

          const stateCode =
            cleanNumber(
              row[
                "State Code"
              ]
            );

          const name =
            cleanString(
              row[
                "District Name(In English)"
              ]
            );

          if (
            lgdCode ===
              undefined ||
            stateCode ===
              undefined ||
            !name
          ) {
            return null;
          }

          const census2001Code =
            cleanString(
              row[
                "Census 2001 Code"
              ]
            );

          const census2011Code =
            cleanString(
              row[
                "Census 2011 Code"
              ]
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
                  name,

                  ...(census2001Code
                    ? {
                        census2001Code,
                      }
                    : {}),

                  ...(census2011Code
                    ? {
                        census2011Code,
                      }
                    : {}),

                  isActive:
                    true,
                },
              },

              upsert: true,
            },
          };
        })
        .filter(
          (
            operation
          ): operation is NonNullable<
            typeof operation
          > =>
            operation !==
            null
        );

    if (
      operations.length >
      0
    ) {
      await District.bulkWrite(
        operations,
        {
          ordered: false,
        }
      );
    }

    console.log(
      `Districts imported: ${operations.length}`
    );
  };

// ============================================
// IMPORT SUB-DISTRICTS
// ============================================

const importSubDistricts =
  async (): Promise<void> => {
    console.log(
      "Reading sub-districts..."
    );

    const rows =
      readExcel(
        SUB_DISTRICT_FILE
      );

    console.log(
      `Sub-districts found: ${rows.length}`
    );

    const operations =
      rows
        .map((row) => {
          const lgdCode =
            cleanNumber(
              row[
                "Sub-district Code"
              ]
            );

          const stateCode =
            cleanNumber(
              row[
                "State Code"
              ]
            );

          const districtCode =
            cleanNumber(
              row[
                "District Code"
              ]
            );

          const name =
            cleanString(
              row[
                "Sub-district Name"
              ]
            );

          if (
            lgdCode ===
              undefined ||
            stateCode ===
              undefined ||
            districtCode ===
              undefined ||
            !name
          ) {
            return null;
          }

          const version =
            cleanNumber(
              row[
                "Sub-district Version"
              ]
            );

          const census2001Code =
            cleanString(
              row[
                "Census 2001 Code"
              ]
            );

          const census2011Code =
            cleanString(
              row[
                "Census 2011 Code"
              ]
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
                  name,

                  ...(version !==
                  undefined
                    ? {
                        version,
                      }
                    : {}),

                  ...(census2001Code
                    ? {
                        census2001Code,
                      }
                    : {}),

                  ...(census2011Code
                    ? {
                        census2011Code,
                      }
                    : {}),

                  isActive:
                    true,
                },
              },

              upsert: true,
            },
          };
        })
        .filter(
          (
            operation
          ): operation is NonNullable<
            typeof operation
          > =>
            operation !==
            null
        );

    if (
      operations.length >
      0
    ) {
      await SubDistrict.bulkWrite(
        operations,
        {
          ordered: false,
        }
      );
    }

    console.log(
      `Sub-districts imported: ${operations.length}`
    );
  };

// ============================================
// IMPORT VILLAGES
// ============================================

const importVillages =
  async (): Promise<void> => {
    console.log(
      "Reading villages..."
    );

    const rows =
      readExcel(
        VILLAGE_FILE
      );

    console.log(
      `Villages found: ${rows.length}`
    );

    let processed = 0;
    let valid = 0;
    let skipped = 0;

    for (
      let index = 0;
      index < rows.length;
      index += BATCH_SIZE
    ) {
      const batch =
        rows.slice(
          index,
          index +
            BATCH_SIZE
        );

      const operations =
        batch
          .map((row) => {
            const lgdCode =
              cleanNumber(
                row[
                  "Village Code"
                ]
              );

            const stateCode =
              cleanNumber(
                row[
                  "State Code"
                ]
              );

            const districtCode =
              cleanNumber(
                row[
                  "District Code"
                ]
              );

            const subDistrictCode =
              cleanNumber(
                row[
                  "Sub-District Code"
                ]
              );

            const name =
              cleanString(
                row[
                  "Village Name (In English)"
                ]
              );

            if (
              lgdCode ===
                undefined ||
              stateCode ===
                undefined ||
              districtCode ===
                undefined ||
              subDistrictCode ===
                undefined ||
              !name
            ) {
              skipped += 1;

              return null;
            }

            const localName =
              cleanString(
                row[
                  "Village Name (In Local)"
                ]
              );

            const version =
              cleanNumber(
                row[
                  "Village Version"
                ]
              );

            const category =
              cleanString(
                row[
                  "Village Category"
                ]
              );

            const status =
              cleanString(
                row[
                  "Village Status"
                ]
              );

            const census2001Code =
              cleanString(
                row[
                  "Census 2001 Code"
                ]
              );

            const census2011Code =
              cleanString(
                row[
                  "Census 2011 Code"
                ]
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
                      ? {
                          localName,
                        }
                      : {}),

                    ...(version !==
                    undefined
                      ? {
                          version,
                        }
                      : {}),

                    ...(category
                      ? {
                          category,
                        }
                      : {}),

                    ...(status
                      ? {
                          status,
                        }
                      : {}),

                    ...(census2001Code
                      ? {
                          census2001Code,
                        }
                      : {}),

                    ...(census2011Code
                      ? {
                          census2011Code,
                        }
                      : {}),

                    isActive:
                      true,
                  },
                },

                upsert: true,
              },
            };
          })
          .filter(
            (
              operation
            ): operation is NonNullable<
              typeof operation
            > =>
              operation !==
              null
          );

      if (
        operations.length >
        0
      ) {
        await Village.bulkWrite(
          operations,
          {
            ordered: false,
          }
        );

        valid +=
          operations.length;
      }

      processed +=
        batch.length;

      console.log(
        `Villages processed: ${processed}/${rows.length} | Valid: ${valid} | Skipped: ${skipped}`
      );
    }

    console.log(
      `Villages imported: ${valid}`
    );

    console.log(
      `Villages skipped: ${skipped}`
    );

    console.log(
      "Village import completed."
    );
  };

// ============================================
// FINAL DATABASE COUNTS
// ============================================

const showFinalCounts =
  async (): Promise<void> => {
    const [
      countryCount,
      stateCount,
      districtCount,
      subDistrictCount,
      villageCount,
    ] =
      await Promise.all([
        Country.countDocuments(),
        State.countDocuments(),
        District.countDocuments(),
        SubDistrict.countDocuments(),
        Village.countDocuments(),
      ]);

    console.log(
      "\n================================="
    );

    console.log(
      "DATABASE COUNTS"
    );

    console.log(
      "================================="
    );

    console.log(
      `Countries: ${countryCount}`
    );

    console.log(
      `States / UTs: ${stateCount}`
    );

    console.log(
      `Districts: ${districtCount}`
    );

    console.log(
      `Sub-Districts: ${subDistrictCount}`
    );

    console.log(
      `Villages: ${villageCount}`
    );

    console.log(
      "=================================\n"
    );
  };

// ============================================
// RUN IMPORT
// ============================================

const run =
  async (): Promise<void> => {
    try {
      if (
        !process.env
          .MONGODB_URI
      ) {
        throw new Error(
          "MONGODB_URI is missing in .env"
        );
      }

      console.log(
        "Connecting MongoDB..."
      );

      await mongoose.connect(
        process.env
          .MONGODB_URI
      );

      console.log(
        "MongoDB connected."
      );

      // Import order matters
      await importCountry();

      await importStates();

      await importDistricts();

      await importSubDistricts();

      await importVillages();

      await showFinalCounts();

      console.log(
        "================================="
      );

      console.log(
        "LGD location import completed successfully."
      );

      console.log(
        "================================="
      );
    } catch (error) {
      console.error(
        "Location import failed:"
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