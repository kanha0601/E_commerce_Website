import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import homeData from "../../data/homeData";

const Home = () => {
const { user } = useAuth();

return (
<div className="bg-gray-50 min-h-screen">

{/* Hero Section */}  
  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">  
    <div className="max-w-7xl mx-auto px-6 py-24 text-center">  

      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">  
        {homeData.hero.title}  
      </h1>  

      <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">  
        {homeData.hero.subtitle}
      </p>  

      <div className="space-x-4">  

        <Link  
          to="/products"  
          className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"  
        >  
          {homeData.hero.shopBtn} 
        </Link>  

          
          {user ? (  
            <Link  
              to="/profile"  
              className="border border-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition transform hover:scale-105"  
            >  
              My Account  
            </Link>  
          ) : (  
            <>  
            
              <Link  
                to="/register"  
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition transform hover:scale-105 shadow-md"  
              >  
                {homeData.hero.registerBtn}  
              </Link>  
            </>  
          )}  
          


      </div>  
    </div>  
  </div>  

  {/* Features Section */}  
  <div className="max-w-7xl mx-auto px-6 py-20">

<h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
  {homeData.featuresTitle}
</h2>

<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

  {homeData.features.map((item) => (
    <div
      key={item.id}
      className="bg-gradient-to-tr from-purple-100 to-indigo-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
    >
      <h3 className="text-xl font-bold mb-3 text-purple-700">
        {item.title}
      </h3>

      <p className="text-gray-700">
        {item.desc}
      </p>
    </div>
  ))}

</div>
</div>
  {/* Call To Action */}  
  <div className="bg-gradient-to-r from-purple-400 to-blue-500 text-white py-20 text-center">  

    <h2 className="text-4xl font-bold mb-4 drop-shadow-md">  
      {homeData.cta.title} 
    </h2>  

    <p className="text-lg mb-8 text-white/90 drop-shadow-sm">  
      {homeData.cta.desc}  
    </p>  

    <Link  
      to="/products"  
      className="bg-white text-blue-600 px-10 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"  
    >  
      {homeData.cta.btn}
    </Link>  

  </div>  

</div>

);
};

export default Home;