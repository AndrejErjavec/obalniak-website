import { type Dispatch, type SetStateAction } from "react";
import CreatableAsyncSelect from "react-select/async-creatable";
import { getUsersByName } from "@/lib/actions/user";
import { CoClimber } from "@/types";
import Label from "./ui/Label";

type SelectOption = {
  label: string;
  value: CoClimber;
};

type UserSelectProps = {
  userId: string;
  selectedUsers?: CoClimber[];
  setUsers: Dispatch<SetStateAction<CoClimber[]>>;
};

const toOption = (user: CoClimber): SelectOption => {
  if (typeof user === "string") {
    return {
      label: user,
      value: user,
    };
  }

  return {
    value: user,
    label: `${user.firstName} ${user.lastName}`,
  };
};

export default function UserSelect({ userId, selectedUsers = [], setUsers }: UserSelectProps) {
  const handleCreate = (inputValue: string) => {
    setUsers((prev) => [...prev, inputValue]);
  };

  const handleChange = (selectedOptions: readonly SelectOption[] | null) => {
    setUsers(selectedOptions ? selectedOptions.map((option) => option.value) : []);
  };

  const fetchClimbers = async (query: string): Promise<SelectOption[]> => {
    const result = await getUsersByName(query);
    if ("error" in result) {
      return [];
    }

    return result.data
      .filter((climber) => climber.id !== userId)
      .map((climber) => ({
        value: climber,
        label: `${climber.firstName} ${climber.lastName}`,
      }));
  };

  return (
    <div>
      <Label htmlFor="select">Soplezalci</Label>
      <CreatableAsyncSelect
        name={"select"}
        isMulti
        cacheOptions
        defaultOptions
        loadOptions={fetchClimbers}
        onChange={handleChange}
        onCreateOption={handleCreate}
        value={selectedUsers.map(toOption)}
        placeholder="Poiščite ali vnesite imena"
      />
    </div>
  );
}
