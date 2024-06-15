import '../App.css'
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import SearchBar from '../components/SearchBar';

const Layout = ({ children, showSearchBar = true }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Hero />
      {showSearchBar && (
        <div className='container mx-auto'>
          <SearchBar />
        </div>
      )}
      <div className='container flex-grow-1 mx-auto mb-4'>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
