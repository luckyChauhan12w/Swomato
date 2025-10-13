import React, { useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems } = useSelector(
    (state) => state.user
  );
  const cateScrollRef = useRef();
  const shopScrollRef = useRef();
  const sectionRef = useRef();
  const navigate = useNavigate();

  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);
  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);
  const [updatedItemsList, setUpdatedItemsList] = useState([]);

  const handleFilterByCategory = (category) => {
    if (category === "All") {
      setUpdatedItemsList(itemsInMyCity);
    } else {
      const filteredList = itemsInMyCity?.filter((i) => i.category === category);
      setUpdatedItemsList(filteredList);
    }
  };

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity);
  }, [itemsInMyCity]);

  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;
    if (element) {
      setLeftButton(element.scrollLeft > 0);
      setRightButton(
        element.scrollLeft + element.clientWidth < element.scrollWidth
      );
    }
  };

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (cateScrollRef.current) {
      updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton);
      updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);

      const cateListener = () =>
        updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton);
      const shopListener = () =>
        updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);

      cateScrollRef.current.addEventListener("scroll", cateListener);
      shopScrollRef.current.addEventListener("scroll", shopListener);

      return () => {
        cateScrollRef?.current?.removeEventListener("scroll", cateListener);
        shopScrollRef?.current?.removeEventListener("scroll", shopListener);
      };
    }
  }, [categories]);

  // Optional: Smooth scroll to menu section for "View Menu" button
  const scrollToSection = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-[100%] min-h-screen flex flex-col bg-[#ffffff] items-center overflow-y-auto">
      <Nav />

      <main className="w-[100%] px-8 flex p-2 flex-col">
        {/* Search Results Section */}
        {searchItems && searchItems.length > 0 && (
          <section className="rounded-3xl p-8">
            <header className="flex items-center justify-between mb-6 border-b border-orange-200 pb-3">
              <h1 className="text-orange-900 text-2xl sm:text-3xl font-bold flex items-center gap-2">
                Search Results
              </h1>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchItems.map((item) => (
                <FoodCard data={item} key={item._id} />
              ))}
            </div>
          </section>
        )}

        {/* Hero Section */}
        <section
          className="relative w-full h-[80vh] flex items-center justify-center rounded-3xl overflow-hidden"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-2xl">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Order your <span className="text-orange-400">favourite</span> food
              here
            </h1>
            <p className="text-white/90 text-lg sm:text-xl mb-6">
              Choose from a diverse menu featuring a delectable array of dishes
              crafted with the finest ingredients and culinary expertise. Our
              mission is to satisfy your cravings and elevate your dining
              experience, one delicious meal at a time.
            </p>
            <button
              onClick={scrollToSection}
              className="bg-white cursor-pointer text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-orange-100 transition"
            >
              View Menu
            </button>
          </div>
        </section>

        {/* Categories + Shops */}
        <section>
          {/* Categories */}
          <div className="backdrop-blur-sm rounded-3xl py-8">
            <div className="relative">
              {showLeftCateButton && (
                <button
                  className="absolute z-20 cursor-pointer left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full shadow-md hover:scale-110 transition"
                  onClick={() => scrollHandler(cateScrollRef, "left")}
                  aria-label="Scroll categories left"
                >
                  <FaCircleChevronLeft />
                </button>
              )}

              <div
                className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide"
                ref={cateScrollRef}
              >
                {categories.map((cate, index) => (
                  <CategoryCard
                    key={`category-${index}`}
                    name={cate.category}
                    image={cate.image}
                    onClick={() => handleFilterByCategory(cate.category)}
                  />
                ))}
              </div>

              {showRightCateButton && (
                <button
                  className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full shadow-md hover:scale-110 transition"
                  onClick={() => scrollHandler(cateScrollRef, "right")}
                  aria-label="Scroll categories right"
                >
                  <FaCircleChevronRight />
                </button>
              )}
            </div>
          </div>

          {/* Shops */}
          <div className="backdrop-blur-sm rounded-3xl py-5">
            <h1 className="text-orange-900 text-2xl sm:text-3xl font-bold mb-6">
              Best Shops in {currentCity}
            </h1>
            <div className="relative">
              {showLeftShopButton && (
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full shadow-md hover:scale-110 transition"
                  onClick={() => scrollHandler(shopScrollRef, "left")}
                  aria-label="Scroll shops left"
                >
                  <FaCircleChevronLeft />
                </button>
              )}
              <div
                className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide"
                ref={shopScrollRef}
              >
                {shopInMyCity?.map((shop, index) => (
                  <CategoryCard
                    key={`shop-${shop._id || index}`}
                    name={shop.name}
                    image={shop.image}
                    onClick={() => navigate(`/shop/${shop._id}`)}
                  />
                ))}
              </div>
              {showRightShopButton && (
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full shadow-md hover:scale-110 transition"
                  onClick={() => scrollHandler(shopScrollRef, "right")}
                  aria-label="Scroll shops right"
                >
                  <FaCircleChevronRight />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Suggested Food Items */}
        <section ref={sectionRef} className="rounded-3xl border-orange-100 py-8 mb-8">
          <h1 className="text-orange-900 text-2xl sm:text-3xl font-bold mb-6">
            Suggested Food Items
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {updatedItemsList?.map((item, index) => (
              <FoodCard key={`food-${item._id || index}`} data={item} />
            ))}
          </div>
          {updatedItemsList?.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center py-12 text-orange-600">
              <div className="text-6xl mb-4">🍴</div>
              <h3 className="text-xl font-semibold mb-2">No items found</h3>
              <p className="text-orange-500">
                Try selecting a different category or check back later!
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;
