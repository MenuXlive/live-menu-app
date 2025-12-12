export interface MenuItem {
  name: string;
  price?: string;
  description?: string;
  halfPrice?: string;
  fullPrice?: string;
  sizes?: string[];
  image?: string;
  isChefSpecial?: boolean;
  isBestSeller?: boolean;
  isPremium?: boolean;
  isTopShelf?: boolean;
}

export interface MenuCategory {
  title: string;
  icon?: string;
  items: MenuItem[];
}

export interface MenuSection {
  title: string;
  categories: MenuCategory[];
}

export const snacksAndStarters: MenuSection = {
  title: "ARTISAN APPETIZERS",
  categories: [
    {
      title: "VEG",
      items: [
        { name: "Fried Peanuts", price: "₹120", description: "Crispy salted peanuts roasted to golden perfection" },
        { name: "Fried Papad", price: "₹60", description: "Traditional crispy lentil wafers, lightly spiced" },
        { name: "Masala Papad", price: "₹99", description: "Topped with fresh onions, tomatoes & tangy chaat masala" },
        { name: "Veg Pakoda", price: "₹139", description: "Assorted vegetables in chickpea batter, golden fried" },
        { name: "Veg Crispie", price: "₹120", description: "Crunchy vegetable fritters with house-made green chutney" },
        { name: "Paneer Pakoda", price: "₹170", description: "Cottage cheese cubes in spiced gram flour coating" },
        { name: "Veg Cutlet", price: "₹140", description: "Hand-pressed mixed vegetable patties, herb-crusted" },
        { name: "Cheese Pakoda", price: "₹159", description: "Melting cheese encased in crispy golden batter", isBestSeller: true },
        { name: "Cheese Balls", price: "₹159", description: "Creamy cheese spheres with a crunchy breadcrumb shell" },
        { name: "French Fries", price: "₹129", description: "Hand-cut potatoes, twice-fried for extra crispiness" },
        { name: "Corn Crisipie", price: "₹140", description: "Sweet corn kernels flash-fried with aromatic spices" },
        { name: "Matki Fry", price: "₹150", description: "Sprouted moth beans sautéed with fresh herbs" },
        { name: "Kaju Masala Fry", price: "₹310", description: "Premium cashews tossed in aromatic spices", isChefSpecial: true },
        { name: "Onion Rings", price: "₹180", description: "Crispy beer-battered onion rings with tangy dip" },
        { name: "Cheese Nachos", price: "₹290", description: "Tortilla chips loaded with melted cheese & jalapeños", isBestSeller: true },
        { name: "Peri Peri Fries", price: "₹220", description: "Spicy peri-peri seasoned crispy fries" },
        { name: "Cheese French Fries", price: "₹250", description: "Golden fries smothered in melted cheese sauce" },
      ],
    },
    {
      title: "NON-VEG",
      items: [
        { name: "Fried Chicken", price: "₹220", description: "Succulent pieces marinated overnight, deep-fried crispy" },
        { name: "Chicken Lollypop", price: "₹250", description: "Frenched drumettes in spicy Indo-Chinese glaze" },
        { name: "Chicken Cutlet", price: "₹250", description: "Minced chicken patties with caramelized onions" },
        { name: "Tandoori Chicken (Full)", price: "₹350", description: "Whole bird marinated in yogurt & 24 spices, clay-oven roasted" },
        { name: "Tandoori Chicken (Half)", price: "₹200", description: "Half portion of our signature clay-oven specialty" },
        { name: "Chicken Tikka", price: "₹280", description: "Boneless chunks in saffron-kissed tikka marinade" },
        { name: "Chicken Kabab", price: "₹260", description: "Hand-ground seekh kababs with fresh mint" },
        { name: "Chicken Chatpata", price: "₹240", description: "Tangy spiced chicken bites with tamarind drizzle" },
        { name: "Chicken Rara", price: "₹250", description: "Keema-coated chicken in rich tomato gravy", isBestSeller: true },
        { name: "Chicken Khara", price: "₹240", description: "Dry-rubbed with crushed peppercorns & whole spices" },
        { name: "Chicken Tawa", price: "₹280", description: "Griddle-seared with bell peppers & onions" },
        { name: "Paneer 65", price: "₹220", description: "Cottage cheese in fiery Hyderabadi-style batter" },
        { name: "Paneer & Chillie", price: "₹230", description: "Wok-tossed with fresh chilies & soy glaze" },
        { name: "Boiled Eggs (2 Pcs)", price: "₹80", description: "Perfectly boiled farm-fresh eggs" },
        { name: "Egg Pakoda", price: "₹190", description: "Boiled eggs in spiced chickpea batter, deep-fried" },
        { name: "Chicken Nachos", price: "₹310", description: "Loaded nachos with spiced chicken & cheese" },
        { name: "Chicken Nuggets", price: "₹340", description: "Crispy breaded chicken bites with dipping sauce" },
        { name: "Fish Finger", price: "₹360", description: "Tender fish strips in golden breadcrumb coating" },
        { name: "Chicken 65", price: "₹460", description: "Spicy South Indian-style fried chicken", isBestSeller: true },
      ],
    },
  ],
};

