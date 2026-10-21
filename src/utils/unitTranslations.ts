export const unitTranslationsByCode: Record<
  string,
  { nameEn: string; propertyEn: string; locationEn: string; cityEn: string; districtEn: string }
> = {
  'UNT-YMFCHL': {
    nameEn: 'Luxury Al-Rimal Apartment - Tower 4 (Copy)',
    propertyEn: 'Al-Rimal Residential Towers',
    locationEn: 'Riyadh - Al Olaya',
    cityEn: 'Riyadh',
    districtEn: 'Al Olaya',
  },
  'UNT-Q4HSI8': {
    nameEn: 'Al-Narjis VIP Villa Private Pool (Copy)',
    propertyEn: 'Al-Narjis Residence Compound',
    locationEn: 'Riyadh - Al Narjis',
    cityEn: 'Riyadh',
    districtEn: 'Al Narjis',
  },
  'UNT-Q4HSIB': {
    nameEn: 'Al-Narjis VIP Villa Private Pool (Copy)',
    propertyEn: 'Al-Narjis Residence Compound',
    locationEn: 'Riyadh - Al Narjis',
    cityEn: 'Riyadh',
    districtEn: 'Al Narjis',
  },
  'UNT-105': {
    nameEn: 'Al Olaya Apartment 102 - Periodic Maintenance',
    propertyEn: 'Al Olaya Building 12',
    locationEn: 'Riyadh - Al Olaya',
    cityEn: 'Riyadh',
    districtEn: 'Al Olaya',
  },
  'UNT-104': {
    nameEn: 'Al Yamama Family Chalet',
    propertyEn: 'Al Yamama Resort',
    locationEn: 'Riyadh - Al Olaya',
    cityEn: 'Riyadh',
    districtEn: 'Al Olaya',
  },
  'UNT-103': {
    nameEn: 'Corniche Studio with Sea View',
    propertyEn: 'Al-Shati Towers',
    locationEn: 'Jeddah - Al Shati',
    cityEn: 'Jeddah',
    districtEn: 'Al Shati',
  },
  'UNT-102': {
    nameEn: 'Al-Narjis VIP Villa Private Pool',
    propertyEn: 'Al-Narjis Residence Compound',
    locationEn: 'Riyadh - Al Narjis',
    cityEn: 'Riyadh',
    districtEn: 'Al Narjis',
  },
  'UNT-101': {
    nameEn: 'Luxury Al-Rimal Apartment - Tower 4',
    propertyEn: 'Al-Rimal Residential Towers',
    locationEn: 'Riyadh - Al Olaya',
    cityEn: 'Riyadh',
    districtEn: 'Al Olaya',
  },
};

export const unitNameMap: Record<string, string> = {
  'شقة الرمال الفاخرة - برج 4 (نسخة)': 'Luxury Al-Rimal Apartment - Tower 4 (Copy)',
  'مسبح خاص (نسخة) VIP فيلا النرجس': 'Al-Narjis VIP Villa Private Pool (Copy)',
  'فيلا النرجس VIP مسبح خاص (نسخة)': 'Al-Narjis VIP Villa Private Pool (Copy)',
  'شقة العليا 102 - صيانة دورية': 'Al Olaya Apartment 102 - Periodic Maintenance',
  'شاليه اليمامة للعائلات': 'Al Yamama Family Chalet',
  'استوديو الكورنيش بإطلالة بحرية': 'Corniche Studio with Sea View',
  'مسبح خاص VIP فيلا النرجس': 'Al-Narjis VIP Villa Private Pool',
  'فيلا النرجس VIP مسبح خاص': 'Al-Narjis VIP Villa Private Pool',
  'شقة الرمال الفاخرة - برج 4': 'Luxury Al-Rimal Apartment - Tower 4',
};

export const propertyNameMap: Record<string, string> = {
  'أبراج الرمال السكنية': 'Al-Rimal Residential Towers',
  'كمباوند النرجس ريزيدنس': 'Al-Narjis Residence Compound',
  'كمباوند النرجس رزيدنس': 'Al-Narjis Residence Compound',
  'عمارة العليا 12': 'Al Olaya Building 12',
  'منتجع اليمامة': 'Al Yamama Resort',
  'أبراج الشاطئ': 'Al-Shati Towers',
  'عقار': 'Property',
};

export const locationNameMap: Record<string, string> = {
  'الرياض - العليا': 'Riyadh - Al Olaya',
  'الرياض - النرجس': 'Riyadh - Al Narjis',
  'جدة - الشاطئ': 'Jeddah - Al Shati',
  'الرياض': 'Riyadh',
  'العليا': 'Al Olaya',
  'النرجس': 'Al Narjis',
  'الشاطئ': 'Al Shati',
  'جدة': 'Jeddah',
  'الدمام': 'Dammam',
  'الخبر': 'Al Khobar',
  'مكة المكرمة': 'Makkah',
  'دبي': 'Dubai',
  'أبوظبي': 'Abu Dhabi',
};

export function getLocalizedUnitName(name: string, code?: string, lang?: string): string {
  if (lang !== 'en') return name;
  const trimmed = name?.trim() || '';
  if (unitNameMap[trimmed]) return unitNameMap[trimmed];
  if (code && unitTranslationsByCode[code.toUpperCase()]?.nameEn) {
    return unitTranslationsByCode[code.toUpperCase()].nameEn;
  }
  return name;
}

export function getLocalizedPropertyName(property: string, code?: string, lang?: string): string {
  if (lang !== 'en') return property;
  const trimmed = property?.trim() || '';
  if (propertyNameMap[trimmed]) return propertyNameMap[trimmed];
  if (code && unitTranslationsByCode[code.toUpperCase()]?.propertyEn) {
    return unitTranslationsByCode[code.toUpperCase()].propertyEn;
  }
  return property;
}

export function getLocalizedLocation(location: string, code?: string, lang?: string): string {
  if (lang !== 'en') return location;
  const trimmed = location?.trim() || '';
  if (locationNameMap[trimmed]) return locationNameMap[trimmed];
  if (code && unitTranslationsByCode[code.toUpperCase()]?.locationEn) {
    return unitTranslationsByCode[code.toUpperCase()].locationEn;
  }
  if (trimmed.includes(' - ')) {
    const [city, area] = trimmed.split(' - ');
    const transCity = locationNameMap[city.trim()] || city;
    const transArea = locationNameMap[area.trim()] || area;
    return `${transCity} - ${transArea}`;
  }
  return location;
}

export function getLocalizedCity(city: string, code?: string, lang?: string): string {
  if (lang !== 'en') return city;
  const trimmed = city?.trim() || '';
  if (locationNameMap[trimmed]) return locationNameMap[trimmed];
  if (code && unitTranslationsByCode[code.toUpperCase()]?.cityEn) {
    return unitTranslationsByCode[code.toUpperCase()].cityEn;
  }
  return city;
}

export function getLocalizedDistrict(district: string, code?: string, lang?: string): string {
  if (lang !== 'en') return district;
  const trimmed = district?.trim() || '';
  if (locationNameMap[trimmed]) return locationNameMap[trimmed];
  if (code && unitTranslationsByCode[code.toUpperCase()]?.districtEn) {
    return unitTranslationsByCode[code.toUpperCase()].districtEn;
  }
  return district;
}
