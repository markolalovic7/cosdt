import Axios from "axios";
import { Configuration } from "../Configuration";
import {SeminarAtendeeRecommendation} from "../../model/domain/classes/SeminarAtendeeRecommendation";
import {ApiParams} from "../../model/ui/types/ApiParams";

class SeminarAttendeesSuggestionsAPI {
  url: string = `${Configuration.apiUrl}/seminar-attendees`;


  get(id:number, params: ApiParams = {}): Promise<SeminarAtendeeRecommendation[]> {
    return Axios.get(`${this.url}/suggest/${id}`, { params })
  }


}

export default SeminarAttendeesSuggestionsAPI;
