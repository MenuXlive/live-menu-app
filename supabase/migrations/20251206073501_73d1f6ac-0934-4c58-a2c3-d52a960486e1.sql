-- First, delete all existing beverage categories and their items
DELETE FROM menu_items WHERE category_id IN (
  SELECT c.id FROM menu_categories c 
  JOIN menu_sections s ON c.section_id = s.id 
  WHERE s.type = 'beverages'
);

DELETE FROM menu_categories WHERE section_id IN (
  SELECT id FROM menu_sections WHERE type = 'beverages'
);

-- Get the beverages section ID
-- Create new categories with proper structure

-- Beer category
INSERT INTO menu_categories (section_id, title, icon, display_order)
SELECT s.id, 'Beer', '🍺', 1
FROM menu_sections s WHERE s.type = 'beverages';

-- Pint category (Premium beers)
INSERT INTO menu_categories (section_id, title, icon, display_order)
SELECT s.id, 'Pint (Premium)', '🍻', 2
FROM menu_sections s WHERE s.type = 'beverages';

-- Wine category
INSERT INTO menu_categories (section_id, title, icon, display_order)
SELECT s.id, 'Wine', '🍷', 3
FROM menu_sections s WHERE s.type = 'beverages';

-- Vodka category
INSERT INTO menu_categories (section_id, title, icon, display_order)
SELECT s.id, 'Vodka', '🍸', 4
FROM menu_sections s WHERE s.type = 'beverages';

-- Rum category
INSERT INTO menu_categories (section_id, title, icon, display_order)
SELECT s.id, 'Rum', '🥃', 5
FROM menu_sections s WHERE s.type = 'beverages';

-- Whisky (Regular) category
INSERT INTO menu_categories (section_id, title, icon, display_order)
SELECT s.id, 'Whisky (Regular)', '🥃', 6
FROM menu_sections s WHERE s.type = 'beverages';

-- Whisky (Premium) category
INSERT INTO menu_categories (section_id, title, icon, display_order)
SELECT s.id, 'Whisky (Premium)', '🥃', 7
FROM menu_sections s WHERE s.type = 'beverages';

-- Brandy category
INSERT INTO menu_categories (section_id, title, icon, display_order)
SELECT s.id, 'Brandy', '🥃', 8
FROM menu_sections s WHERE s.type = 'beverages';

-- Gin category
INSERT INTO menu_categories (section_id, title, icon, display_order)
SELECT s.id, 'Gin', '🍸', 9
FROM menu_sections s WHERE s.type = 'beverages';

-- Tequila category
INSERT INTO menu_categories (section_id, title, icon, display_order)
SELECT s.id, 'Tequila', '🍹', 10
FROM menu_sections s WHERE s.type = 'beverages';

-- Liqueur category
INSERT INTO menu_categories (section_id, title, icon, display_order)
SELECT s.id, 'Liqueur', '🍹', 11
FROM menu_sections s WHERE s.type = 'beverages';

-- Cold Drinks category
INSERT INTO menu_categories (section_id, title, icon, display_order)
SELECT s.id, 'Cold Drinks', '🥤', 12
FROM menu_sections s WHERE s.type = 'beverages';

-- Cigarettes category
INSERT INTO menu_categories (section_id, title, icon, display_order)
SELECT s.id, 'Cigarettes', '🚬', 13
FROM menu_sections s WHERE s.type = 'beverages';

-- Now insert all the items with Hinjewadi bar pricing
-- Beer items (Regular pricing)
INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Budweiser Mild', 280, 'Smooth American-style pale lager', 1
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Beer';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Budweiser Magnum', 320, 'Bold & full-bodied with rich malt character', 2
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Beer';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Bizer Cranberry', 280, 'Fruit-infused refreshing brew', 3
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Beer';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Bizer Blackberry', 280, 'Sweet berry flavored brew', 4
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Beer';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Carlsberg', 300, 'Exceptionally smooth Scandinavian brew', 5
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Beer';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Carlsberg Can', 280, 'Scandinavian brew in convenient can', 6
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Beer';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Kingfisher', 250, 'India''s favorite crisp, refreshing lager', 7
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Beer';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Tuborg', 260, 'Danish heritage with robust flavor profile', 8
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Beer';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Tuborg Can', 240, 'Danish brew in convenient can', 9
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Beer';

