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
  'أبراج الرمال': 'Al-Rimal Towers',
  'أبراج الشاطئ': 'Al-Shati Towers',
  'أبراج الشاطي': 'Al-Shati Towers',
  'برج الفيروز': 'Al-Fairouz Tower',
  'برج الفاتهرة': 'Al-Fatehra Tower',
  'برج الفاتهره': 'Al-Fatehra Tower',
  'برج الفاخرة': 'Al-Fakhira Tower',
  'برج الفاخره': 'Al-Fakhira Tower',
  'برج المملكة': 'Kingdom Tower',
  'برج الفيصلية': 'Al Faisaliah Tower',
  'برج رافال': 'Burj Rafal',
  'برج المجدول': 'Al Majdoul Tower',
  'برج العنود': 'Al Anoud Tower',
  'برج 4': 'Tower 4',
  'كمباوند النرجس ريزيدنس': 'Al-Narjis Residence Compound',
  'كمباوند النرجس رزيدنس': 'Al-Narjis Residence Compound',
  'عمارة العليا 12': 'Al Olaya Building 12',
  'منتجع اليمامة': 'Al Yamama Resort',
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
  'الشاطي': 'Al Shati',
  'جدة': 'Jeddah',
  'الدمام': 'Dammam',
  'الخبر': 'Al Khobar',
  'مكة المكرمة': 'Makkah',
  'مكة': 'Makkah',
  'المدينة المنورة': 'Madinah',
  'المدينة': 'Madinah',
  'دبي': 'Dubai',
  'أبوظبي': 'Abu Dhabi',
  'ابوظبي': 'Abu Dhabi',
  'الشارقة': 'Sharjah',
  'عجمان': 'Ajman',
  // Districts
  'المنصورة': 'Al-Mansourah',
  'الشوقية': 'Al-Shawqiyya',
  'الرمال': 'Al Rimal',
  'الياسمين': 'Al Yasmin',
  'الملقا': 'Al Malqa',
  'حطين': 'Hittin',
  'الصحافة': 'Al Sahafah',
  'العقيق': 'Al Aqiq',
  'الغدير': 'Al Ghadir',
  'المروج': 'Al Murooj',
  'السليمانية': 'Al Sulaimaniyah',
  'المعذر': 'Al Mathar',
  'الروضة': 'Al Rawdah',
  'الحمراء': 'Al Hamra',
  'السلامة': 'Al Salamah',
  'الزهراء': 'Al Zahra',
  'الصفا': 'Al Safa',
  'البلد': 'Al Balad',
  'أبحر': 'Obhur',
  'العزيزية': 'Al Aziziyah',
  'العوالي': 'Al Awali',
  'النسيم': 'Al Naseem',
  'الهدا': 'Al Hada',
  'الشفا': 'Al Shafa',
  'الطائف': 'Taif',
  'أبها': 'Abha',
  'تبوك': 'Tabuk',
  'حائل': 'Hail',
  'جازان': 'Jazan',
  'نجران': 'Najran',
  'الجبيل': 'Jubail',
  'ينبع': 'Yanbu',
};

const arabicCharMap: Record<string, string> = {
  'ا': 'a', 'أ': 'a', 'إ': 'e', 'آ': 'aa', 'ء': '', 'ئ': 'e', 'ؤ': 'o',
  'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
  'د': 'd', 'ذ': 'th', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
  'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh',
  'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a', 'ة': 'ah',
};

export function transliterateArabicToEnglish(text: string): string {
  if (!text) return '';
  if (!/[\u0600-\u06FF]/.test(text)) return text;

  const words = text.split(/\s+/).map(word => {
    const trimmed = word.trim();
    if (locationNameMap[trimmed]) return locationNameMap[trimmed];
    if (propertyNameMap[trimmed]) return propertyNameMap[trimmed];

    let w = trimmed;
    let prefix = '';
    if (w.startsWith('ال') && w.length > 2) {
      prefix = 'Al-';
      w = w.slice(2);
    }
    let converted = '';
    for (const ch of w) {
      converted += arabicCharMap[ch] !== undefined ? arabicCharMap[ch] : ch;
    }
    if (!converted) return word;
    converted = converted.charAt(0).toUpperCase() + converted.slice(1);
    return prefix + converted;
  });

  return words.join(' ');
}

export function getLocalizedUnitName(name: string, code?: string, lang?: string): string {
  if (lang !== 'en') return name;
  const trimmed = name?.trim() || '';
  if (unitNameMap[trimmed]) return unitNameMap[trimmed];
  if (code && unitTranslationsByCode[code.toUpperCase()]?.nameEn) {
    return unitTranslationsByCode[code.toUpperCase()].nameEn;
  }
  if (/[\u0600-\u06FF]/.test(trimmed)) {
    return transliterateArabicToEnglish(trimmed);
  }
  return name;
}

