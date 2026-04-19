"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase, type Dish, type Order, type Vendor, type DishVariant, type DishAddon } from "@/lib/supabase/config";
import { Plus, Edit, Trash2, Package, Clock, CheckCircle, XCircle } from "lucide-react";

export default function VendorDashboard() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAddDish, setShowAddDish] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
    category: "",
    available_count: "",
    image_url: "",
    is_veg: true,
  });

  useEffect(() => {
    fetchVendor();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (vendor) {
      fetchDishes();
      // Subscribe to real-time order updates
      const subscription = supabase
        .channel("orders")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
            filter: `vendor_id=eq.${vendor.id}`,
          },
          () => {
            fetchOrders();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [vendor]);

  const fetchVendor = async () => {
    const { data, error } = await supabase.from("vendors").select("*").limit(1).single();

    if (error) {
      console.error("Error fetching vendor:", error);
    } else {
      setVendor(data);
    }
  };

  const fetchDishes = async () => {
    if (!vendor) return;

    const { data, error } = await supabase
      .from("dishes")
      .select("*")
      .eq("vendor_id", vendor.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching dishes:", error);
    } else {
      setDishes(data || []);
    }
  };

  const fetchOrders = async () => {
    if (!vendor) return;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("vendor_id", vendor.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data || []);
    }
  };

  const handleSubmitDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;

    const dishData = {
      vendor_id: vendor.id,
      name: formData.name,
      description: formData.description,
      base_price: parseFloat(formData.base_price),
      category: formData.category,
      available_count: parseInt(formData.available_count),
      image_url: formData.image_url || null,
      is_veg: formData.is_veg,
      is_active: true,
    };

    if (editingDish) {
      const { error } = await supabase.from("dishes").update(dishData).eq("id", editingDish.id);

      if (error) {
        console.error("Error updating dish:", error);
        alert("Failed to update dish");
      } else {
        alert("Dish updated successfully!");
        resetForm();
        fetchDishes();
      }
    } else {
      const { error } = await supabase.from("dishes").insert(dishData);

      if (error) {
        console.error("Error adding dish:", error);
        alert("Failed to add dish");
      } else {
        alert("Dish added successfully!");
        resetForm();
        fetchDishes();
      }
    }
  };

  const handleDeleteDish = async (dishId: string) => {
    if (!confirm("Are you sure you want to delete this dish?")) return;

    const { error } = await supabase.from("dishes").delete().eq("id", dishId);

    if (error) {
      console.error("Error deleting dish:", error);
      alert("Failed to delete dish");
    } else {
      alert("Dish deleted successfully!");
      fetchDishes();
    }
  };

  const handleEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name,
      description: dish.description || "",
      base_price: dish.base_price.toString(),
      category: dish.category,
      available_count: dish.available_count.toString(),
      image_url: dish.image_url || "",
      is_veg: dish.is_veg,
    });
    setShowAddDish(true);
  };

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    } else {
      fetchOrders();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      base_price: "",
      category: "",
      available_count: "",
      image_url: "",
      is_veg: true,
    });
    setEditingDish(null);
    setShowAddDish(false);
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "preparing":
        return <Package className="w-4 h-4" />;
      case "ready":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendor Console</h1>
              <p className="text-gray-600 mt-1">{vendor?.name || "Loading..."}</p>
            </div>
            <Button variant="outline">Sign Out</Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Orders</h2>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No orders yet</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <Card key={order.id} className="p-4 bg-gray-50 border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">Order #{order.id.slice(0, 8)}</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Seat: {order.seat_number} • ${order.total_amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "preparing")}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              Accept
                            </Button>
                          )}
                          {order.status === "preparing" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "ready")}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              Ready
                            </Button>
                          )}
                          {order.status === "ready" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "delivered")}
                              className="bg-gray-500 hover:bg-gray-600"
                            >
                              Delivered
                            </Button>
                          )}
                          {(order.status === "pending" || order.status === "preparing") && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, "cancelled")}
                              className="text-red-600 hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Inventory Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Inventory</h2>
                <Button
                  onClick={() => {
                    resetForm();
                    setShowAddDish(true);
                  }}
                  className="bg-orange-500 hover:bg-orange-600"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Dish
                </Button>
              </div>

              {showAddDish && (
                <form onSubmit={handleSubmitDish} className="mb-6 p-4 bg-white border-2 border-orange-200 rounded-lg space-y-4">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">
                    {editingDish ? "Edit Dish" : "Add New Dish"}
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dish Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Paneer Tikka"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Brief description of the dish"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 180"
                      value={formData.base_price}
                      onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select
                      value={formData.is_veg ? "veg" : "non-veg"}
                      onChange={(e) => setFormData({ ...formData, is_veg: e.target.value === "veg" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                    >
                      <option value="veg">🟢 Vegetarian</option>
                      <option value="non-veg">🔴 Non-Vegetarian</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <input
                      type="text"
                      placeholder="e.g., Starters, Main Course, Biryani"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Stock *</label>
                    <input
                      type="number"
                      placeholder="e.g., 25"
                      value={formData.available_count}
                      onChange={(e) => setFormData({ ...formData, available_count: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                      {editingDish ? "Update Dish" : "Add Dish"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm} className="flex-1 font-semibold">
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {dishes.map((dish) => (
                  <Card key={dish.id} className="p-3 bg-gray-50 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900">{dish.name}</h4>
                        <p className="text-orange-500 font-bold text-sm">₹{dish.base_price.toFixed(0)}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Stock: {dish.available_count} • {dish.category} • {dish.is_veg ? "🟢 Veg" : "🔴 Non-Veg"}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditDish(dish)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDish(dish.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