-- Pint (Premium) items
INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Corona Extra 300ml', 450, 'Premium Mexican lager with lime', 1
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Pint (Premium)';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Hoegaarden 300ml', 480, 'Belgian witbier with citrus notes', 2
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Pint (Premium)';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Tuborg Strong 300ml', 280, 'Strong Danish lager', 3
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Pint (Premium)';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Budweiser King 300ml', 300, 'King of beers in pint size', 4
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Pint (Premium)';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Budweiser Magnum 300ml', 320, 'Strong magnum pint', 5
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Pint (Premium)';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Kingfisher Premium 300ml', 260, 'Premium Indian lager pint', 6
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Pint (Premium)';

-- Wine items (Premium pricing)
INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Fratelli Classic Shiraz', 450, 'Rich Indian red wine', 1
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Wine';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Fratelli Classic Merlot', 450, 'Smooth merlot from Fratelli', 2
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Wine';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Fratelli Classic Chenin', 420, 'Crisp white chenin blanc', 3
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Wine';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Fratelli Shiraz Rose', 440, 'Elegant rosé wine', 4
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Wine';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Sula Satori Merlot Red', 480, 'Premium Sula red wine', 5
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Wine';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Sula Cabernet Shiraz Red', 500, 'Bold Sula blend', 6
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Wine';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Sula Chenin Blanc White', 420, 'Refreshing white wine', 7
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Wine';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Sula Zinfandel Rose', 440, 'Light and fruity rosé', 8
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Wine';

-- Vodka items (Regular pricing)
INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Magic Moments Plain', '["₹80", "₹150", "₹210", "₹400"]'::jsonb, 'Triple-distilled smoothness', 1
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Vodka';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Magic Moments Apple', '["₹90", "₹170", "₹250", "₹480"]'::jsonb, 'Apple-infused vodka', 2
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Vodka';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Magic Moments Orange', '["₹90", "₹170", "₹250", "₹480"]'::jsonb, 'Orange-infused vodka', 3
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Vodka';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Romanov Vodka Plain', '["₹70", "₹130", "₹190", "₹360"]'::jsonb, 'Classic smooth vodka', 4
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Vodka';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Romanov Vodka Apple', '["₹80", "₹150", "₹220", "₹420"]'::jsonb, 'Apple-flavored vodka', 5
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Vodka';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Smirnoff', '["₹120", "₹220", "₹320", "₹600"]'::jsonb, 'World-renowned premium vodka', 6
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Vodka';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Smirnoff Orange', '["₹140", "₹260", "₹380", "₹720"]'::jsonb, 'Orange-infused Smirnoff', 7
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Vodka';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Smirnoff Mochi Mango', '["₹140", "₹260", "₹380", "₹720"]'::jsonb, 'Mango-flavored Smirnoff', 8
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Vodka';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Grey Goose', '["₹350", "₹650", "₹950", "₹1800"]'::jsonb, 'Ultra-premium French vodka', 9
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Vodka';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Absolut Raspberry Vodka', '["₹200", "₹380", "₹560", "₹1080"]'::jsonb, 'Swedish berry vodka', 10
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Vodka';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Absolut Vodka', '["₹180", "₹340", "₹500", "₹960"]'::jsonb, 'Premium Swedish vodka', 11
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Vodka';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Ketel One Vodka', '["₹250", "₹470", "₹690", "₹1320"]'::jsonb, 'Dutch craft vodka', 12
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Vodka';

-- Rum items
INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Bacardi Black', '["₹90", "₹170", "₹250", "₹480"]'::jsonb, 'Rich dark rum with oak notes', 1
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Rum';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Bacardi White', '["₹90", "₹170", "₹250", "₹480"]'::jsonb, 'Light and crisp white rum', 2
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Rum';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Bacardi Lemon', '["₹100", "₹190", "₹280", "₹540"]'::jsonb, 'Zesty citrus rum', 3
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Rum';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Bacardi Mango', '["₹100", "₹190", "₹280", "₹540"]'::jsonb, 'Tropical mango rum', 4
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Rum';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'McDowell''s Rum', '["₹70", "₹130", "₹190", "₹360"]'::jsonb, 'Smooth Caribbean-inspired blend', 5
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Rum';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Old Monk Rum', '["₹80", "₹150", "₹220", "₹420"]'::jsonb, 'Legendary 7-year aged dark rum', 6
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Rum';

