import "./UploadImageInput.css";
import { useRef, useState, useEffect } from "react";
import { Spinner } from "@chakra-ui/spinner";

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
        const imageConverted = {
          id: event.timeStamp,
          base64: event.target.result,
        };

        // once transformed, we store the image to render it on the page + proceed to sending it to Cloudinary
        setImagesConverted((current) => [...current, imageConverted]);
        uploadImage(imageConverted);
      };

      reader.readAsDataURL(file);
    });
  };

  const uploadImage = async (imageConverted) => {
    const cloudinaryUrl = "https://api.cloudinary.com/v1_1/angelbt/auto/upload";

    const formData = new FormData();
    formData.append("file", imageConverted.base64);
    formData.append("upload_preset", "gqqtbphk");
    formData.append("folder", "cloudinary_example");

    const cloudinaryOptions = { method: "POST", body: formData };

    const response = await fetch(cloudinaryUrl, cloudinaryOptions);

    if (!response.ok) {
      // when upload fails, we add the image to imagesUploaded with a "failed" status
      setImagesUploaded((current) => [
        ...current,
        { id: imageConverted.id, upload_status: "failed" },
      ]);
    }

    const json = await response.json();

    setImagesUploaded((current) => [
      ...current,
      {
        id: imageConverted.id,
        upload_status: "success",
        url: json.secure_url,
      },
    ]);
  };

  const removePhoto = (imageConverted) => {
    // if the image is still not uploaded (or failed uploading) we don't allow removing it
    const convertedImageIsAlsoUploaded = imagesUploaded.find(
      (imageUploaded) => imageUploaded.id === imageConverted.id
    );
    if (!convertedImageIsAlsoUploaded) return;

    // else, we remove the image from both state variables
    setImagesConverted((current) =>
      current.filter((file) => file.id !== imageConverted.id)
    );
    setImagesUploaded((current) =>
      current.filter((file) => file.id !== imageConverted.id)
    ); // TODO send DELETE to Cloudinary
  };

  // returns a component showing the upload status of the image
  const UploadStatus = ({ imageConverted }) => {
    const convertedImageIsAlsoUploaded = imagesUploaded.find(
      (imageUploaded) => imageUploaded.id === imageConverted.id
    );

    if (!convertedImageIsAlsoUploaded)
      return <Spinner className="uploadProcess spinner" size="xl" />;
    if (convertedImageIsAlsoUploaded.upload_status === "success")
      return <span className="uploadProcess">✔</span>;
    if (convertedImageIsAlsoUploaded.upload_status === "failed")
      return <span className="uploadProcess">❌</span>;
  };

  return (
    <>
      <div className="boxGrid">
        {imagesConverted.length > 0 &&
          imagesConverted.map((imageConverted) => {
            return (
              <div
                className="photoBox"
                onClick={() => removePhoto(imageConverted)}
              >
                <img
                  alt=""
                  key={imageConverted.id}
                  src={imageConverted.base64}
                  className="img"
                />
                <UploadStatus imageConverted={imageConverted} />
              </div>
            );
          })}

        {/* print as many add boxes as remaining slots for images */}
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
