/**
 * HALDHARA DEMO DATA
 * All values below are illustrative examples, not live market data.
 */

export const DEMO_MODE = true;

export const demoCrops = [
  { id: "demo-crop-1", cropName: "Ginger", quantityKg: 500, expectedPricePerKg: 85, location: "Itanagar, Arunachal Pradesh", status: "active", demo: true },
  { id: "demo-crop-2", cropName: "Potato", quantityKg: 800, expectedPricePerKg: 22, location: "Naharlagun, Arunachal Pradesh", status: "active", demo: true },
  { id: "demo-crop-3", cropName: "Pineapple", quantityKg: 300, expectedPricePerKg: 35, location: "Pasighat, Arunachal Pradesh", status: "active", demo: true },
  { id: "demo-crop-4", cropName: "Orange", quantityKg: 250, expectedPricePerKg: 48, location: "Ziro, Arunachal Pradesh", status: "active", demo: true },
  { id: "demo-crop-5", cropName: "Kiwi", quantityKg: 150, expectedPricePerKg: 120, location: "Ziro, Arunachal Pradesh", status: "active", demo: true },
  { id: "demo-crop-6", cropName: "Turmeric", quantityKg: 400, expectedPricePerKg: 60, location: "Aalo, Arunachal Pradesh", status: "active", demo: true },
  { id: "demo-crop-7", cropName: "Large Cardamom", quantityKg: 120, expectedPricePerKg: 240, location: "Tawang, Arunachal Pradesh", status: "active", demo: true },
  { id: "demo-crop-8", cropName: "King Chilli", quantityKg: 80, expectedPricePerKg: 180, location: "Pasighat, Arunachal Pradesh", status: "active", demo: true }
];

export const demoBuyerRequirements = [
  { id: "demo-req-1", cropName: "Ginger", quantityKg: 300, targetPricePerKg: 90, deliveryLocation: "Itanagar", status: "open", demo: true },
  { id: "demo-req-2", cropName: "Potato", quantityKg: 500, targetPricePerKg: 25, deliveryLocation: "Naharlagun", status: "open", demo: true },
  { id: "demo-req-3", cropName: "Pineapple", quantityKg: 200, targetPricePerKg: 38, deliveryLocation: "Pasighat", status: "open", demo: true },
  { id: "demo-req-4", cropName: "Orange", quantityKg: 150, targetPricePerKg: 50, deliveryLocation: "Ziro", status: "open", demo: true },
  { id: "demo-req-5", cropName: "Kiwi", quantityKg: 100, targetPricePerKg: 125, deliveryLocation: "Itanagar", status: "open", demo: true },
  { id: "demo-req-6", cropName: "Turmeric", quantityKg: 250, targetPricePerKg: 65, deliveryLocation: "Aalo", status: "open", demo: true }
];

export const demoOffers = [
  { id: "demo-offer-1", cropName: "Ginger", offeredQuantityKg: 200, offeredPricePerKg: 88, status: "pending", demo: true },
  { id: "demo-offer-2", cropName: "Potato", offeredQuantityKg: 400, offeredPricePerKg: 23, status: "accepted", demo: true },
  { id: "demo-offer-3", cropName: "Pineapple", offeredQuantityKg: 150, offeredPricePerKg: 36, status: "rejected", demo: true },
  { id: "demo-offer-4", cropName: "Orange", offeredQuantityKg: 100, offeredPricePerKg: 49, status: "pending", demo: true }
];

export const demoOrders = [
  { id: "demo-order-1", cropName: "Ginger", quantityKg: 100, total: 8800, status: "processing", demo: true },
  { id: "demo-order-2", cropName: "Potato", quantityKg: 200, total: 4600, status: "confirmed", demo: true },
  { id: "demo-order-3", cropName: "Pineapple", quantityKg: 80, total: 2880, status: "delivered", demo: true },
  { id: "demo-order-4", cropName: "Orange", quantityKg: 50, total: 2450, status: "pending", demo: true },
  { id: "demo-order-5", cropName: "Turmeric", quantityKg: 100, total: 6200, status: "processing", demo: true }
];

export const demoTransport = [
  { id: "demo-transport-1", route: "Ziro → Itanagar", cropName: "Kiwi", availableCapacityKg: 300, estimatedCost: 1200, demo: true },
  { id: "demo-transport-2", route: "Pasighat → Itanagar", cropName: "Pineapple", availableCapacityKg: 500, estimatedCost: 1800, demo: true },
  { id: "demo-transport-3", route: "Aalo → Naharlagun", cropName: "Turmeric", availableCapacityKg: 250, estimatedCost: 1400, demo: true },
  { id: "demo-transport-4", route: "Ziro → Pasighat", cropName: "Orange", availableCapacityKg: 200, estimatedCost: 950, demo: true }
];

export const demoMarketPrices = [
  { cropName: "Ginger", pricePerKg: 85, changePercent: 12, demo: true },
  { cropName: "Potato", pricePerKg: 22, changePercent: 8, demo: true },
  { cropName: "Pineapple", pricePerKg: 35, changePercent: 10, demo: true },
  { cropName: "Orange", pricePerKg: 48, changePercent: 6, demo: true },
  { cropName: "Kiwi", pricePerKg: 120, changePercent: 15, demo: true },
  { cropName: "Turmeric", pricePerKg: 60, changePercent: 4, demo: true }
];

export const demoCommunityPosts = [
  { id: "demo-post-1", author: "Tashi", crop: "Ginger", location: "Ziro", content: "What is the best time to harvest ginger?", likes: 12, replies: 4, demo: true },
  { id: "demo-post-2", author: "Maya", crop: "Kiwi", location: "Itanagar", content: "Looking for reliable kiwi buyers this season.", likes: 9, replies: 3, demo: true },
  { id: "demo-post-3", author: "Tsering", crop: "Potato", location: "Tawang", content: "Sharing tips for storing potatoes after harvest.", likes: 15, replies: 6, demo: true },
  { id: "demo-post-4", author: "Rina", crop: "Pineapple", location: "Pasighat", content: "How do you reduce damage during transport?", likes: 7, replies: 2, demo: true },
  { id: "demo-post-5", author: "Dawa", crop: "Orange", location: "Ziro", content: "Which packaging works best for oranges?", likes: 11, replies: 5, demo: true },
  { id: "demo-post-6", author: "Aman", crop: "Turmeric", location: "Aalo", content: "Tips for drying turmeric during rainy weather.", likes: 8, replies: 2, demo: true },
  { id: "demo-post-7", author: "Pema", crop: "Ginger", location: "Pasighat", content: "Interested in collective transport with nearby farmers.", likes: 18, replies: 7, demo: true },
  { id: "demo-post-8", author: "Leki", crop: "King Chilli", location: "Itanagar", content: "How should king chilli be graded before selling?", likes: 6, replies: 1, demo: true }
];
