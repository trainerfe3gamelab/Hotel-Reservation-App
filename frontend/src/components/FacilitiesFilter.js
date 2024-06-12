import { hotelFacilities } from "../config/hotel-option-config";

const FacilitiesFilter = ({ selectedFacilities, onChange }) => {
    return (
      <div className="border-bottom border-secondary pb-3">
        <h4 className="text-md font-weight-bold mb-2">Facilities</h4>
        {hotelFacilities.map((facility, index) => (
          <div className="form-check" key={index}>
            <input
              type="checkbox"
              className="form-check-input"
              id={`facility-${index}`}
              value={facility}
              checked={selectedFacilities.includes(facility)}
              onChange={onChange}
            />
            <label className="form-check-label" htmlFor={`facility-${index}`}>
              {facility}
            </label>
          </div>
        ))}
      </div>
    );
  };
  
  export default FacilitiesFilter;  