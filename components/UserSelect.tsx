import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import CreatableAsyncSelect from "react-select/async-creatable";
import { getUsersByName } from "@/lib/actions/user";
import type { User } from "@/app/generated/prisma";
import Label from "./ui/Label";

type CoClimber = User | string;
type SelectOption = {
  label: string;
  value: CoClimber;
};

type UserSelectProps = {
  userId: string;
  setUsers: Dispatch<SetStateAction<CoClimber[]>>;
};

export default function UserSelect({ userId, setUsers }: UserSelectProps) {
  const [options, setOptions] = useState<SelectOption[]>([]);

  const handleCreate = (inputValue: string) => {
    const newOption = { label: inputValue, value: inputValue };
    setOptions((prevOptions) => [...prevOptions, newOption]);
  };

  const handleChange = (selectedOptions: readonly SelectOption[] | null) => {
    setOptions(selectedOptions ? [...selectedOptions] : []);
  };

  const fetchClimbers = async (query: string): Promise<SelectOption[]> => {
    const result = await getUsersByName(query);
    if ("error" in result) {
      return [];
    }

    const climbers = result.data;

    return climbers
      .filter((climber) => climber.id !== userId)
      .map((climber) => ({
        value: climber,
        label: `${climber.firstName} ${climber.lastName}`,
      }));
  };

  useEffect(() => {
    setUsers(options.map((user) => user.value));
  }, [options, setUsers]);

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
        value={options}
        placeholder="Poiščite ali vnesite imena"
      />
    </div>
  );
}
