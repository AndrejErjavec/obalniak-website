import {useEffect, useState} from "react";
import CreatableAsyncSelect from "react-select/async-creatable";
import {getUsersByName} from "@/app/lib/actions/user";

export default function UserSearch({options, setOptions}) {
  // const [options, setOptions] = useState([]);

  const handleCreate = (inputValue) => {
    const newOption = { label: inputValue, value: inputValue };
    setOptions((prevOptions) => [...prevOptions, newOption]);
  };

  const filterClimbers = async (query) => {
    const climbers = await getUsersByName(query);
    return climbers.map(climber => ({
      value: climber, label: `${climber.firstName} ${climber.lastName}`
    }));
  }

  return (
    <div>
      <label htmlFor="select">Soplezalci</label>
      <CreatableAsyncSelect
        name={"select"}
        isMulti
        cacheOptions
        defaultOptions
        loadOptions={filterClimbers}
        onChange={(selectedOptions) => setOptions(selectedOptions)}
        onCreateOption={handleCreate}
        value={options}
        placeholder="Poiščite ali vnesite imena"
      />
    </div>
  );
}