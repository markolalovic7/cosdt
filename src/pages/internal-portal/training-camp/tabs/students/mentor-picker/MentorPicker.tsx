import React from "react";
import { Mentor } from "../../../../../../model/domain/classes/Mentor";
import { UserProfile } from "../../../../../../model/domain/classes/UserProfile";
import UserPickerComponent from "../../../../../../shared/components/user-picker/UserPicker";

interface MentorPickerComponentProps<T> {
  value?: Array<T>;
  onChange?(c: Array<T>): void;
}

function MentorPickerComponent({
  value = [],
  onChange
}: MentorPickerComponentProps<Mentor>) {
  let mentorProfiles: Array<UserProfile> = value.map((val: Mentor) => val.mentor);

  const handleChange = (userProfiles: Array<UserProfile>) => {
    onChange && onChange(userProfiles.map((userProfile) => {
      let mentor = value.find((mentor) => mentor.mentor.id === userProfile.id);
      if (!mentor) {
        mentor = new Mentor();
        mentor.mentor = userProfile;
      }
      return mentor;
    }));
  };

  return (
    <UserPickerComponent
      value={mentorProfiles}
      onChange={handleChange}
      mode="multiple"
      optionType="name"
    />
  );
}

export default MentorPickerComponent;
