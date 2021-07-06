import "./UploadImageInput.css";
import { useRef, useState } from "react";

const UploadImageInput = ({ maxPhotos = 1 }) => {
  // we use the ref to call click on the input when user clicks on the + sign
  const inputRef = useRef();
  const openInput = () => inputRef.current.click();

  const filesSelectedRef = useRef([]); // to save the files selected between re-renders
  const [photosToUpload, setPhotosToUpload] = useState([]); // to store the processed images

  const handleChange = () => {
    // abort if we are trying to upload more photos than allowed
    if (inputRef.current.files.length > maxPhotos - photosToUpload.length) {
      alert(`Please, select up to ${maxPhotos} pictures.`);
      inputRef.current.value = null;
      return;
    }

    // save the files selected on the ref before resetting the input
    filesSelectedRef.current = [...inputRef.current.files];
    inputRef.current.value = null;

    // for each file selected, we transform it to base64 and store it into the photosToUpload state variable
    filesSelectedRef.current.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        setPhotosToUpload((current) => [
          ...current,
          {
            id: event.timeStamp,
            img: event.target.result,
          },
        ]);
      };

      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id) => {
    setPhotosToUpload((current) => current.filter((file) => file.id !== id));
  };

  return (
    <>
      <div className="boxGrid">
        {photosToUpload.length > 0 &&
          photosToUpload.map((photoSelected) => {
            return (
              <div
                className="photoBox"
                onClick={() => removePhoto(photoSelected.id)}
              >
                <img
                  alt=""
                  key={photoSelected.id}
                  src={photoSelected.img}
                  className="img"
                />
              </div>
            );
          })}
        {[...Array(maxPhotos - photosToUpload.length)].map(() => {
          return (
            <div className="box" onClick={openInput}>
              <div className="addSymbol">+</div>
            </div>
          );
        })}
      </div>
      <input
        type="file"
        className="hidden"
        multiple={maxPhotos > 1}
        accept="image/*"
        ref={inputRef}
        onChange={handleChange}
      />
    </>
  );
};

export default UploadImageInput;