-- Whisky (Regular) items
INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Antiquity', '["₹80", "₹150", "₹220", "₹420"]'::jsonb, 'Classic Indian whisky', 1
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'American Pride', '["₹70", "₹130", "₹190", "₹360"]'::jsonb, 'Smooth American-style whisky', 2
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Black Dog', '["₹130", "₹250", "₹370", "₹720"]'::jsonb, 'Triple gold matured whisky', 3
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Black Dog Gold', '["₹160", "₹300", "₹440", "₹840"]'::jsonb, 'Premium Black Dog', 4
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Blender''s Pride', '["₹100", "₹190", "₹280", "₹540"]'::jsonb, 'Premium blended whisky', 5
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Blender''s Pride Reserve', '["₹130", "₹250", "₹370", "₹720"]'::jsonb, 'Reserve collection whisky', 6
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'DSP Black', '["₹90", "₹170", "₹250", "₹480"]'::jsonb, 'Smooth dark spirit', 7
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Green Label', '["₹90", "₹170", "₹250", "₹480"]'::jsonb, 'Classic green whisky', 8
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Imperial Blue', '["₹80", "₹150", "₹220", "₹420"]'::jsonb, 'Smooth blend with oak & spice', 9
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'McDowell''s Whisky', '["₹70", "₹130", "₹190", "₹360"]'::jsonb, 'Popular Indian whisky', 10
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'McDowell''s Luxury', '["₹90", "₹170", "₹250", "₹480"]'::jsonb, 'Premium McDowell''s', 11
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Oak Smith Gold', '["₹110", "₹210", "₹310", "₹600"]'::jsonb, 'Japanese-inspired craft whisky', 12
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Oak Smith Silver', '["₹100", "₹190", "₹280", "₹540"]'::jsonb, 'Smooth silver edition', 13
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Oken Glow', '["₹80", "₹150", "₹220", "₹420"]'::jsonb, 'Mild smooth whisky', 14
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Red Label', '["₹140", "₹270", "₹400", "₹780"]'::jsonb, 'Johnnie Walker Red', 15
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Rock Ford Reserve', '["₹120", "₹230", "₹340", "₹660"]'::jsonb, 'Aged reserve whisky', 16
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Rock Ford Classic', '["₹100", "₹190", "₹280", "₹540"]'::jsonb, 'Classic blend whisky', 17
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Royal Stag', '["₹90", "₹170", "₹250", "₹480"]'::jsonb, 'Popular premium whisky', 18
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Royal Stag Barrel', '["₹110", "₹210", "₹310", "₹600"]'::jsonb, 'Barrel-aged Royal Stag', 19
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Signature', '["₹110", "₹210", "₹310", "₹600"]'::jsonb, 'Smooth signature blend', 20
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Signature Premier', '["₹140", "₹270", "₹400", "₹780"]'::jsonb, 'Premier signature whisky', 21
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Teachers Highland', '["₹140", "₹270", "₹400", "₹780"]'::jsonb, 'Highland Scotch whisky', 22
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Teachers 50', '["₹120", "₹230", "₹340", "₹660"]'::jsonb, 'Special Teachers blend', 23
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Vat 69', '["₹130", "₹250", "₹370", "₹720"]'::jsonb, 'Classic Scotch blend', 24
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, '100 Pipers', '["₹150", "₹290", "₹430", "₹840"]'::jsonb, 'Blended Scotch whisky', 25
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Royal Challenge', '["₹100", "₹190", "₹280", "₹540"]'::jsonb, 'Premium grain whisky', 26
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Regular)';

-- Whisky (Premium) items
INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Monkey Shoulder', '["₹280", "₹540", "₹800", "₹1560"]'::jsonb, 'Triple malt Scotch whisky', 1
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'JW Black Label Scotch', '["₹300", "₹580", "₹860", "₹1680"]'::jsonb, 'Johnnie Walker Black Label', 2
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'JW Red Label Scotch', '["₹200", "₹380", "₹560", "₹1080"]'::jsonb, 'Johnnie Walker Red Label', 3
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'JW Double Black QRT', '["₹350", "₹680", "₹1010", "₹1980"]'::jsonb, 'Johnnie Walker Double Black', 4
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Chivas Regal Scotch', '["₹320", "₹620", "₹920", "₹1800"]'::jsonb, 'Premium blended Scotch', 5
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Black & White', '["₹160", "₹300", "₹440", "₹840"]'::jsonb, 'Smoky Highland character', 6
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Teachers Highland Cream', '["₹180", "₹340", "₹500", "₹960"]'::jsonb, 'Creamy Highland whisky', 7
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Ballantines', '["₹170", "₹320", "₹470", "₹900"]'::jsonb, 'Scottish blend whisky', 8
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Dewars White Label', '["₹180", "₹340", "₹500", "₹960"]'::jsonb, 'Smooth Highland whisky', 9
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Black Dog Cent', '["₹170", "₹320", "₹470", "₹900"]'::jsonb, 'Centenary blend', 10
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Black Dog Scotch', '["₹200", "₹380", "₹560", "₹1080"]'::jsonb, 'Premium Scotch blend', 11
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Jack Daniel''s', '["₹280", "₹540", "₹800", "₹1560"]'::jsonb, 'Tennessee whiskey', 12
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Jim Beam Bourbon Scotch', '["₹200", "₹380", "₹560", "₹1080"]'::jsonb, 'Kentucky straight bourbon', 13
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Bushmills Original Irish', '["₹220", "₹420", "₹620", "₹1200"]'::jsonb, 'Classic Irish whiskey', 14
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Jameson Irish', '["₹240", "₹460", "₹680", "₹1320"]'::jsonb, 'Triple-distilled Irish whiskey', 15
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Glenfiddich SP 12yr Scotch', '["₹400", "₹780", "₹1160", "₹2280"]'::jsonb, 'Single malt 12 year', 16
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Glenlivet 12yr Scotch', '["₹380", "₹740", "₹1100", "₹2160"]'::jsonb, 'Single malt 12 year', 17
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Talisker 10Yrs', '["₹420", "₹820", "₹1220", "₹2400"]'::jsonb, 'Isle of Skye single malt', 18
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Whisky (Premium)';