export const foodMenu: MenuSection = {
  title: "GLOBAL MAINS",
  categories: [
    {
      title: "Non-Vegetarian Handi & Firepot",
      icon: "🍲",
      items: [
        { name: "Chicken Kolhapuri Firepot", price: "₹399", description: "Intensely spiced with dried red chilies & coconut" },
        {
          name: "Solapuri Chicken Handi",
          halfPrice: "₹499",
          fullPrice: "₹799",
          description: "Rustic preparation with black stone flower & wild spices"
        },
        { name: "Slow-Cooked Butter Chicken Handi", halfPrice: "₹599", fullPrice: "₹899", description: "Velvety tomato-cream gravy with charred chicken" },
        { name: "Royal Murgh Musallam Handi", halfPrice: "₹599", fullPrice: "₹999", description: "Whole chicken stuffed with aromatic rice & eggs", isChefSpecial: true },
      ],
    },
    {
      title: "Slow-Cooked Mutton Specialities",
      icon: "🍖",
      items: [
        { name: "Mutton Ukkad Handi", halfPrice: "₹699", fullPrice: "₹1,199", description: "Traditional bone-in curry simmered for 6 hours" },
        { name: "Solapuri Mutton Handi", halfPrice: "₹799", fullPrice: "₹1,299", description: "Authentic Solapur-style with kala masala" },
        { name: "Kolhapuri Mutton Handi", halfPrice: "₹799", fullPrice: "₹1,299", description: "Fiery red gravy with freshly ground masala" },
        { name: "Rustic Mutton Curry", price: "₹399", description: "Home-style preparation with caramelized onions" },
        { name: "Signature Mutton Masala", price: "₹499", description: "Chef's special blend of 18 hand-roasted spices" },
      ],
    },
    {
      title: "The Live Thali Experience",
      icon: "🍽️",
      items: [
        {
          name: "Luxe Veg Thali",
          price: "₹299",
          description: "Seasonal vegetables, signature gravy, dal fry, rice, salad, papad & assorted breads"
        },
        { name: "Egg Thali", price: "₹299", description: "Masala egg preparation, rassa, dal, rice, salad & assorted breads" },
        { name: "Classic Chicken Thali", price: "₹399", description: "Chicken fry, rassa, soup, rice, salad & assorted breads" },
        { name: "Royal Mutton Thali", price: "₹499", description: "Mutton fry, Solapuri rassa, soup, wajdi, rice, salad & assorted breads" },
      ],
    },
    {
      title: "Vegetarian Chef's Mains",
      icon: "🥗",
      items: [
        { name: "Paneer Patiyala Royal", price: "₹399", description: "Creamy cottage cheese in rich cashew-tomato gravy" },
        { name: "Paneer Handi Signature", price: "₹399", description: "Slow-cooked in earthen pot with whole spices" },
        { name: "Paneer Tikka Masala / Lajawab Masala", price: "₹399", description: "Charred paneer cubes in smoky tomato sauce" },
        { name: "Classic Paneer Butter Masala", price: "₹399", description: "Silky makhani gravy with farm-fresh paneer" },
        { name: "Paneer Kadai Karari", price: "₹399", description: "Bell peppers & cottage cheese with kadai spices" },
        { name: "Diwani Paneer Handi", price: "₹399", description: "Mixed vegetables & paneer in aromatic curry" },
        { name: "Homestyle Paneer Masala", price: "₹399", description: "Simple, comforting preparation with onion-tomato base" },
        { name: "Paneer Bhurji Scramble", price: "₹399", description: "Crumbled cottage cheese with peppers & fresh herbs" },
        { name: "Kaju Rich Masala", price: "₹499", description: "Premium cashews in velvety saffron cream" },
        { name: "Kaju Cream Curry", price: "₹499", description: "Whole cashews swimming in delicate white gravy" },
        { name: "Veg Patiyala", price: "₹399", description: "Garden vegetables in royal Punjabi-style sauce" },
        { name: "Veg Kolhapuri Pot", price: "₹399", description: "Seasonal vegetables in spicy Kolhapuri masala" },
        { name: "Paneer Chilli", price: "₹499", description: "Indo-Chinese style paneer with bell peppers & soy sauce" },
        { name: "Mushroom Chilli", price: "₹399", description: "Button mushrooms in spicy garlic chilli sauce" },
        { name: "Gobi Manchurian", price: "₹499", description: "Crispy cauliflower in tangy Manchurian sauce" },
        { name: "Veg Spring Roll", price: "₹499", description: "Crispy rolls filled with fresh vegetables" },
        { name: "Honey Chilli Potato", price: "₹399", description: "Crispy potato fingers in sweet & spicy glaze" },
      ],
    },
  ],
};

