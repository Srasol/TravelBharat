import Hero from "../components/Hero/Hero";
import FeaturedDestinations from "../components/FeaturedDestinations/FeaturedDestinations";
import PopularStates from "../components/PopularStates/PopularStates";
import Categories from "../components/Categories/Categories";
import Statistics from "../components/Statistics/Statistics";
import WhyChoose from "../components/WhyChoose/WhyChoose";
import Footer from "../components/Footer/Footer";
import HomeGallery from "../components/HomeGallery/HomeGallery";

function Home() {
  return (
    <>
      <Hero />
      <FeaturedDestinations />
      <PopularStates />
      <Categories />
      <Statistics />
      <HomeGallery />
      <WhyChoose />
      <Footer />
    </>
  );
}

export default Home;