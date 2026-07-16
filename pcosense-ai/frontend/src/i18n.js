// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      personal_info: "Personal Information",
      age_selection: "Age Selection",
      how_old_are_you: "How old are you?",
      or_enter_age_manually: "Or Enter Age Manually",
      age: "Age",
      years: "years",
      next: "Next",
      back: "Back",
      weight_and_height: "Weight & Height",
      weight: "Weight",
      height: "Height",
      kg: "kg",
      lbs: "lbs",
      cm: "cm",
      inch: "inch",
      or_enter_weight_manually: "Or Enter Weight Manually",
      or_enter_height_manually: "Or Enter Height Manually",
      enter_manually: "Enter Manually",
      your_bmi: "Your BMI",
      waist_and_hip: "Waist & Hip",
      waist: "Waist",
      hip: "Hip",
      or_enter_waist_manually: "Or Enter Waist Manually",
      or_enter_hip_manually: "Or Enter Hip Manually",
      waist_hip_ratio: "Waist-to-Hip Ratio",
      age_validation_error: "Please select or enter an age between 10 and 60 years.",
      weight_validation_error: "Please enter a valid weight.",
      height_validation_error: "Please enter a valid height.",
      waist_validation_error: "Please enter a valid waist measurement.",
      hip_validation_error: "Please enter a valid hip measurement.",
      step_1_of_3: "Step 1 of 3: Age",
      step_2_of_3: "Step 2 of 3: Weight & Height",
      step_3_of_3: "Step 3 of 3: Waist & Hip",
    }
  },
  hi: {
    translation: {
      personal_info: "व्यक्तिगत जानकारी",
      age_selection: "आयु चयन",
      how_old_are_you: "आपकी आयु क्या है?",
      or_enter_age_manually: "या आयु मैन्युअल रूप से दर्ज करें",
      age: "आयु",
      years: "वर्ष",
      next: "आगे",
      back: "पीछे",
      weight_and_height: "वजन और ऊंचाई",
      weight: "वजन",
      height: "ऊंचाई",
      kg: "किग्रा",
      lbs: "पाउंड",
      cm: "सेमी",
      inch: "इंच",
      or_enter_weight_manually: "या वजन मैन्युअल रूप से दर्ज करें",
      or_enter_height_manually: "या ऊंचाई मैन्युअल रूप से दर्ज करें",
      enter_manually: "मैन्युअल रूप से दर्ज करें",
      your_bmi: "आपका बीएमआई (BMI)",
      waist_and_hip: "कमर और कूल्हे",
      waist: "कमर",
      hip: "कूल्हा",
      or_enter_waist_manually: "या कमर का माप मैन्युअल रूप से दर्ज करें",
      or_enter_hip_manually: "या कूल्हे का माप मैन्युअल रूप से दर्ज करें",
      waist_hip_ratio: "कमर-से-कूल्हा अनुपात",
      age_validation_error: "कृपया 10 से 60 वर्ष के बीच की आयु दर्ज करें।",
      weight_validation_error: "कृपया सही वजन दर्ज करें।",
      height_validation_error: "कृपया सही ऊंचाई दर्ज करें।",
      waist_validation_error: "कृपया सही कमर का माप दर्ज करें।",
      hip_validation_error: "कृपया सही कूल्हे का माप दर्ज करें।",
      step_1_of_3: "चरण 1 / 3: आयु",
      step_2_of_3: "चरण 2 / 3: वजन और ऊंचाई",
      step_3_of_3: "चरण 3 / 3: कमर और कूल्हा",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
