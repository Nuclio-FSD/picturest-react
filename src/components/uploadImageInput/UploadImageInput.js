import "./UploadImageInput.css";
import { useRef, useState, useEffect } from "react";

const UploadImageInput = ({ maxImages = 1, name, updateInputValue }) => {
  // if the user sets an incorrect number, set maxImages to 1
  if (typeof maxImages !== "number" || maxImages < 1) maxImages = 1;

  // use a ref on the input type=file element to call click on it when user clicks on the + sign
  const inputRef = useRef();
  const openInput = () => inputRef.current.click();

  const filesSelectedRef = useRef([]); // to avoid losing the files selected between re-renders
  const [imagesConverted, setImagesConverted] = useState([]); // to store the converted images
  const [imagesUploaded, setImagesUploaded] = useState([]); // to store the uploaded images

  // whenever there are new images uploaded to Cloudinary, we update the value to inform the parent
  useEffect(() => {
    updateInputValue(name, imagesUploaded);
  }, [imagesUploaded]);

  const handleChange = () => {
    // abort if we are trying to upload more images than allowed
    if (inputRef.current.files.length > maxImages - imagesConverted.length) {
      alert(`Please, select up to ${maxImages} pictures.`);
      inputRef.current.value = null;
      return;
    }

    // save the files selected on the ref before resetting the input
    filesSelectedRef.current = [...inputRef.current.files];
    inputRef.current.value = null;

    // for each file selected, we transform it to base64 and store it into the imagesConverted state variable
    filesSelectedRef.current.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const imageProcessed = {
          id: event.timeStamp,
          bas64: event.target.result,
          upload_status: "pending",
        };

        // once transformed, we store the image to render it on the page + proceed to sending it to Cloudinary
        setImagesConverted((current) => [...current, imageProcessed]);
        uploadImage(imageProcessed);
      };

      reader.readAsDataURL(file);
    });
  };

  const uploadImage = async (imageProcessed) => {
    const cloudinaryUrl = "https://api.cloudinary.com/v1_1/angelbt/auto/upload";

    const formData = new FormData();
    formData.append("file", imageProcessed.bas64);
    formData.append("upload_preset", "gqqtbphk");
    formData.append("folder", "cloudinary_example");

    const cloudinaryOptions = { method: "POST", body: formData };

    const response = await fetch(cloudinaryUrl, cloudinaryOptions);

    if (!response.ok) {
      setImagesUploaded((current) => [
        ...current,
        { ...imageProcessed, upload_status: "failed" },
      ]);
    }

    const json = await response.json();
    setImagesUploaded((current) => [
      ...current,
      { ...imageProcessed, upload_status: "success", url: json.secure_url },
    ]);
  };

  const removePhoto = (id) => {
    // we remove the image from both state variables
    setImagesConverted((current) => current.filter((file) => file.id !== id));
    setImagesUploaded((current) => current.filter((file) => file.id !== id)); // TODO send DELETE to Cloudinary
  };

  return (
    <>
      <div className="boxGrid">
        {/* TODO add trash icon and upload status */}
        {imagesConverted.length > 0 &&
          imagesConverted.map((imageConverted) => {
            {
              /* TODO fix layout */
            }
            return (
              <div className="unflex">
                <div
                  className="photoBox"
                  onClick={() => removePhoto(imageConverted.id)}
                >
                  <img
                    alt=""
                    key={imageConverted.id}
                    src={imageConverted.bas64}
                    className="img"
                  />
                </div>
                <div>
                  <p>
                    {imagesUploaded.find((img) => img.id === imageConverted.id)
                      ? imagesUploaded.find(
                          (img) => img.id === imageConverted.id
                        ).upload_status
                      : imageConverted.upload_status}
                  </p>
                </div>
              </div>
            );
          })}

        {[...Array(maxImages - imagesConverted.length)].map(() => {
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
        multiple={maxImages > 1}
        accept="image/*"
        ref={inputRef}
        onChange={handleChange}
        name={name}
      />
    </>
  );
};

export default UploadImageInput;
