const PriceFilter = ({ selectedPrice, onChange }) => {
    return (
      <div className="border-bottom border-secondary pb-3">
        <h4 className="text-md font-weight-bold mb-2">Max Price</h4>
        <select
          className="form-select p-2 rounded-md"
          value={selectedPrice || ""}
          onChange={(event) => onChange(event.target.value ? parseInt(event.target.value) : undefined)}
        >
          <option value="">Select Max Price</option>
          {[50, 100, 200, 300, 500].map((price, index) => (
            <option key={index} value={price}>{price}</option>
          ))}
        </select>
      </div>
    );
  };
  
  export default PriceFilter;
  