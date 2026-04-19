"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase, type Dish, type Vendor, type DishVariant, type DishAddon } from "@/lib/supabase/config";
import { Search, ShoppingCart, Plus, Minus, Trash2, User, Leaf, Drumstick } from "lucide-react";

interface DishWithDetails extends Dish {
  variants?: DishVariant[];
  addons?: DishAddon[];
  vendor?: Vendor;
}

interface CartItem extends DishWithDetails {
  quantity: number;
  selectedVariant?: DishVariant;
  selectedAddons?: DishAddon[];
}

export default function CustomerDashboard() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [dishes, setDishes] = useState<DishWithDetails[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [seatNumber] = useState("7A");

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    if (selectedVendor) {
      fetchDishes(selectedVendor);
    } else {
      fetchAllDishes();
    }
  }, [selectedVendor]);

  const fetchVendors = async () => {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("is_active", true)
      .order("stall_number");

    if (error) {
      console.error("Error fetching vendors:", error);
    } else {
      setVendors(data || []);
    }
  };

  const fetchDishes = async (vendorId: string) => {
    const { data: dishesData, error } = await supabase
      .from("dishes")
      .select(`
        *,
        vendor:vendors(*)
      `)
      .eq("vendor_id", vendorId)
      .eq("is_active", true)
      .gt("available_count", 0);

    if (error) {
      console.error("Error fetching dishes:", error);
      return;
    }

    await fetchDishDetails(dishesData || []);
  };

  const fetchAllDishes = async () => {
    const { data: dishesData, error } = await supabase
      .from("dishes")
      .select(`
        *,
        vendor:vendors(*)
      `)
      .eq("is_active", true)
      .gt("available_count", 0)
      .order("category");

    if (error) {
      console.error("Error fetching dishes:", error);
      return;
    }

    await fetchDishDetails(dishesData || []);
  };

  const fetchDishDetails = async (dishesData: any[]) => {
    const dishIds = dishesData.map((d) => d.id);

    const [variantsRes, addonsRes] = await Promise.all([
      supabase.from("dish_variants").select("*").in("dish_id", dishIds),
      supabase.from("dish_addons").select("*").in("dish_id", dishIds),
    ]);

    const dishesWithDetails = dishesData.map((dish) => ({
      ...dish,
      vendor: Array.isArray(dish.vendor) ? dish.vendor[0] : dish.vendor,
      variants: variantsRes.data?.filter((v) => v.dish_id === dish.id) || [],
      addons: addonsRes.data?.filter((a) => a.dish_id === dish.id) || [],
    }));

    setDishes(dishesWithDetails);
  };

  const addToCart = (dish: DishWithDetails) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id
            ? { ...item, quantity: Math.min(item.quantity + 1, dish.available_count) }
            : item
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const updateQuantity = (dishId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === dishId) {
            const newQuantity = item.quantity + delta;
            return { ...item, quantity: Math.max(0, Math.min(newQuantity, item.available_count)) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (dishId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== dishId));
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    const vendorId = cart[0].vendor_id;
    const totalAmount = cart.reduce((sum, item) => sum + item.base_price * item.quantity, 0);

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: "demo-customer",
        vendor_id: vendorId,
        seat_number: seatNumber,
        status: "pending",
        total_amount: totalAmount,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      alert("Failed to place order");
      return;
    }

    const orderItems = cart.map((item) => ({
      order_id: orderData.id,
      dish_id: item.id,
      quantity: item.quantity,
      price: item.base_price,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      alert("Failed to place order");
      return;
    }

    for (const item of cart) {
      await supabase
        .from("dishes")
        .update({ available_count: item.available_count - item.quantity })
        .eq("id", item.id);
    }

    alert("Order placed successfully!");
    setCart([]);
    if (selectedVendor) {
      fetchDishes(selectedVendor);
    } else {
      fetchAllDishes();
    }
  };

  const categories = ["All", ...new Set(dishes.map((d) => d.category))];
  const filteredDishes = dishes.filter(
    (dish) =>
      (selectedCategory === "All" || dish.category === selectedCategory) &&
      dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const subtotal = cart.reduce((sum, item) => sum + item.base_price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VenueTrix</h1>
                <p className="text-xs text-gray-500">Food Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Seat: {seatNumber}</span>
              </div>
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vendor Selection */}
            <Card className="p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Select Stall</h2>
                <Button
                  variant={selectedVendor === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedVendor(null)}
                  className={selectedVendor === null ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  All Stalls
                </Button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {vendors.map((vendor) => (
                  <button
                    key={vendor.id}
                    onClick={() => setSelectedVendor(vendor.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full border-2 transition-all ${
                      selectedVendor === vendor.id
                        ? "border-orange-500 bg-orange-50 text-orange-700 font-semibold"
                        : "border-gray-200 bg-white text-gray-700 hover:border-orange-300"
                    }`}
                  >
                    <div className="text-sm">{vendor.name}</div>
                    <div className="text-xs text-gray-500">{vendor.stall_number}</div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Search and Filters */}
            <Card className="p-6 bg-white shadow-sm">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? "bg-orange-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </Card>

            {/* Dishes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredDishes.map((dish) => (
                <Card
                  key={dish.id}
                  className="p-3 hover:shadow-lg transition-all cursor-pointer bg-white border border-gray-200 hover:border-orange-300 relative group"
                  onClick={() => addToCart(dish)}
                >
                  {/* Veg/Non-Veg Indicator */}
                  <div className="absolute top-2 left-2 z-10">
                    {dish.is_veg ? (
                      <div className="w-5 h-5 border-2 border-green-600 flex items-center justify-center bg-white rounded">
                        <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-red-600 flex items-center justify-center bg-white rounded">
                        <div className="w-2.5 h-2.5 bg-red-600 rounded-full"></div>
                      </div>
                    )}
                  </div>

                  {/* Dish Image */}
                  <div className="aspect-square bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                    {dish.image_url ? (
                      <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-2">
                        {dish.is_veg ? (
                          <Leaf className="w-12 h-12 text-green-500 mx-auto mb-1" />
                        ) : (
                          <Drumstick className="w-12 h-12 text-red-500 mx-auto mb-1" />
                        )}
                      </div>
                    )}
                    {cart.find((item) => item.id === dish.id) && (
                      <div className="absolute top-1 right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-md">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Dish Info */}
                  <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">{dish.name}</h3>
                  <p className="text-orange-600 font-bold text-base">₹{dish.base_price}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">Stock: {dish.available_count}</p>
                    {dish.variants && dish.variants.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Variants</span>
                    )}
                  </div>
                  {dish.vendor && (
                    <p className="text-xs text-gray-400 mt-1">{dish.vendor.stall_number}</p>
                  )}
                </Card>
              ))}
            </div>

            {filteredDishes.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No dishes available. Try selecting a different stall or category.</p>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white sticky top-24 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Your Cart
                </h3>
                {cart.length > 0 && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {cart.length}
                  </span>
                )}
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg flex-shrink-0 flex items-center justify-center">
                        {item.is_veg ? (
                          <Leaf className="w-6 h-6 text-green-600" />
                        ) : (
                          <Drumstick className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-orange-600 font-bold text-sm">
                          ₹{item.base_price} × ₹{(item.base_price * item.quantity).toFixed(0)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.id, -1);
                            }}
                            className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.id, 1);
                            }}
                            className="w-6 h-6 rounded bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(item.id);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Order Summary */}
              {cart.length > 0 && (
                <>
                  <div className="space-y-2 mb-6 text-sm border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">₹{subtotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-orange-600">₹{subtotal.toFixed(0)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={placeOrder}
                    className="w-full bg-orange-500 text-white hover:bg-orange-600 py-6 text-base font-semibold shadow-lg"
                  >
                    Place Order
                  </Button>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
