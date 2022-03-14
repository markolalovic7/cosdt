import Axios from "axios";
import { ProfileClass } from "../../model/domain/classes/ProfileClass";
import { Configuration } from "../Configuration";

class ProfileClassAPI {
    url: string = `${Configuration.apiUrl}/profile-classes`;

    getAll(): Promise<Array<ProfileClass>> {
        return Axios.get(`${this.url}`);
    }

    get(id: number): Promise<ProfileClass> {
        return Axios.get(`${this.url}/${id}`);
    }

    create(resource: ProfileClass) : Promise<ProfileClass> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: ProfileClass) : Promise<ProfileClass> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
}

export default ProfileClassAPI;