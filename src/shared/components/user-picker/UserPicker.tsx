import React, { useState } from "react";
import { Button, Select, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import styles from "./UserPicker.module.scss";

import { api } from "../../../core/api";
import { Logger } from "../../../core/logger";
import { UserProfile } from "../../../model/domain/classes/UserProfile";
import UserPickerModal from "./UserPickerModal";

const { Option } = Select;

interface UserPickerProps {
  value?: Array<UserProfile> | UserProfile;
  onChange?(u?: Array<UserProfile> | UserProfile): void;
  mode?: "multiple";
  optionType?: 'name' | 'username';
  disabled?:boolean;
}

function UserPickerComponent({ value, onChange, mode, optionType = 'name', disabled }: UserPickerProps) {
  const isMultiple = mode === "multiple";
  const [usersList, setUsersList] = useState<Array<UserProfile>>(
    !value
      ? []
      : isMultiple
        ? (value as Array<UserProfile>)
        : [value as UserProfile]
  );
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleModalSelect = (selection: Array<UserProfile>) => {
    setUsersList(selection);
    setModalVisible(false);
    onChange && onChange(selection);
  };

  const handleSelect = (
    ids: Array<string | number> | string | number | undefined
  ) => {
    if (isMultiple) {
      let selectedIds = ids as Array<string>;
      const selection = selectedIds.map(
        (id) =>
          usersList.find((user) => user.id.toString() === id) ||
          (value as Array<UserProfile>).find(
            (user) => user.id.toString() === id
          )
      ) as UserProfile[];
      setUsersList(selection);
      onChange && onChange(selection);
    } else {
      let selectedId = ids as string;
      const selection =
        usersList.find((user) => user.id.toString() === selectedId) ||
        (value as UserProfile);
      setUsersList([selection]);
      onChange && onChange(selection);
    }
  };

  const handleSearch = async (value?: string) => {
    try {
      setSearchLoading(true);
      const users = value
        ? await api.userProfile.getAll({
          [`username.contains`]: value,
        })
        : [];
      setUsersList(users);
    } catch (e) {
      Logger.error(e);
    } finally {
      setSearchLoading(false);
    }
  };

  const val = isMultiple
    ? (value as Array<UserProfile>)?.map((val) => val.id.toString())
    : (value as UserProfile)?.id?.toString();

  return (
    <div className={styles.userPickerWrap}>
      <Select
        mode={mode}
        value={val}
        onChange={handleSelect}
        showSearch
        onSearch={handleSearch}
        loading={searchLoading}
        filterOption={false}
        notFoundContent={searchLoading ? <Spin size="small" /> : null}
        disabled={disabled}
      >
        {usersList.map((user, index) => (
          <Option key={`${index}`} value={user.id.toString()}>
            {optionType === 'username' && user.username}
            {optionType === 'name' && `${user.firstName} ${user.lastName}`}
          </Option>
        ))}
      </Select>
      <Button onClick={() => setModalVisible(true)}>
        <SearchOutlined />
      </Button>
      {modalVisible && (
        <UserPickerModal
          multiple={isMultiple}
          defaultUsers={usersList}
          onSelect={handleModalSelect}
          onClose={() => setModalVisible(false)}
        />
      )}
    </div>
  );
}

export default UserPickerComponent;
