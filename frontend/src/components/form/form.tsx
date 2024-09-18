import React from "react";
import "./styles/form.css";

const Form = (props) => {
  const [error, setError] = React.useState("");

  let url = props.url;
  let method = props.method;
  let successFunction = props.successFunction;

  let name = props.name;
  let inputFields = props.inputFields;

  let extraButtons = props.extraButtons;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    let response = await fetch(url, {
      method: method,
      body: new FormData(e.target),
    });

    if (response.status === 201) {
      successFunction(response);
    }

    if (response.status === 403) {
      setError((await response.text()).toString());
    }
  };

  return (
    <div className={"form-container"}>
      <h1>{name}</h1>
      <form className={"form-fields"} onSubmit={handleSubmit}>
        {inputFields.map((inputField) => {
          return (
            <input
              id={inputField.id}
              name={inputField.name}
              type={inputField.type}
              placeholder={inputField.placeholder}
            ></input>
          );
        })}
        <button type="submit">{name}</button>
      </form>
      {extraButtons}
      <p>{error}</p>
    </div>
  );
};

export default Form;
