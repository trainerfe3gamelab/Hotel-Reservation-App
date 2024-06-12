/**
 * @type {Object} 
 * @property {string[]} selectedStars 
 * @property {(event: React.ChangeEvent<HTMLInputElement>) => void} onChange 
 */
const Props = {};

const StarRatingFilter = ({ selectedStars, onChange } = Props) => {
    return (
      <div className="border-bottom border-secondary pb-3">
        <h4 className="text-md font-weight-bold mb-2">Property Rating</h4>
        {["5", "4", "3", "2", "1"].map((star, index) => (
          <label key={index} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              value={star}
              checked={selectedStars.includes(star)}
              onChange={onChange}
            />
            <span className="form-check-label">{star} Stars</span>
          </label>
        ))}
      </div>
    );
  };
  
  export default StarRatingFilter;
  