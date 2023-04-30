const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '6054072384:AAE9Ffn3np_0kf_U0HQG8lQ4yPugc1nQ7mY';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Create a simple inventory for the store
const inventory = {
  'apple': {
    name: 'Apple',
    price: 0.50,
    stock: 10
  },
  'banana': {
    name: 'Banana',
    price: 0.25,
    stock: 5
  },
  'orange': {
    name: 'Orange',
    price: 0.75,
    stock: 3
  }
};

console.log(inventory);
// Keep track of the total amount of purchased items
let totalAmount = 0;
let delivery_charges = 0;

let cart = {};
console.log(inventory['apple']);
// Listen for incoming messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // If the message is "/start", send a welcome message
  if (msg.text.toString().toLowerCase() === '/start') {
    bot.sendMessage(chatId, `Welcome to our store! Here's what we have in stock:\n\n${listInventory()}\nTo purchase an item, type /buy <item>`);
  }

  // If the message is "/buy", process the purchase
  if (msg.text.toString().toLowerCase().startsWith('/buy ')) {
    const item = msg.text.toString().toLowerCase().substring(5);
    console.log(item);
    if (!inventory[item]) {
      bot.sendMessage(chatId, `Sorry, we don't have "${item}" in stock. Here's what we have:\n\n${listInventory()}`);
    } 

    else if (inventory[item].stock <= 0) {
      bot.sendMessage(chatId, `Sorry, we're out of "${item}"! Here's what we have:\n\n${listInventory()}`);
    }

     else {
      inventory[item].stock--;

      const itemPrice = inventory[item].price;

      totalAmount += itemPrice;
      if(item in cart){
        console.log("Yes");
        cart[item].stock = cart[item].stock+1;
        cart[item].price = cart[item].stock*(inventory[item].price);
        console.log(cart);
      }
      else{
        console.log("No");
      cart[item] = {
        name: inventory[item].name,
        price: inventory[item].price,
        stock: 1
      };
    }

      bot.sendMessage(chatId, `You bought a ${inventory[item].name} for ${itemPrice}! Thanks for shopping with us. Your total amount is now ${totalAmount.toFixed(2)}\n to choose your delivery type write /delivery`);
      
    
  }
}
  
  if(msg.text.toString().toLowerCase() === '/placeorder'){
    bot.sendMessage(chatId, `Here's what you ordered have:\n\n${listCart()} \n\nto confirm your order please write /confirm to confirm your order`);
  }
  if(msg.text.toString().toLowerCase() === '/confirm'){
    cart = {};

    const chatId = '9133932008';

    const message = `Your order has been confirmed please pay ${totalAmount} to the delivery agent`;

// send the message
    bot.sendMessage(chatId, message);
   // bot.sendMessage(chatId, 'Thank you, your order has been placed sucessfully');
  }
  if(msg.text.toString().toLowerCase() === '/delivery'){
      bot.sendMessage(chatId, 'Choose your delivery type:\n 1. Normal - 0\n2. Fast - 50\n3. One day delivery - 100\n');
  }
  if(msg.text.toString().toLowerCase() === '1'){
    delivery_charges = 0;
    bot.sendMessage(chatId, 'write /placeorder to place your order');

  }
  if(msg.text.toString().toLowerCase() ==='2'){
    delivery_charges = 50;
    totalAmount += 50;
     bot.sendMessage(chatId, 'write /placeorder to place your order');
  }
  if(msg.text.toString().toLowerCase() === '3'){
    delivery_charges = 100;
    totalAmount += 100;
     bot.sendMessage(chatId, 'write /placeorder to place your order');
  }
  if(msg.text.toString().toLowerCase() === '/help'){
    bot.sendMessage(chatId, '/buy <item> --> to buy an item\n\n/start --> to start ordering\n\n/delivery --> to choose delivery type\n\n/placeorder --> to place the order\n\n/confirm --> to confirm the order\n\n');
  }


});

// Helper function to list the store's inventory
function listInventory() {
  let inventoryList = '';

  for (const item in inventory) {
    if (inventory.hasOwnProperty(item)) {
      inventoryList += `${inventory[item].name} - ${inventory[item].price} (${inventory[item].stock} in stock)\n`;
    }
  }

  return inventoryList;
}
function listCart() {
  let cartList = '\n';
  if(Object.keys(cart).length === 0){
    return "Your cart is empty!";
  }
  else{
  for (const item in cart) {
    if (cart.hasOwnProperty(item)) {
      cartList += `${cart[item].name}(${cart[item].stock}) - ${cart[item].price} \n`;
    }
  }
  cartList +=`delivery charges : ${delivery_charges}\n\n`;
  cartList += `Total amount : ${totalAmount}\n`;

  return cartList;
}
}

