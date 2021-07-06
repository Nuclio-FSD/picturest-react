import { useEffect, useState } from "react";
import PinCard from "../pinCard/PinCard";
import "./PinsList.css";
import UploadImageInput from "../uploadImageInput/UploadImageInput";
import { useForm } from "react-hook-form";

const PinsList = () => {
  const [pins, setPins] = useState([]);
  const [refresh, setRefresh] = useState(1);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // TODO add handling of sending to backend
    // fetch("http://localhost:5001/api/pins", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(body),
    // })
    //   .then((response) => response.json())
    //   .then((json) => setRefresh())
    //   .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch("http://localhost:5001/api/pins")
      .then((response) => response.json())
      .then((json) => setPins(json))
      .catch((err) => console.log(err));
  }, [refresh]);

  return (
    <div>
      <span className="pinsList__title">Pins</span>
      <div className="pinsList__container">
        {pins.map((pin) => (
          <PinCard pin={pin} key={pin.id} />
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <UploadImageInput
          maxImages={4}
          {...register("file", { required: true })}
          updateInputValue={setValue}
        />
        <input className="pinsList__submit" type="submit" value="Upload" />
        {errors.file && (
          <span style={{ color: "red" }}>This field is required</span>
        )}
      </form>
    </div>
  );
};

export default PinsList;
