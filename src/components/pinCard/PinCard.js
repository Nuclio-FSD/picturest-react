import "./PinCard.css";

const PinCard = ({ pin }) => {
  return (
    <div className="pinCard__container">
      <div className="pinCard_info__container">
        <img alt="" src={pin.urlImage} className="pinCard__image" />
        <span className="pinCard_info_pin__title">{pin.name}</span>
      </div>
    </div>
  );
};

export default PinCard;
