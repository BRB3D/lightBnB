/*------------ ROWS FROM users ------------*/
INSERT INTO users (name, email, password)
VALUES ('Timothy', 'tim@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
 ('Timothy', 'tim@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Timothy', 'tim@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

/*------------ ROWS FROM properties ----------------*/
INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, 'Casa Blanca', 'Lovley place', 'http---', 'http://---', 35, 2, 1, 3, 'Canada', 'Young', 'Toronto', 'Ontario', 'l3x 1c8'),
(2, 'Casa Azul', 'Glisening place', 'http---', 'http://---', 15, 1, 2, 5, 'Canada', 'Shepard', 'Toronto', 'Ontario', 'l6x 5c8'),
(3, 'Casa Green', 'Creepy House', 'http---', 'http://---', 5, 1, 1, 6, 'Canada', 'Union', 'Toronto', 'Ontario', 'm2n 1z8');

/*------------------ ROWS FROM reservations -----------*/
INSERT INTO reservations (start_date, end_date, guest_id, property_id)
VALUES ('2018-01-11', '2018-01-15', 1, 1), 
('2018-05-09', '2018-01-10', 2, 2), 
('2018-09-22', '2018-09-28', 3, 3);


/*------------------ ROWS FROM property_reviews -------------*/
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 2, 1, 5, 'message'),
(2, 3, 2, 7, 'message'),
(3, 1, 3, 1, 'message');