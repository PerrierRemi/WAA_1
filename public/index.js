'use strict';

//list of cars
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const cars = [{
  'id': 'a9c1b91b-5e3d-4cec-a3cb-ef7eebb4892e',
  'name': 'fiat-500-x',
  'pricePerDay': 36,
  'pricePerKm': 0.10
}, {
  'id': '697a943f-89f5-4a81-914d-ecefaa7784ed',
  'name': 'mercedes-class-a',
  'pricePerDay': 44,
  'pricePerKm': 0.30
}, {
  'id': '4afcc3a2-bbf4-44e8-b739-0179a6cd8b7d',
  'name': 'bmw-x1',
  'pricePerDay': 52,
  'pricePerKm': 0.45
}];

//list of current rentals
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful for step 4
const rentals = [{
  'id': '893a04a3-e447-41fe-beec-9a6bfff6fdb4',
  'driver': {
    'firstName': 'Roman',
    'lastName': 'Frayssinet'
  },
  'carId': 'a9c1b91b-5e3d-4cec-a3cb-ef7eebb4892e',
  'pickupDate': '2020-01-02',
  'returnDate': '2020-01-02',
  'distance': 100,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}, {
  'id': 'bc16add4-9b1d-416c-b6e8-2d5103cade80',
  'driver': {
    'firstName': 'Redouane',
    'lastName': 'Bougheraba'
  },
  'carId': '697a943f-89f5-4a81-914d-ecefaa7784ed',
  'pickupDate': '2020-01-05',
  'returnDate': '2020-01-09',
  'distance': 300,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}, {
  'id': '8c1789c0-8e6a-48e3-8ee5-a6d4da682f2a',
  'driver': {
    'firstName': 'Fadily',
    'lastName': 'Camara'
  },
  'carId': '4afcc3a2-bbf4-44e8-b739-0179a6cd8b7d',
  'pickupDate': '2019-12-01',
  'returnDate': '2019-12-15',
  'distance': 1000,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'rentalId': '893a04a3-e447-41fe-beec-9a6bfff6fdb4',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'rentalId': 'bc16add4-9b1d-416c-b6e8-2d5103cade80',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'rentalId': '8c1789c0-8e6a-48e3-8ee5-a6d4da682f2a',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}];

// STEP 1

// Input: Rental
// output: Location duration in days
function locationDuration(location)
{
  var start = Date.parse(location.pickupDate)
  var end = Date.parse(location.returnDate)
  // ms
  var diff = end - start
  var days = diff / (24 * 60 * 60 * 1000 )
  // If the location start and finish the same day it's still count as a whole day
  days = Math.round(days + 1)
  return days
}

// Compute price for evrey rental in rentals
function calculatePrice()
{
  for(var rental of rentals)
  {
    // For each rental we search the car use
    for(var car of cars)
    {
      // It's the car use !
      if(rental.carId == car.id)
      {
        // Compute price and update rentals
        rental.price = locationDuration(rental)*car.pricePerDay + rental.distance*car.pricePerKm
      }
    }
  }
}

// STEP 2

// Apply reduction for longer rentals
function applyReduction()
{
  for(var rental of rentals)
  {
    var duration = locationDuration(rental)
    // 10% for location of 2, 3 or 4 days
    if(duration >= 2 && duration <= 4)
    {
      rental.price *= 0.9
    }
    // 30% for location of 5-10 days included.
    else if (duration >= 5 && duration <= 10)
    {
      rental.price *= 0.7
    }
    // 50% for a location of 11 or more days.
    else
    {
      rental.price *= 0.5
    }
  }
}

// STEP 3 

// Compute actors' commission
function payCommission()
{
  for(var rental of rentals)
  {
    // Commission is set to 30% of price
    var commission = 0.3*rental.price 
    // Half of commission go to the insurance
    rental.commission.insurance = + ( 0.5*commission ).toFixed(2)
    // The treasury get 1€ by location day
    rental.commission.treasury = locationDuration(rental)
    // Virtuo get all rest
    rental.commission.virtuo = + ( commission - rental.commission.insurance - rental.commission.treasury ).toFixed(2)
  }
}

// STEP 4 

// Add deductible option to price and virtuo commission
function addDeductibleOption()
{
  for(var rental of rentals)
  {
    if(rental.options.deductibleReduction)
    {
      // This option cost 4€/day
      var option_cost = 4 * locationDuration(rental)
      // Location price goes up
      rental.price += option_cost
      // The additional charge goes to Virtuo
      // We add it to the commission that goes to Virtuo
      rental.commission.virtuo += option_cost 
    }
  }
}


// MAIN

// /!\ Call order is really important !!

// Compute price
calculatePrice()
// Apply reductions for longer rentals
applyReduction()
// Compute commission
payCommission()
// Add options
addDeductibleOption()

// Display lists
console.log(cars);
console.log(rentals);
console.log(actors);
