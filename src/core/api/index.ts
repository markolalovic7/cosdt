import Axios from "axios";
import { Logger } from "../logger";
import DataVaultAPI from "./DataVaultAPI";
import OrganizerAPI from "./OrganizerAPI";
import LocationAPI from "./LocationAPI";
import InstitutionAPI from "./InstitutionAPI";
import ProfileFunctionAPI from "./ProfileFunctionAPI";
import BookCategoryAPI from "./BookCategoryAPI";
import SeminarCategoryAPI from "./SeminarCategoryAPI";
import BookSubcategoryAPI from "./BookSubcategoryAPI";
import SeminarSubcategoryAPI from "./SeminarSubcategoryAPI";
import SampleAPI from "./SampleAPI";
import UserProfileAPI from "./UserProfileAPI";
import ElectronicBookLibraryAPI from "./ElectronicBookLibraryAPI";
import CostCategoryAPI from "./CostCategoryAPI";
import CostSubcategoryAPI from "./CostSubcategoryAPI";
import ProfileClassAPI from "./ProfileClassAPI";
import EventAPI from "./EventAPI";
import SeminarAttendeeAPI from "./SeminarAttendeeAPI";
import SeminarAPI from "./SeminarAPI";
import SeminarAgendaAPI from "./SeminarAgendaAPI";
import SeminarCostAPI from "./SeminarCostAPI";
import SeminarMaterialAPI from "./SeminarMaterialAPI";
import ContractAPI from "./ContractAPI";
import SurveyAPI from "./SurveyAPI";
import SeminarSurveyAPI from "./SeminarSurveyAPI";
import ReportAPI from "./ReportAPI";
import ClassAPI from "./ClassAPI";
import ClassAttendeeAPI from "./ClassAttendeeAPI";
import ExamAPI from "./ExamAPI";
import ExamAttendeeAPI from "./ExamAttendeeAPI";
import ClassModuleAPI from "./ClassModuleAPI";
import ClassLectureAPI from "./ClassLectureAPI";
import ClassLectureInstanceAPI from "./ClassLectureInstanceAPI";
import ExamCategoryAPI from "./ExamCategoryAPI";
import ExamSubcategoryAPI from "./ExamSubcategoryAPI";
import WordTemplateAPI from "./WordTemplateAPI";
import ClassAttendeeMentorDiaryAPI from "./ClassAttendeeMentorDiaryAPI";
import ClassLectureDiaryAPI from "./ClassLectureDiaryAPI";
import ClassAttendeeMentorAPI from "./ClassAttendeeMentorAPI";
import ClassLectureMaterialsAPI from "./ClassLectureMaterialAPI";
import ExamMaterialAPI from "./ExamMaterialAPI";
import ExamTestAPI from "./ExamTestAPI";
import TakeSurveyAPI from "./takeSurveyAPI";
import SeminarAttendeesSuggestionsAPI from "./SeminarAttendeesSuggestionsAPI";
import ClassDiaryExportAPI from "./ClassDiaryExportAPI";
import ClassGradesAPI from "./ClassGradesAPI";

export const api = {
  sample: new SampleAPI(),
  event: new EventAPI(),
  userProfile: new UserProfileAPI(),
  organizer: new OrganizerAPI(),
  location: new LocationAPI(),
  institution: new InstitutionAPI(),
  profileClass: new ProfileClassAPI(),
  profileFunction: new ProfileFunctionAPI(),
  eBook: new ElectronicBookLibraryAPI(),
  dataVault: new DataVaultAPI(),
  report: new ReportAPI(),
  class: new ClassAPI(),
  classAttendee: new ClassAttendeeAPI(),
  classAttendeeMentorDiary: new ClassAttendeeMentorDiaryAPI(),
  classAttendeeMentor: new ClassAttendeeMentorAPI(),
  classLecture: new ClassLectureAPI(),
  classLectureInstance: new ClassLectureInstanceAPI(),
  classLectureDiary: new ClassLectureDiaryAPI(),
  classLectureMaterial: new ClassLectureMaterialsAPI(),
  classModule: new ClassModuleAPI(),
  wordTemplate: new WordTemplateAPI(),
  takeSurvey: new TakeSurveyAPI(),

  bookCategory: new BookCategoryAPI(),
  bookSubcategory: new BookSubcategoryAPI(),
  seminarCategory: new SeminarCategoryAPI(),
  seminarSubcategory: new SeminarSubcategoryAPI(),
  costCategory: new CostCategoryAPI(),
  costSubcategory: new CostSubcategoryAPI(),
  examCategory: new ExamCategoryAPI(),
  examSubcategory: new ExamSubcategoryAPI(),

  seminar: new SeminarAPI(),
  seminarAttendee: new SeminarAttendeeAPI(),
  suggestions: new SeminarAttendeesSuggestionsAPI(),
  seminarAgenda: new SeminarAgendaAPI(),
  seminarCost: new SeminarCostAPI(),
  seminarMaterial: new SeminarMaterialAPI(),
  seminarContract: new ContractAPI(),
  survey: new SurveyAPI(),
  seminarSurvey: new SeminarSurveyAPI(),

  exam: new ExamAPI(),
  examAttendee: new ExamAttendeeAPI(),
  examMaterial: new ExamMaterialAPI(),
  examTest: new ExamTestAPI(),

  exportDiary : new ClassDiaryExportAPI(),
  grades: new ClassGradesAPI(),

};

Axios.defaults.withCredentials = true;
// Add a response interceptor
Axios.interceptors.response.use(
  (response) => {
    Logger.info(response.status, response.config.method?.toUpperCase(), response.config.url);
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401 && !window.location.hostname.includes('localhost')) {
      window.location.href = '/';
    }
    else {
      Logger.error(error.message, error.config.method?.toUpperCase(), error.config.url);
      return Promise.reject(error);
    }
  });

// Add a request interceptor
Axios.interceptors.request.use(
  (config) => {
    config.headers["X-COSDT"] = Date.now().toString();
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
