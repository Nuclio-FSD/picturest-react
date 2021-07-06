import { useEffect, useState } from "react";
import PinCard from "../pinCard/PinCard";
import "./PinsList.css";
import UploadImageInput from "../uploadImageInput/UploadImageInput";

const PinsList = () => {
  const [pins, setPins] = useState([]);
  const [refresh, setRefresh] = useState(1);
  const [pinName, setPinName] = useState();

  useEffect(() => {
    fetch("http://localhost:5001/api/pins")
      .then((response) => response.json())
      .then((json) => setPins(json))
      .catch((err) => console.log(err));
  }, [refresh]);

  const body = {
    name: pinName,
  };

  const createPin = () => {
    // TODO add handling of sending to Cloudinary
    fetch("http://localhost:5001/api/pins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => setRefresh())
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <span className="pinsList__title">Pins</span>
      <div className="pinsList__container">
        {pins.map((pin) => (
          <PinCard pin={pin} key={pin.id} />
        ))}
      </div>
      <form>
        <input onChange={(event) => setPinName(event.target.value)}></input>
        <UploadImageInput maxPhotos={4} />
        <button onClick={() => createPin()}>Create</button>
      </form>
    </div>
  );
};

export default PinsList;
