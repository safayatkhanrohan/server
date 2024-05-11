const products = [
        {
          "name": "iPhone 12",
          "price": 999.99,
          "description": "The latest iPhone model",
          "rating": 4.5,
          "image": [
            {
              "public_id": "123456",
              "url": "https://res.cloudinary.com/dghzuk2uk/image/upload/v1709413845/Mern%20ecommerce/apple-iphone-12-r1_dtpdoa.jpg"
            }
          ],
          "category": "Electronics",
          "seller": "Apple",
          "countInStock": 10,
          "numReviews": 50,
          "reviews": [
            {"name": "John", "rating": 4, "comment": "Great phone!"},
            {"name": "Jane", "rating": 5, "comment": "Best phone ever!"}
          ]
        },
        {
          "name": "MacBook Pro",
          "price": 1999.99,
          "description": "Powerful laptop for professionals",
          "rating": 4.8,
          "image": [
            {
              "public_id": "789012",
              "url": "https://res.cloudinary.com/dghzuk2uk/image/upload/v1709413845/Mern%20ecommerce/apple-iphone-12-r1_dtpdoa.jpg"
            }
          ],
          "category": "Laptops",
          "seller": "Apple",
          "countInStock": 5,
          "numReviews": 30,
          "reviews": [
            {"name": "Mike", "rating": 4.5, "comment": "Excellent laptop!"},
            {"name": "Sarah", "rating": 4.2, "comment": "Great for coding!"}
          ]
        },
        {
          "name": "Samsung Galaxy S21",
          "price": 899.99,
          "description": "Feature-packed Android smartphone",
          "rating": 4.7,
          "image": [
            {
              "public_id": "345678",
              "url": "https://res.cloudinary.com/dghzuk2uk/image/upload/v1709413845/Mern%20ecommerce/apple-iphone-12-r1_dtpdoa.jpg
            }
          ],
          "category": "Electronics",
          "seller": "Samsung",
          "countInStock": 15,
          "numReviews": 40,
          "reviews": [
            {"name": "David", "rating": 4.8, "comment": "Awesome camera quality!"},
            {"name": "Lisa", "rating": 4.5, "comment": "Sleek design."}
          ]
        },
        {
          "name": "Dell XPS 13",
          "price": 1299.99,
          "description": "Ultra-thin and powerful laptop",
          "rating": 4.9,
          "image": [
            {
              "public_id": "567890",
              "url": "https://res.cloudinary.com/dghzuk2uk/image/upload/v1709413845/Mern%20ecommerce/apple-iphone-12-r1_dtpdoa.jpg"
            }
          ],
          "category": "Laptops",
          "seller": "Dell",
          "countInStock": 8,
          "numReviews": 25,
          "reviews": [
            {"name": "Chris", "rating": 5, "comment": "Amazing performance!"},
            {"name": "Emily", "rating": 4.7, "comment": "Perfect for productivity."}
          ]
        },
        {
          "name": "Sony Bravia 4K TV",
          "price": 1499.99,
          "description": "Immersive home entertainment experience",
          "rating": 4.6,
          "image": [
            {
              "public_id": "123789",
              "url": "https://res.cloudinary.com/dghzuk2uk/image/upload/v1709413845/Mern%20ecommerce/apple-iphone-12-r1_dtpdoa.jpg"
            }
          ],
          "category": "Electronics",
          "seller": "Sony",
          "countInStock": 12,
          "numReviews": 35,
          "reviews": [
            {"name": "Michael", "rating": 4.5, "comment": "Crystal-clear picture quality!"},
            {"name": "Olivia", "rating": 4.8, "comment": "Great for movie nights."}
          ]
        },
        {
          "name": "HP Spectre x360",
          "price": 1299.99,
          "description": "Convertible laptop with stunning design",
          "rating": 4.7,
          "image": [
            {
              "public_id": "890123",
              "url": "https://res.cloudinary.com/dghzuk2uk/image/upload/v1709413845/Mern%20ecommerce/apple-iphone-12-r1_dtpdoa.jpg"
            }
          ],
          "category": "Laptops",
          "seller": "HP",
          "countInStock": 10,
          "numReviews": 28,
          "reviews": [
            {"name": "Ryan", "rating": 4.6, "comment": "Sleek and powerful!"},
            {"name": "Sophie", "rating": 4.5, "comment": "Versatile and stylish."}
          ]
        }
];
module.exports = products;
