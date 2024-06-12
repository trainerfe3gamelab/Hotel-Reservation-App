const Pagination = ({ page, pages, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= pages; i++) {
      pageNumbers.push(i);
    }
  
    return (
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          {pageNumbers.map((number, index) => (
            <li
              key={index}
              className={`page-item ${page === number ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(number)}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };
  
  export default Pagination;
  