-- Brandy items
INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Mansion House French', '["₹80", "₹150", "₹220", "₹420"]'::jsonb, 'French-style brandy', 1
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Brandy';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Honey Bee', '["₹70", "₹130", "₹190", "₹360"]'::jsonb, 'Sweet honey brandy', 2
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Brandy';

-- Gin items
INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Bombay Sapphire', '["₹200", "₹380", "₹560", "₹1080"]'::jsonb, 'Premium London dry gin', 1
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Gin';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Beefeater', '["₹180", "₹340", "₹500", "₹960"]'::jsonb, 'Classic London dry gin', 2
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Gin';

-- Tequila items
INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Camino Real', '["₹150", "₹290", "₹430", "₹840"]'::jsonb, 'Authentic Mexican tequila', 1
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Tequila';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Camino Gold', '["₹170", "₹320", "₹470", "₹900"]'::jsonb, 'Gold tequila', 2
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Tequila';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Desmondji 51', '["₹140", "₹270", "₹400", "₹780"]'::jsonb, 'Premium tequila', 3
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Tequila';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Vino Sambuca 700', '["₹180", "₹340", "₹500", "₹960"]'::jsonb, 'Italian anise liqueur', 4
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Tequila';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Jagermeister', '["₹200", "₹380", "₹560", "₹1080"]'::jsonb, 'German herbal liqueur', 5
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Tequila';

-- Liqueur items
INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Kahlua Liquor', '["₹200", "₹380", "₹560", "₹1080"]'::jsonb, 'Coffee liqueur', 1
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Liqueur';

INSERT INTO menu_items (category_id, name, sizes, description, display_order)
SELECT c.id, 'Baileys Irish Cream', '["₹220", "₹420", "₹620", "₹1200"]'::jsonb, 'Creamy Irish liqueur', 2
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Liqueur';

-- Cold Drinks items
INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Mineral Water', 30, 'Purified mineral water', 1
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cold Drinks';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Mineral Water 500ml', 50, 'Premium packaged water', 2
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cold Drinks';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Aquafina', 40, 'Purified drinking water', 3
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cold Drinks';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Aquafina 500ml', 60, 'Premium Aquafina', 4
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cold Drinks';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Sprite 250ml', 50, 'Lemon-lime refreshment', 5
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cold Drinks';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Sprite 600ml', 80, 'Large Sprite', 6
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cold Drinks';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Thums Up 250ml', 50, 'Bold cola taste', 7
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cold Drinks';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Thums Up 600ml', 80, 'Large Thums Up', 8
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cold Drinks';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Soda', 40, 'Plain soda water', 9
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cold Drinks';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Red Bull', 180, 'Energy drink', 10
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cold Drinks';

-- Cigarettes items
INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Classic Mild', 20, 'Mild cigarette', 1
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cigarettes';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Gold Flake King', 22, 'King size cigarette', 2
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cigarettes';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Gold Flake Light', 20, 'Light cigarette', 3
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cigarettes';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Ice Burst', 25, 'Menthol cigarette', 4
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cigarettes';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Indie Mint', 22, 'Mint flavored cigarette', 5
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cigarettes';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Marlboro Light', 30, 'Premium light cigarette', 6
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cigarettes';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Marlboro Advance', 32, 'Premium advance cigarette', 7
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cigarettes';

INSERT INTO menu_items (category_id, name, price, description, display_order)
SELECT c.id, 'Marlboro Clove Mix', 35, 'Clove mix cigarette', 8
FROM menu_categories c JOIN menu_sections s ON c.section_id = s.id 
WHERE s.type = 'beverages' AND c.title = 'Cigarettes';