export function getLocalizedPropertyName(property: string, code?: string, lang?: string): string {
  if (lang !== 'en') return property;
  const trimmed = property?.trim() || '';
  if (!trimmed) return '';
  if (propertyNameMap[trimmed]) return propertyNameMap[trimmed];
  if (code && unitTranslationsByCode[code.toUpperCase()]?.propertyEn) {
    return unitTranslationsByCode[code.toUpperCase()].propertyEn;
  }

  // Handle dynamic tower names
  if (trimmed.startsWith('برج ')) {
    const sub = trimmed.replace(/^برج\s+/, '').trim();
    if (/^\d+$/.test(sub)) return `Tower ${sub}`;
    if (propertyNameMap[sub]) return `${propertyNameMap[sub]} Tower`;
    if (locationNameMap[sub]) return `${locationNameMap[sub]} Tower`;
    const trans = transliterateArabicToEnglish(sub);
    return `${trans} Tower`;
  }

  if (trimmed.startsWith('أبراج ') || trimmed.startsWith('ابراج ')) {
    const sub = trimmed.replace(/^(أبراج|ابراج)\s+/, '').trim();
    if (/^\d+$/.test(sub)) return `Towers ${sub}`;
    if (propertyNameMap[sub]) return `${propertyNameMap[sub]} Towers`;
    if (locationNameMap[sub]) return `${locationNameMap[sub]} Towers`;
    const trans = transliterateArabicToEnglish(sub);
    return `${trans} Towers`;
  }

  if (trimmed.startsWith('عمارة ') || trimmed.startsWith('عماره ')) {
    const sub = trimmed.replace(/^(عمارة|عماره)\s+/, '').trim();
    const trans = transliterateArabicToEnglish(sub);
    return `${trans} Building`;
  }

  if (trimmed.startsWith('كمباوند ') || trimmed.startsWith('مجمع ')) {
    const sub = trimmed.replace(/^(كمباوند|مجمع)\s+/, '').trim();
    const trans = transliterateArabicToEnglish(sub);
    return `${trans} Compound`;
  }

  if (trimmed.startsWith('منتجع ')) {
    const sub = trimmed.replace(/^منتجع\s+/, '').trim();
    const trans = transliterateArabicToEnglish(sub);
    return `${trans} Resort`;
  }

  if (/[\u0600-\u06FF]/.test(trimmed)) {
    return transliterateArabicToEnglish(trimmed);
  }

  return property;
}

export function getLocalizedLocation(
  location: string,
  code?: string,
  lang?: string,
  locationEn?: string
): string {
  if (lang !== 'en') return location;
  if (locationEn && locationEn.trim() && !/[\u0600-\u06FF]/.test(locationEn)) {
    return locationEn.trim();
  }
  const trimmed = location?.trim() || '';
  if (!trimmed) return '';
  if (locationNameMap[trimmed]) return locationNameMap[trimmed];
  if (code && unitTranslationsByCode[code.toUpperCase()]?.locationEn) {
    return unitTranslationsByCode[code.toUpperCase()].locationEn;
  }
  if (trimmed.includes(' - ')) {
    const parts = trimmed.split(' - ').map(p => p.trim());
    const transParts = parts.map(p => locationNameMap[p] || transliterateArabicToEnglish(p));
    return transParts.join(' - ');
  }
  return locationNameMap[trimmed] || transliterateArabicToEnglish(trimmed);
}

export function getLocalizedCity(city: string, code?: string, lang?: string): string {
  if (lang !== 'en') return city;
  const trimmed = city?.trim() || '';
  if (!trimmed) return '';
  if (locationNameMap[trimmed]) return locationNameMap[trimmed];
  if (code && unitTranslationsByCode[code.toUpperCase()]?.cityEn) {
    return unitTranslationsByCode[code.toUpperCase()].cityEn;
  }
  if (/[\u0600-\u06FF]/.test(trimmed)) {
    return transliterateArabicToEnglish(trimmed);
  }
  return city;
}

export function getLocalizedDistrict(district: string, code?: string, lang?: string): string {
  if (lang !== 'en') return district;
  const trimmed = district?.trim() || '';
  if (!trimmed) return '';
  if (locationNameMap[trimmed]) return locationNameMap[trimmed];
  if (code && unitTranslationsByCode[code.toUpperCase()]?.districtEn) {
    return unitTranslationsByCode[code.toUpperCase()].districtEn;
  }
  if (/[\u0600-\u06FF]/.test(trimmed)) {
    return transliterateArabicToEnglish(trimmed);
  }
  return district;
}
