import '../App.css'
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <div>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
