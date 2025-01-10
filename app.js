
document.addEventListener('alpine:init', () => {
  // Alpine Data untuk Produk
  Alpine.data('products', () => ({
    items: [
      { id: 1, name: 'Espresso', img: '1.jpg', price: 22000, rating: 0,avgRating:0 },
      { id: 2, name: 'Americano', img: '2.jpg', price: 22000, rating: 0,avgRating:0 },
      { id: 3, name: 'Long Black', img: '3.jpg', price: 25000, rating: 0,avgRating:0 },
      { id: 4, name: 'Caffela', img: '4.jpg', price: 25000, rating: 0,avgRating:0 },
      { id: 5, name: 'Mochaccino', img: '5.jpg', price: 28000, rating: 0,avgRating:0 },
      { id: 6, name: 'Brownella', img: '6.jpg', price: 28000, rating: 0,avgRating:0 },
      { id: 7, name: 'Sweet Choco', img: '7.jpg', price: 25000, rating: 0,avgRating:0 },
      { id: 8, name: 'Hazelnutella', img: '8.jpg', price: 28000, rating: 0,avgRating:0 },
    ],
    
    async fetchAndUpdateRatings() {
      try {
        const response = await fetch('data.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
    
        const data = await response.json();
    
        // Update ratings based on fetched data
        this.items.forEach(fetchedItem => {
          const item = data.filter(product => product.id === fetchedItem.id);
          //console.log(item)
          if(item.length>0){
            
            let avgRatingItem = item.reduce(((total,currentItem)=>total+currentItem.rating),0);
            //console.log(avgRatingItem);
            fetchedItem.avgRating= avgRatingItem;
            
          }
        });
    
        console.log('Updated items:', this.items);
      } catch (error) {
        console.error('Error fetching and updating ratings:', error);
      }
    },

    // Fungsi untuk memberikan rating pada produk yang sudah dibeli
    

    // // Fungsi untuk menghandle proses checkout
    // checkout() {
    //   this.$store.cart.items.forEach(item => {
    //     item.rating = 0;  // Reset rating saat checkout
    //   });
    //   this.$store.cart.checkoutComplete = true; // Tandai checkout selesai
    // },
  }));

  // Alpine Store untuk Cart
  Alpine.store('cart', {
    items: [],
    total: 0,
    quantity: 0,
    
    checkoutComplete: false,  // Status checkout
    
    add(newItem) {
      const cartItem = this.items.find((item) => item.id === newItem.id);

      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) {
            return item;
          } else {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },

    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);

      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else {
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },

    deleteAll() {
      
      this.quantity = 0;
      this.total = 0;
      const shoppingCart = document.querySelector('.shopping-cart');
      shoppingCart.classList.remove('active');
      

      this.checkoutComplete = true; // Tandai checkout selesai
      //this.items = [];
    },
    rateCheckoutProduct(index, rating) {
      //this.items.push({id:index+1,rating:rating}) // Simpan rating pada produk
      this.items[index].rating = rating
    },
    //submit rating ketika checkout
    submitRating(){
      //console.log(this.items);
      let tempData = [];
      this.items.forEach((current, index) => {
        let data = {
          id:current.id,
          name:current.name,
          rating:current.rating
        }
        tempData.push(data);
      });
      sendData(tempData);
      this.items = []
    }
    
  });
});



// Konversi ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
  }).format(number);
};


document.addEventListener("DOMContentLoaded", function () {
  // Data untuk tiap chart
  const caffeineData = {
      labels: ["Espresso", "Long Black", "Americano", "Caffela", "Mochaccino"],
      datasets: [{
          label: "Caffeine (mg)",
          data: [294, 188, 173, 170, 134],
          backgroundColor: "rgba(75, 192, 192, 0.8)",
      }],
  };

  const caloriesData = {
      labels: ["Brownella", "Sweet Choco", "Hazelnutella", "Mochaccino", "Caffela"],
      datasets: [{
          label: "Calories (kcal)",
          data: [350, 350, 280, 250, 200],
          backgroundColor: "rgba(255, 99, 132, 0.8)",
      }],
  };

  const sugarData = {
      labels: ["Brownella", "Sweet Choco", "Hazelnutella", "Mochaccino", "Caffela"],
      datasets: [{
          label: "Sugar (g)",
          data: [90, 90, 45, 40, 30],
          backgroundColor: "rgba(255, 206, 86, 0.8)",
      }],
  };

  // Konfigurasi Chart.js
  const config = (data, label) => ({
      type: "bar",
      data: data,
      options: {
          indexAxis: "y", // Horizontal bar chart
          responsive: true,
          plugins: {
              legend: {
                  display: false, // Sembunyikan legenda
              },
          },
          scales: {
              x: {
                  beginAtZero: true,
                  title: {
                      display: true,
                      text: label,
                      color: "white",
                  },
                  ticks: {
                      color: "white",
                  },
                  grid: {
                      color: "rgba(255, 255, 255, 0.2)",
                  },
              },
              y: {
                  ticks: {
                      color: "white",
                      font: {
                          size: 14,
                      },
                  },
                  grid: {
                      color: "rgba(255, 255, 255, 0.2)",
                  },
              },
          },
      },
  });

  // Inisialisasi Chart.js
  new Chart(document.getElementById("caffeineChart").getContext("2d"), config(caffeineData, "Caffeine (mg)"));
  new Chart(document.getElementById("caloriesChart").getContext("2d"), config(caloriesData, "Calories (kcal)"));
  new Chart(document.getElementById("sugarChart").getContext("2d"), config(sugarData, "Sugar (g)"));
});


async function sendData(newData) {
  try {
    const response = await fetch('http://localhost:3000/update-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });

    if (!response.ok) {
      throw new Error('Failed to update data');
    }

    console.log('Data successfully updated');
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

