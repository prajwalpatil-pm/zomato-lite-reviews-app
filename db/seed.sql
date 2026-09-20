-- Four restaurants, each with a few reviews spaced a few days apart so that
-- "the latest review" is meaningful and the averages differ (green vs amber).
-- Photos are hotlinked from the Unsplash CDN.

INSERT INTO restaurants (name, cuisine, area, image_url) VALUES
  ('Ludhiana Burrito',         'Indian',       'Sector 32', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&q=80'),
  ('Amritsari Kulcha Express', 'North Indian', 'Sector 35', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop&q=80'),
  ('Tandoori Nights',          'Mughlai',      'Sector 22', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&q=80'),
  ('Punjabi Tadka',            'Punjabi',      'Sector 17', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop&q=80');

-- Ludhiana Burrito (avg 4.3)
INSERT INTO reviews (restaurant_id, rating, comment, created_at) VALUES
  (1, 5, 'Paneer burrito is unreal',   NOW() - INTERVAL '8 days'),
  (1, 4, 'Good, but slow service',     NOW() - INTERVAL '6 days'),
  (1, 4, 'Solid. Would repeat.',       NOW() - INTERVAL '2 days');

-- Amritsari Kulcha Express (avg 4.8)
INSERT INTO reviews (restaurant_id, rating, comment, created_at) VALUES
  (2, 5, 'Best kulcha in the tricity, hands down.', NOW() - INTERVAL '10 days'),
  (2, 5, 'Crispy, buttery, and the chole is perfect.', NOW() - INTERVAL '7 days'),
  (2, 4, 'Great taste, but small seating area.', NOW() - INTERVAL '5 days'),
  (2, 5, 'The amritsari special was outstanding.', NOW() - INTERVAL '3 days'),
  (2, 5, 'Worth the wait every single time.', NOW() - INTERVAL '1 days');

-- Tandoori Nights (avg 3.5 - amber)
INSERT INTO reviews (restaurant_id, rating, comment, created_at) VALUES
  (3, 4, 'Smoky tandoori chicken, really loved it.', NOW() - INTERVAL '9 days'),
  (3, 3, 'Decent, but a bit too oily for me.', NOW() - INTERVAL '6 days'),
  (3, 4, 'Good portions for the price.', NOW() - INTERVAL '4 days'),
  (3, 3, 'Service was slow on the weekend.', NOW() - INTERVAL '2 days');

-- Punjabi Tadka (avg 4.3)
INSERT INTO reviews (restaurant_id, rating, comment, created_at) VALUES
  (4, 4, 'Homely dal makhani, very comforting.', NOW() - INTERVAL '7 days'),
  (4, 5, 'Butter chicken here is top notch.', NOW() - INTERVAL '5 days'),
  (4, 4, 'Fresh rotis and generous ghee.', NOW() - INTERVAL '3 days'),
  (4, 4, 'Reliable and consistently tasty.', NOW() - INTERVAL '1 days');
