// Test script to verify the inventory auto-creation flow
// This can be run to test the complete product -> inventory flow

const testInventoryFlow = async () => {
  console.log("🧪 Testing Inventory Auto-Creation Flow...");
  
  // Test data
  const testProduct = {
    name: "Test Honey Product",
    category: "Raw Honey",
    weight: "500g",
    price: 1500,
    status: "Active",
    imageUrl: "https://example.com/honey.jpg",
    description: "Test product for inventory flow",
    sku: "TEST-001"
  };
  
  try {
    // 1. Create a product
    console.log("1️⃣ Creating product...");
    const productResponse = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testProduct)
    });
    
    if (!productResponse.ok) {
      throw new Error(`Product creation failed: ${productResponse.status}`);
    }
    
    const createdProduct = await productResponse.json();
    console.log("✅ Product created:", createdProduct.name, "ID:", createdProduct.id);
    
    // 2. Check if inventory was auto-created
    console.log("2️⃣ Checking auto-created inventory...");
    const inventoryResponse = await fetch(`http://localhost:3000/api/inventory/product/${createdProduct.id}`);
    
    if (!inventoryResponse.ok) {
      throw new Error(`Inventory check failed: ${inventoryResponse.status}`);
    }
    
    const inventory = await inventoryResponse.json();
    console.log("✅ Inventory found:", {
      productId: inventory.productId,
      currentStock: inventory.currentStock,
      stockStatus: inventory.stockStatus,
      isLowStock: inventory.isLowStock
    });
    
    // 3. Update stock level
    console.log("3️⃣ Testing stock update...");
    const stockUpdateResponse = await fetch(`http://localhost:3000/api/inventory/${inventory.id}/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", quantity: 25 })
    });
    
    if (!stockUpdateResponse.ok) {
      throw new Error(`Stock update failed: ${stockUpdateResponse.status}`);
    }
    
    const updatedInventory = await stockUpdateResponse.json();
    console.log("✅ Stock updated:", {
      currentStock: updatedInventory.currentStock,
      stockStatus: updatedInventory.stockStatus,
      isLowStock: updatedInventory.isLowStock
    });
    
    // 4. Get low stock items
    console.log("4️⃣ Checking low stock items...");
    const lowStockResponse = await fetch("http://localhost:3000/api/inventory/low-stock");
    const lowStockData = await lowStockResponse.json();
    console.log("✅ Low stock items count:", lowStockData.count);
    
    // 5. Get inventory stats
    console.log("5️⃣ Getting inventory stats...");
    const statsResponse = await fetch("http://localhost:3000/api/inventory/stats");
    const stats = await statsResponse.json();
    console.log("✅ Inventory stats:", {
      totalItems: stats.totalItems,
      lowStockCount: stats.lowStockCount,
      outOfStockCount: stats.outOfStockCount
    });
    
    console.log("🎉 All tests passed! Inventory flow is working correctly.");
    
    // Cleanup - delete the test product (this will also delete the inventory)
    console.log("🧹 Cleaning up test data...");
    const deleteResponse = await fetch(`http://localhost:3000/api/products/${createdProduct.id}`, {
      method: "DELETE"
    });
    
    if (deleteResponse.ok) {
      console.log("✅ Test data cleaned up successfully");
    }
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
};

// Export for use in other files
export default testInventoryFlow;

// If running directly
if (typeof window === "undefined") {
  testInventoryFlow();
}
