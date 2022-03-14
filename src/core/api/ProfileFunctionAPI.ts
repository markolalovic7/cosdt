import Axios from "axios";
import { ProfileFunction } from "../../model/domain/classes/ProfileFunction";
import { Configuration } from "../Configuration";

class ProfileFunctionAPI {
    url: string = `${Configuration.apiUrl}/profile-functions`;

    getAll(): Promise<Array<ProfileFunction>> {
        return Axios.get(`${this.url}`);
    }

    get(id: number): Promise<ProfileFunction> {
        return Axios.get(`${this.url}/${id}`);
    }

    create(resource: ProfileFunction) : Promise<ProfileFunction> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: ProfileFunction) : Promise<ProfileFunction> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
}

export default ProfileFunctionAPI;