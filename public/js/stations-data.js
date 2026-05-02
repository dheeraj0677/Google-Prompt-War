/**
 * ElectBot — Mock Polling Stations Data (Pan-India)
 * Contains ~150 simulated polling stations across all major Indian states.
 */

const stations = [
  // MAHARASHTRA
  { name: "Town Hall Polling Center", area: "Mumbai", address: "Fort, Mumbai, Maharashtra 400001", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 18.9322, lng: 72.8464 },
  { name: "Shivaji Park School", area: "Mumbai", address: "Dadar West, Mumbai 400028", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 19.0267, lng: 72.8350 },
  { name: "Pune University Booth", area: "Pune", address: "Ganeshkhind, Pune 411007", hours: "7:00 AM – 6:00 PM", type: "early", accessible: true, lat: 18.5510, lng: 73.8235 },
  { name: "Nagpur Municipal School", area: "Nagpur", address: "Civil Lines, Nagpur 440001", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 21.1458, lng: 79.0882 },

  // DELHI
  { name: "Govt. Sr. Secondary School", area: "New Delhi", address: "Barakhamba Rd, New Delhi 110001", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 28.6315, lng: 77.2167 },
  { name: "DDU Marg Community Hall", area: "ITO", address: "DDU Marg, New Delhi 110002", hours: "7:00 AM – 6:00 PM", type: "early", accessible: true, lat: 28.6340, lng: 77.2380 },

  // KARNATAKA
  { name: "Central Library Booth", area: "Bengaluru", address: "Cubbon Park, Bengaluru 560001", hours: "8:00 AM – 5:00 PM", type: "early", accessible: true, lat: 12.9763, lng: 77.5929 },
  { name: "Mysuru Palace Gate School", area: "Mysuru", address: "Agrahara, Mysuru 570004", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 12.3051, lng: 76.6552 },

  // TAMIL NADU
  { name: "Ripon Building Office", area: "Chennai", address: "Park Town, Chennai 600003", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: false, lat: 13.0827, lng: 80.2507 },
  { name: "Madurai Meenakshi High", area: "Madurai", address: "South Masi St, Madurai 625001", hours: "7:00 AM – 6:00 PM", type: "early", accessible: true, lat: 9.9195, lng: 78.1193 },

  // WEST BENGAL
  { name: "Victoria Memorial School", area: "Kolkata", address: "Queens Way, Kolkata 700071", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 22.5448, lng: 88.3425 },
  { name: "Howrah Station Primary", area: "Howrah", address: "Station Rd, Howrah 711101", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 22.5850, lng: 88.3410 },

  // GUJARAT
  { name: "Navrangpura Office", area: "Ahmedabad", address: "Navrangpura, Ahmedabad 380009", hours: "8:00 AM – 5:00 PM", type: "early", accessible: true, lat: 23.0338, lng: 72.5666 },
  { name: "Sabarmati Ashram School", area: "Ahmedabad", address: "Sabarmati, Ahmedabad 380027", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 23.0600, lng: 72.5800 },

  // TELANGANA
  { name: "Banjara Hills School", area: "Hyderabad", address: "Road No 12, Hyderabad 500034", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: false, lat: 17.4156, lng: 78.4347 },
  { name: "Charminar Govt School", area: "Hyderabad", address: "Pathergatti, Hyderabad 500002", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 17.3616, lng: 78.4747 },

  // RAJASTHAN
  { name: "Hawa Mahal Primary", area: "Jaipur", address: "Badi Chaupar, Jaipur 302002", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 26.9239, lng: 75.8267 },
  { name: "Jodhpur Fort School", area: "Jodhpur", address: "Fort Rd, Jodhpur 342001", hours: "7:00 AM – 6:00 PM", type: "early", accessible: true, lat: 26.2981, lng: 73.0189 },

  // UTTAR PRADESH
  { name: "Hazratganj P.O.", area: "Lucknow", address: "Hazratganj, Lucknow 226001", hours: "8:00 AM – 5:00 PM", type: "early", accessible: true, lat: 26.8467, lng: 80.9462 },
  { name: "Assi Ghat Primary", area: "Varanasi", address: "Assi Rd, Varanasi 221005", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 25.2897, lng: 83.0068 },
  { name: "Noida Sector 18 Booth", area: "Noida", address: "Sector 18, Noida 201301", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 28.5670, lng: 77.3210 },

  // KERALA
  { name: "Secretariat High School", area: "Thiruvananthapuram", address: "Statue Junction, TVM 695001", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 8.4912, lng: 76.9497 },
  { name: "Marine Drive Booth", area: "Kochi", address: "MG Road, Kochi 682011", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 9.9760, lng: 76.2760 },

  // PUNJAB / HARYANA
  { name: "Sector 17 Center", area: "Chandigarh", address: "Sector 17, Chandigarh 160017", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 30.7333, lng: 76.7794 },
  { name: "Golden Temple Primary", area: "Amritsar", address: "Heritage St, Amritsar 143006", hours: "7:00 AM – 6:00 PM", type: "early", accessible: true, lat: 31.6199, lng: 74.8765 },

  // MADHYA PRADESH
  { name: "Bhopal Lake School", area: "Bhopal", address: "Shyamla Hills, Bhopal 462002", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 23.2500, lng: 77.3900 },
  { name: "Indore Rajwada Booth", area: "Indore", address: "Rajwada, Indore 452001", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 22.7196, lng: 75.8577 },

  // ASSAM / NORTH EAST
  { name: "Dispur Govt Center", area: "Guwahati", address: "Dispur, Guwahati 781006", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 26.1433, lng: 91.7898 },
  { name: "Police Bazar Booth", area: "Shillong", address: "Police Bazar, Shillong 793001", hours: "7:00 AM – 6:00 PM", type: "early", accessible: true, lat: 25.5788, lng: 91.8831 },

  // ODISHA
  { name: "Temple City School", area: "Bhubaneswar", address: "Old Town, BBSR 751002", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 20.2444, lng: 85.8437 },

  // BIHAR
  { name: "Patna Junction Primary", area: "Patna", address: "Fraser Rd, Patna 800001", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 25.6127, lng: 85.1376 },

  // JAMMU & KASHMIR
  { name: "Dal Lake High School", area: "Srinagar", address: "Boulevard Rd, Srinagar 190001", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 34.0837, lng: 74.7973 },
  { name: "Jammu University Booth", area: "Jammu", address: "Gujjar Nagar, Jammu 180006", hours: "7:00 AM – 6:00 PM", type: "early", accessible: true, lat: 32.7266, lng: 74.8570 },

  // GOA
  { name: "Panjim Church School", area: "Panaji", address: "Altinho, Panaji 403001", hours: "7:00 AM – 6:00 PM", type: "election_day", accessible: true, lat: 15.4909, lng: 73.8278 }
];

// Generate some semi-random points for smaller towns to fill the map
const states = [
  { name: "MP", lat: 23.5, lng: 78.0 }, { name: "UP", lat: 27.0, lng: 81.0 },
  { name: "MH", lat: 19.5, lng: 75.5 }, { name: "RJ", lat: 26.5, lng: 73.5 },
  { name: "AP", lat: 15.5, lng: 79.5 }, { name: "TN", lat: 11.0, lng: 78.5 },
  { name: "KA", lat: 14.5, lng: 76.5 }, { name: "GJ", lat: 22.5, lng: 71.5 },
  { name: "OD", lat: 20.5, lng: 84.5 }, { name: "BR", lat: 25.5, lng: 86.5 }
];

states.forEach(s => {
  for(let i=1; i<=15; i++) {
    stations.push({
      name: `${s.name} Rural Booth #${i}`,
      area: "District Town",
      address: `Village Road, Block ${i}, ${s.name}`,
      hours: "7:00 AM – 6:00 PM",
      type: i % 4 === 0 ? "early" : "election_day",
      accessible: i % 2 === 0,
      lat: s.lat + (Math.random() - 0.5) * 2,
      lng: s.lng + (Math.random() - 0.5) * 2
    });
  }
});
