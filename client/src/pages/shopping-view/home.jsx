import { Button } from "@/components/ui/button";
import Poultry from "../../assets/11.jpeg";
import Meat from "../../assets/12.jpeg";
import Fish from "../../assets/13.jpeg";
import Egg from "../../assets/14.jpeg";
import Vegetables from "../../assets/15.jpg";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "Poultry", label: "Poultry", img: Poultry },
  { id: "Meat", label: "Meat", img: Meat },
  { id: "Fish", label: "Fish", img: Fish },
  { id: "Egg", label: "Egg", img: Egg },
  { id: "Vegetables", label: "Vegetables", img: Vegetables },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ navigate to category listing
  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  // ✅ Product details
  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  // ✅ Add to cart
  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product added to cart" });
      }
    });
  }

  // ✅ open details dialog
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // ✅ auto slider change every 5s
  useEffect(() => {
    if (!featureImageList || featureImageList.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % featureImageList.length
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  // ✅ initial load products + feature images
  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">

      {/* ✅ Slider Section */}
      <div className="relative w-full h-[250px] sm:h-[400px] md:h-[500px] overflow-hidden">
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((slide, index) => (
            <img
              key={index}
              src={slide?.image}
              alt={`slide-${index}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))
        ) : (
          // fallback (loading)
          <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
            Loading slider...
          </div>
        )}

        {/* Left Button */}
        {featureImageList?.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentSlide(
                  (prev) =>
                    (prev - 1 + featureImageList.length) %
                    featureImageList.length
                )
              }
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 hover:bg-white"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </Button>

            {/* Right Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentSlide(
                  (prev) => (prev + 1) % featureImageList.length
                )
              }
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 hover:bg-white"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>

      {/* ✅ Category Section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="group cursor-pointer hover:shadow-lg hover:scale-105 transform transition-all duration-300 overflow-hidden"
              >
                <CardContent className="relative p-0 h-40 sm:h-48">
                  <img
                    src={categoryItem.img}
                    alt={categoryItem.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {categoryItem.label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Feature Products Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList?.length > 0 ? (
              productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">
                No products available.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ✅ Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
