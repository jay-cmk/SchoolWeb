import { Country } from "./country.model";
import { State } from "./state.model";
import { District } from "./district.model";
import { SubDistrict } from "./subDistrict.model";

// ============================================
// GET COUNTRIES
// ============================================

export const getCountries = async () => {
  return Country.find({
    isActive: true,
  })
    .select(
      "_id name iso2 iso3 phoneCode"
    )
    .sort({
      name: 1,
    })
    .lean();
};

// ============================================
// GET STATES BY COUNTRY
// ============================================

export const getStatesByCountry = async (
  countryCode: string
) => {
  const normalizedCountryCode =
    countryCode
      .trim()
      .toUpperCase();

  return State.find({
    countryCode:
      normalizedCountryCode,
    isActive: true,
  })
    .select(
      "_id lgdCode name localName type countryCode"
    )
    .sort({
      name: 1,
    })
    .lean();
};

// ============================================
// GET DISTRICTS BY STATE
// ============================================

export const getDistrictsByState =
  async (
    stateCode: number
  ) => {
    return District.find({
      stateCode,
      isActive: true,
    })
      .select(
        "_id lgdCode stateCode name"
      )
      .sort({
        name: 1,
      })
      .lean();
  };

// ============================================
// GET SUB-DISTRICTS BY DISTRICT
// ============================================

export const getSubDistrictsByDistrict =
  async (
    districtCode: number
  ) => {
    return SubDistrict.find({
      districtCode,
      isActive: true,
    })
      .select(
        "_id lgdCode stateCode districtCode name"
      )
      .sort({
        name: 1,
      })
      .lean();
  };