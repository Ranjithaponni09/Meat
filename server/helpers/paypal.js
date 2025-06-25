const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AdGjt9xMGhq4lFNUkZQVtlhW0r2oPhvIoFv4ywU159_On6I3UY6QQZu9rcocugLfz5t5OxNCQaUyV95w",
  client_secret: "EIO9ZfrXxWlft5gBEK_hDwv7pjG4NTRK3d63r_aiJS0haMLybvKqRzs6YsepadnU5XXY2JFmJSa3RD5X",
});

module.exports = paypal;
