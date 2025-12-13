UPDATE menu_items SET price = 180 WHERE name = 'Veg Crispie';
UPDATE menu_items SET price = 240 WHERE name = 'Paneer Pakoda';
UPDATE menu_items SET price = 160 WHERE name = 'Veg Cutlet';
UPDATE menu_items SET price = 240 WHERE name = 'Cheese Pakoda';
UPDATE menu_items SET price = 250 WHERE name = 'Cheese Balls';
UPDATE menu_items SET price = 139 WHERE name = 'French Fries';
UPDATE menu_items SET price = 185 WHERE name = 'Corn Crisipie';

-- Beverages (Large 650ml)
UPDATE menu_items SET price = 380 WHERE name = 'Kingfisher Premium' AND price > 250;
UPDATE menu_items SET price = 400 WHERE name = 'Budweiser Mild' AND price > 300;
UPDATE menu_items SET price = 400 WHERE name = 'Budweiser Magnum Strong' AND price > 300;
UPDATE menu_items SET price = 380 WHERE name = 'Tuborg Strong' AND price > 250;
UPDATE menu_items SET price = 399 WHERE name = 'Carlsberg Smooth' AND price > 250;
UPDATE menu_items SET price = 399 WHERE name = 'Heineken' AND price > 300;
UPDATE menu_items SET price = 279 WHERE name = 'Tuborg Can (500 ml)';

-- Beverages (Small 330ml / Imports)
UPDATE menu_items SET price = 299 WHERE name = 'Budweiser Magnum Strong' AND price < 300;
UPDATE menu_items SET price = 299 WHERE name = 'Heineken' AND price < 300;
UPDATE menu_items SET price = 299 WHERE name = 'Budweiser Mild' AND price < 300;
UPDATE menu_items SET price = 269 WHERE name = 'Carlsberg Smooth' AND price < 250;


-- Aged Rum
UPDATE menu_items SET sizes = ARRAY['?70', '?130', '?180', '?350'] WHERE name = 'Old Monk';