export const beveragesMenu: MenuSection = {
  title: "CRAFT LIBATIONS",
  categories: [
    {
      title: "Craft & Classic Brews - Large (650 ml)",
      icon: "🍺",
      items: [
        { name: "Kingfisher Premium", price: "₹290", description: "India's favorite crisp, refreshing lager" },
        { name: "Budweiser Mild", price: "₹320", description: "Smooth American-style pale lager" },
        { name: "Budweiser Magnum Strong", price: "₹350", description: "Bold & full-bodied with rich malt character" },
        { name: "Tuborg Strong", price: "₹280", description: "Danish heritage with robust flavor profile" },
        { name: "Carlsberg Smooth", price: "₹300", description: "Exceptionally smooth Scandinavian brew" },
        { name: "Heineken", price: "₹330", description: "Iconic Dutch pilsner with balanced bitterness" },
        { name: "Tuborg Can (500 ml)", price: "₹260", description: "Smooth Danish lager in convenient can" },
      ],
    },
    {
      title: "Premium Beers & Imports (330 ml)",
      icon: "🍺",
      items: [
        { name: "Corona Extra", price: "₹350", description: "Mexican lager, served with lime" },
        { name: "Hoegaarden", price: "₹400", description: "Belgian white beer with citrus notes" },
        { name: "Budweiser Magnum Strong", price: "₹240", description: "Bold & full-bodied with rich malt character" },
        { name: "Heineken", price: "₹230", description: "Iconic Dutch pilsner with balanced bitterness" },
        { name: "Budweiser Mild", price: "₹220", description: "Smooth American-style pale lager" },
        { name: "Carlsberg Smooth", price: "₹210", description: "Exceptionally smooth Scandinavian brew" },
        { name: "Kingfisher Premium", price: "₹200", description: "India's favorite crisp, refreshing lager" },
        { name: "Tuborg Strong", price: "₹190", description: "Danish heritage with robust flavor profile" },
      ],
    },
    {
      title: "Refreshing Breezers (275 ml)",
      icon: "🍹",
      items: [
        { name: "Breezer Cranberry", price: "₹270", description: "Light & fruity with tart cranberry notes" },
        { name: "Breezer Blackberry", price: "₹270", description: "Sweet berry refreshment, perfectly chilled" },
        { name: "Breezer Lime", price: "₹270", description: "Zesty citrus with a refreshing twist" },
        { name: "Breezer Orange", price: "₹270", description: "Tropical orange burst, ice-cold" },
      ],
    },
    {
      title: "Crystal Clear Vodkas",
      icon: "🍸",
      items: [
        {
          name: "Magic Moments (Plain)",
          sizes: ["₹90", "₹170", "₹240", "₹440"],
          description: "Triple-distilled smoothness with clean finish"
        },
        { name: "Magic Moments Apple / Orange", sizes: ["₹90", "₹170", "₹240", "₹440"], description: "Fruit-infused with natural flavor essences" },
        { name: "Romanov Vodka (Plain / Apple)", sizes: ["₹90", "₹160", "₹220", "₹400"], description: "Classic Russian-style with subtle sweetness" },
        { name: "Smirnoff", sizes: ["₹140", "₹250", "₹360", "₹660"], description: "World-renowned purity, filtered ten times" },
        {
          name: "Absolut Vodka",
          sizes: ["₹220", "₹380", "₹530", "₹1,050"],
          description: "Swedish winter wheat from Åhus, distilled countless times for exceptional purity. Clean, rich & complex."
        },
      ],
    },
    {
      title: "Aged & Spiced Rums",
      icon: "🥃",
      items: [
        { name: "Old Monk", sizes: ["₹70", "₹130", "₹180", "₹330"], description: "Legendary 7-year aged dark rum with vanilla, oak & caramelized sugar notes", isBestSeller: true },
        { name: "Bacardi White", sizes: ["₹140", "₹250", "₹360", "₹660"], description: "Light & crisp, perfect for cocktails" },
        { name: "Bacardi Black", sizes: ["₹80", "₹160", "₹220", "₹420"], description: "Rich molasses flavor with oak undertones" },
        { name: "Bacardi Lemon", sizes: ["₹160", "₹270", "₹380", "₹710"], description: "Zesty citrus twist on classic rum" },
        { name: "Bacardi Mango", sizes: ["₹160", "₹270", "₹380", "₹710"], description: "Tropical mango-infused rum" },
        { name: "McDowell's Rum", sizes: ["₹70", "₹130", "₹180", "₹330"], description: "Smooth Caribbean-inspired blend" },
      ],
    },
    {
      title: "Indian Reserve Whiskies",
      icon: "🥃",
      items: [
        { name: "Imperial Blue", sizes: ["₹90", "₹150", "₹210", "₹380"], description: "Smooth blend with hints of oak & spice" },
        { name: "Royal Challenge", sizes: ["₹90", "₹170", "₹230", "₹440"], description: "Premium grain whisky with mellow character" },
        { name: "Royal Green", sizes: ["₹90", "₹150", "₹210", "₹380"], description: "Distinctively smooth with herbal notes" },
        { name: "Royal Stag", sizes: ["₹90", "₹170", "₹230", "₹440"], description: "India's iconic smooth whisky" },
        { name: "Royal Stag Barrel", sizes: ["₹100", "₹180", "₹250", "₹490"], description: "Barrel-select premium variant" },
        { name: "Signature", sizes: ["₹130", "₹240", "₹350", "₹650"], description: "Rare grain whisky with smooth finish" },
        { name: "McDowell's No.1", sizes: ["₹80", "₹140", "₹210", "₹380"], description: "India's largest-selling whisky" },
        { name: "Antiquity Blue", sizes: ["₹160", "₹260", "₹370", "₹700"], description: "Ultra-premium aged blend" },
        { name: "Blenders Pride", sizes: ["₹110", "₹210", "₹320", "₹630"], description: "Smooth blend of Indian grain spirits and Scotch malt" },
        { name: "Blenders Pride Reserve", sizes: ["₹120", "₹230", "₹340", "₹670"], description: "Rare malt reserve collection" },
        { name: "DSP Black", sizes: ["₹70", "₹120", "₹180", "₹330"], description: "Premium dark whisky blend" },
        { name: "Rockford Reserve", sizes: ["₹160", "₹260", "₹370", "₹710"], description: "Reserve collection with oak notes" },
        { name: "Rockford Classic", sizes: ["₹130", "₹240", "₹350", "₹650"], description: "Classic smooth blend" },
        { name: "Oaken Glow", sizes: ["₹110", "₹200", "₹290", "₹540"], description: "Oak-aged premium whisky" },
      ],
    },
    {
      title: "World Whisky Collection",
      icon: "🥃",
      items: [
        { name: "Ballantine's Finest", sizes: ["₹200", "₹350", "₹500", "₹980"], description: "Scottish blend with honey & apple notes" },
        { name: "Black & White", sizes: ["₹180", "₹350", "₹700", "₹980"], description: "Smoky Highland character with gentle peat" },
        { name: "Black Dog", sizes: ["₹180", "₹350", "₹700", "₹980"], description: "Triple gold matured for exceptional smoothness" },
        { name: "VAT 69", sizes: ["₹180", "₹330", "₹470", "₹920"], description: "Classic Scotch with smooth character" },
        { name: "Teachers Highland", sizes: ["₹200", "₹350", "₹500", "₹980"], description: "Highland single malt excellence" },
        { name: "Teachers 50", sizes: ["₹220", "₹420", "₹600", "₹1,080"], description: "Premium 50-year heritage blend" },
        { name: "100 Pipers", sizes: ["₹200", "₹350", "₹500", "₹980"], description: "Smooth Scotch with fruity notes" },
        { name: "Jameson Irish Whiskey", sizes: ["₹220", "₹420", "₹650", "₹1,190"], description: "Triple-distilled in Dublin. Smooth sherry sweetness, toasted wood & gentle spice. Ireland's finest.", isBestSeller: true },
        { name: "Johnnie Walker Red Label", sizes: ["₹200", "₹350", "₹500", "₹980"], description: "Bold & vibrant with cinnamon spice" },
        { name: "Johnnie Walker Black Label", sizes: ["₹540", "₹1,080", "₹1,620", "₹3,240"], description: "12-year aged blend with notes of dark fruit, vanilla & signature Islay smokiness", isTopShelf: true },
        { name: "Chivas Regal", sizes: ["₹590", "₹1,170", "₹1,760", "₹3,510"], description: "Luxury 12-year Scotch with wild honey, vanilla & subtle hazelnut finish", isPremium: true },
        { name: "Jack Daniel's", sizes: ["₹500", "₹990", "₹1,490", "₹2,970"], description: "Tennessee whiskey mellowed drop by drop through 10 feet of sugar maple charcoal", isBestSeller: true },
        { name: "Jim Beam Bourbon", sizes: ["₹410", "₹810", "₹1,220", "₹2,430"], description: "225 years of Kentucky craft. Rich vanilla, caramel corn & oak. America's #1 bourbon." },
        { name: "Monkey Shoulder", sizes: ["₹450", "₹900", "₹1,350", "₹2,700"], description: "Batch 27. Triple malt blend of Speyside's finest. Mellow vanilla, spicy marmalade & creamy finish.", isBestSeller: true },
        { name: "Glenfiddich 12Y", sizes: ["₹810", "₹1,620", "₹2,430", "₹4,860"], description: "Single malt with fresh pear, subtle oak & butterscotch. The world's most awarded single malt", isTopShelf: true },
        { name: "Talisker 10Y", sizes: ["₹770", "₹1,530", "₹2,300", "₹4,590"], description: "Isle of Skye's maritime malt. Peppery smoke, sea salt & dried fruit. Wild & rugged elegance.", isPremium: true },
      ],
    },
    {
      title: "Celebration Bottles (750 ml)",
      icon: "🍾",
      items: [
        { name: "Blender's Pride", price: "₹2,800", description: "Rare malt whisky for special occasions" },
        { name: "Antiquity Blue", price: "₹3,200", description: "Ultra-premium blend with distinguished character" },
        { name: "Royal Challenge", price: "₹2,700", description: "Full bottle of our refined grain whisky" },
        { name: "Royal Green", price: "₹3,200", description: "Complete bottle for sharing with friends" },
        { name: "Oak Smith Gold", price: "₹3,100", description: "Japanese-inspired craft with delicate oak finish" },
        { name: "Old Monk", price: "₹2,050", description: "Full bottle of the iconic dark rum" },
        { name: "Magic Moments (Plain / Apple)", price: "₹2,600", description: "Party-sized premium vodka" },
        { name: "Smirnoff", price: "₹3,400", description: "Celebration-ready international vodka" },
        { name: "Jägermeister (700ml)", price: "₹5,500", description: "The iconic German herbal liqueur bottle" },
      ],
    },
    {
      title: "Premium Vodkas",
      icon: "🍸",
      items: [
        { name: "Grey Goose (30 ml)", price: "₹650", description: "Crafted in France's Cognac region using soft winter wheat & pristine spring water. Silky smooth with subtle almond notes.", isTopShelf: true },
        { name: "Absolut Raspberry (30 ml)", price: "₹480", description: "Natural raspberry infusion" },
        { name: "Ketel One (30 ml)", price: "₹550", description: "300-year Dutch heritage. Copper pot distilled with hints of citrus & honey. Exceptionally crisp finish.", isPremium: true },
        { name: "Smirnoff Orange (30 ml)", price: "₹230", description: "Citrus-infused vodka" },
      ],
    },

    {
      title: "Fine Wines",
      icon: "🍷",
      items: [
        { name: "Fratelli Classic Shiraz (Glass)", price: "₹450", description: "Nashik Valley. Ripe blackberry & spice with velvety tannins. Oak-aged for 12 months." },
        { name: "Fratelli Classic Merlot (Glass)", price: "₹450", description: "Smooth red with plum flavors" },
        { name: "Fratelli Chenin Blanc (Glass)", price: "₹450", description: "Crisp white with tropical fruit" },
        { name: "Fratelli Shiraz Rosé (Glass)", price: "₹450", description: "Refreshing rosé with strawberry hints" },
        { name: "Sula Satori Merlot (Glass)", price: "₹450", description: "Nashik terroir. Plush plum & cherry with hints of chocolate. Soft, elegant tannins.", isBestSeller: true },
        { name: "Sula Cabernet Shiraz (Glass)", price: "₹450", description: "Bold red blend" },
        { name: "Sula Chenin Blanc (Glass)", price: "₹450", description: "Light white with citrus notes" },
        { name: "Sula Zinfandel Rosé (Glass)", price: "₹450", description: "Sweet rosé with berry flavors" },
        { name: "Sula Red Wine (Half Bottle 375ml)", price: "₹1,070", description: "Premium half bottle" },
      ],
    },
    {
      title: "Gin & Brandy",
      icon: "🍸",
      items: [
        { name: "Bombay Sapphire (30 ml)", price: "₹450", description: "10 hand-selected botanicals vapor-infused. Bright citrus, juniper & subtle spice. Crystal clarity.", isPremium: true },
        { name: "Beefeater (30 ml)", price: "₹400", description: "Classic London Dry Gin" },
        { name: "Mansion House Brandy (30 ml)", price: "₹200", description: "Smooth French-style brandy" },
        { name: "Honey Bee Brandy (30 ml)", price: "₹190", description: "Sweet honey-infused brandy" },
      ],
    },
    {
      title: "Premium Liqueurs",
      icon: "🍹",
      items: [
        { name: "Jägermeister (30 ml)", price: "₹550", description: "56 botanicals aged in oak. Bittersweet with anise, citrus & ginger. Perfectly chilled at -18°C.", isBestSeller: true },
        { name: "Kahlúa (30 ml)", price: "₹350", description: "Mexican arabica coffee & rum. Rich mocha with vanilla & caramel. The original coffee liqueur." },
        { name: "Baileys Irish Cream (30 ml)", price: "₹450", description: "Fresh Irish dairy cream & aged whiskey. Velvety chocolate & vanilla. Simply indulgent.", isBestSeller: true },
      ],
    },
    {
      title: "Soft Drinks & Beverages",
      icon: "🥤",
      items: [
        { name: "Mineral Water (1L)", price: "₹60", description: "Premium packaged water" },
        { name: "Mineral Water (500ml)", price: "₹40", description: "Half liter bottled water" },
        { name: "Sprite (250ml)", price: "₹50", description: "Lemon-lime soda" },
        { name: "Sprite (600ml)", price: "₹80", description: "Large lemon-lime soda" },
        { name: "Thums Up (250ml)", price: "₹50", description: "Strong cola" },
        { name: "Thums Up (600ml)", price: "₹80", description: "Large strong cola" },
        { name: "Soda Water", price: "₹40", description: "Carbonated water" },
        { name: "Red Bull (250ml)", price: "₹200", description: "Energy drink" },
      ],
    },
  ],
};

