import '../App.css'
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Hero />
      <div className='flex-grow-1'>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
