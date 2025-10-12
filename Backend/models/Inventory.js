import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    // Reference to the product
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true
    },
    
    // Stock management
    currentStock: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Stock thresholds
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0
    },
    
    highStockThreshold: {
      type: Number,
      default: 100,
      min: 0
    },
    
    // Stock status
    stockStatus: {
      type: String,
      enum: ["low", "normal", "high", "out"],
      default: "low"
    },
    
    // Inventory tracking
    lastRestocked: {
      type: Date,
      default: Date.now
    },
    
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    
    // Additional inventory attributes
    location: {
      type: String,
      trim: true,
      default: "Warehouse"
    },
    
    notes: {
      type: String,
      trim: true,
      default: ""
    },
    
    // Auto-calculated fields
    isLowStock: {
      type: Boolean,
      default: true
    },
    
    isOutOfStock: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Pre-save middleware to update stock status
inventorySchema.pre("save", function(next) {
  // Update stock status based on current stock
  if (this.currentStock === 0) {
    this.stockStatus = "out";
    this.isOutOfStock = true;
    this.isLowStock = false;
  } else if (this.currentStock <= this.lowStockThreshold) {
    this.stockStatus = "low";
    this.isLowStock = true;
    this.isOutOfStock = false;
  } else if (this.currentStock >= this.highStockThreshold) {
    this.stockStatus = "high";
    this.isLowStock = false;
    this.isOutOfStock = false;
  } else {
    this.stockStatus = "normal";
    this.isLowStock = false;
    this.isOutOfStock = false;
  }
  
  // Update last updated timestamp
  this.lastUpdated = new Date();
  
  next();
});

// Index for better performance
inventorySchema.index({ productId: 1 });
inventorySchema.index({ stockStatus: 1 });
inventorySchema.index({ isLowStock: 1 });

// Virtual for stock status color (for frontend)
inventorySchema.virtual("statusColor").get(function() {
  switch (this.stockStatus) {
    case "out": return "red";
    case "low": return "orange";
    case "normal": return "green";
    case "high": return "blue";
    default: return "gray";
  }
});

inventorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => { delete ret._id; }
});

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
