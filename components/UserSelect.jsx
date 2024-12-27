import {useEffect, useState} from "react";
import CreatableAsyncSelect from "react-select/async-creatable";
import {getUsersByName} from "@/app/lib/actions/user";

export default function UserSelect({users, setUsers}) {
  const [options, setOptions] = useState([]);

  const handleCreate = (inputValue) => {
    const newOption = { label: inputValue, value: inputValue };
    setOptions((prevOptions) => [...prevOptions, newOption]);
  };

  const handleChange = (selectedOptions) => {
    setOptions(selectedOptions);
  }

  const fetchClimbers = async (query) => {
    const climbers = await getUsersByName(query);
    return climbers.map(climber => ({
      value: climber, label: `${climber.firstName} ${climber.lastName}`
    }));
  }

  useEffect(() => {
    setUsers(options.map(user => user.value));
  }, [options]);

  return (
    <div>
      <label htmlFor="select">Soplezalci</label>
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