export const sideItems: MenuSection = {
  title: "ARTISAN SIDES",
  categories: [
    {
      title: "Refresh & Rehydrate",
      icon: "💧",
      items: [
        { name: "Premium Packaged Water", price: "₹60", description: "Purified mineral water, ice-cold" },
        { name: "Fresh Lime Soda (Sweet/Salted)", price: "₹120", description: "Hand-squeezed lime with sparkling soda" },
        { name: "Iced Tea (Lemon/Peach)", price: "₹150", description: "Freshly brewed, served over crushed ice" },
      ],
    },
    {
      title: "Gourmet Bar Bites",
      icon: "🍿",
      items: [
        { name: "Veg Manchow Bowl", price: "₹220", description: "Hearty Indo-Chinese soup with crispy noodles" },
        { name: "Chicken Lollipop", price: "₹300", description: "Classic drumettes with spicy Schezwan glaze" },
        { name: "Crispy Corn Kernels", price: "₹200", description: "Flash-fried with garlic butter & herbs" },
      ],
    },
    {
      title: "Artisanal Rice & Grains",
      icon: "🍚",
      items: [
        { name: "Egg Dum Biryani", halfPrice: "₹180", fullPrice: "₹260", description: "Slow-cooked with boiled eggs & fragrant basmati" },
        { name: "Chicken Biryani", halfPrice: "₹250", fullPrice: "₹400", description: "Layered dum-style with saffron & caramelized onions" },
        { name: "Veg Pulao", price: "₹190", description: "Aromatic rice studded with seasonal vegetables" },
      ],
    },
  ],
};