import Axios from "axios";
import { Configuration } from "../Configuration";
import { WordTemplate } from "../../model/domain/classes/WordTemplate";
import { FileUpload } from "../../model/domain/classes/FileUpload";
import { ApiParams } from "../../model/ui/types/ApiParams";
import { FileUploadEntityEnum } from "../../model/domain/enums/FileUploadEntityEnum";

class WordTemplateAPI {
  url: string = `${Configuration.apiUrl}/word-template`;

  getAll(): Promise<Array<WordTemplate>> {
    return Axios.get(`${this.url}`);
  }

  update(id: FileUploadEntityEnum | undefined, data: FormData, query: ApiParams): Promise<WordTemplate> {
    const q = new URLSearchParams(query as any).toString();
    return Axios.put(`${this.url}/${id}?${q}`, data)
  }

  getFileUrl(file: FileUpload): string {
    return `${Configuration.baseUrl}/uploads${file.path}`;
  }
}

export default WordTemplateAPI;
