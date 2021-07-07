import { useEffect, useState } from "react";
import PinCard from "../pinCard/PinCard";
import "./PinsList.css";
import UploadImageInput from "../uploadImageInput/UploadImageInput";
import { useForm } from "react-hook-form";

const PinsList = () => {
  const [pins, setPins] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // create a promise (fetch) for each one of the images
    // this wouldn't be needed if we had a route to creat pin that accepts multiple pins
    const promises = data.images.map((image) => {
      return new Promise((resolve, reject) => {
        fetch("http://localhost:5001/pins", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            urlImage: image.url,
          }),
        })
          .then((response) => {
            if (response.ok) {
              resolve();
            } else {
              throw Error(response.statusText);
            }
          })
          .catch((err) => {
            alert(err);
            reject();
          });
      });
    });

    // don't proceed to reload the page until all images have been sent
    await Promise.allSettled(promises);
    window.location.reload();
  };

  useEffect(() => {
    fetch("http://localhost:5001/pins")
      .then((response) => response.json())
      .then((json) => setPins(json))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <span className="pinsList__title">Pins</span>
      <div className="pinsList__container">
        {pins.map((pin) => (
          <PinCard pin={pin} key={pin.id} />
        ))}
      </div>
      <span className="pinsList__title">Upload Pins</span>
      <form onSubmit={handleSubmit(onSubmit)}>
        <UploadImageInput
          maxImages={4}
          {...register("images", { required: true })}
          updateInputValue={setValue}
        />
        <div className="pinsList__uploadBtn">
          <input className="pinsList__submit" type="submit" value="Upload" />
          {errors.file && (
            <span style={{ color: "red" }}>This field is required</span>
          )}
        </div>
      </form>
    </div>
  );
};

export default PinsList;
