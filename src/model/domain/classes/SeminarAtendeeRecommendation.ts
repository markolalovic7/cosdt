import {UserProfile} from "./UserProfile";

export class SeminarAtendeeRecommendation{
  attendedSeminars?:number;
  attendedSeminarsInCategory?:number;
  attendedSeminarsInsSubCategory?:number;
  profile!:UserProfile;
  score?:number;
  seminarDays?:number;
}
