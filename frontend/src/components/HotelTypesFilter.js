import { hotelTypes } from "../config/hotel-option-config";

const HotelTypesFilter = ({ selectedHotelTypes, onChange }) => {
    return (
      <div className="border-bottom border-secondary pb-3">
        <h4 className="text-md font-weight-bold mb-2">Hotel Type</h4>
        {hotelTypes.map((hotelType, index) => (
          <div className="form-check" key={index}>
            <input
              type="checkbox"
              className="form-check-input"
              id={`hotelType-${index}`}
              value={hotelType}
              checked={selectedHotelTypes.includes(hotelType)}
              onChange={onChange}
            />
            <label className="form-check-label" htmlFor={`hotelType-${index}`}>
              {hotelType}
            </label>
          </div>
        ))}
      </div>
    );
  };
  
  export default HotelTypesFilter;
  