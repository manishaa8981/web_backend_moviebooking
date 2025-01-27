const Hall = require("../model/Hall");

// const createHall = async () => {
//   try {
//     const newHall = new Hall({
//       hall_name: "Hall A",
//       capacity: 30,
//       price: 100,
//       rows: 3,
//       seats_per_row: 10,
//       movieId: "64fdd21e1e0e2c1a7c8b4567", // Example movie ID
//     });

//     await newHall.save();
//     console.log("Hall created:", newHall);
//   } catch (error) {
//     console.error("Error creating hall:", error);
//   }
// };

const findAll = async (req, res) => {
  try {
    const halls = await Hall.find();
    res.status(200).json(halls);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Failed to fetch halls", details: e.message });
  }
};

const save = async (req, res) => {
  try {
    const { hall_name, price, rows, seats_per_row, movieId } = req.body;

    // Validate input
    if (!hall_name || !price || !rows || !seats_per_row || !movieId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new hall
    const newHall = new Hall({
      hall_name,
      price,
      rows,
      seats_per_row,
      movieId,
    });

    await newHall.save();
    res
      .status(201)
      .json({ message: "Hall created successfully", hall: newHall });
  } catch (error) {
    console.error("Error creating hall:", error);
    res
      .status(500)
      .json({ error: "Failed to create hall", details: error.message });
  }
};

const findById = async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);

    if (!hall) {
      return res.status(404).json({ error: "Hall not found" });
    }

    res.status(200).json(hall);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch hall", details: e.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const hall = await Hall.findByIdAndDelete(req.params.id);

    if (!hall) {
      return res.status(404).json({ error: "Hall not found" });
    }

    res.status(200).json({ message: "Hall deleted successfully" });
  } catch (e) {
    res
      .status(500)
      .json({ error: "Failed to delete hall", details: e.message });
  }
};

const update = async (req, res) => {
  try {
    const { hall_name, capacity, price, rows, seats_per_row, movieId } =
      req.body;

    const hall = await Hall.findById(req.params.id);
    if (!hall) return res.status(404).json({ message: "Hall not found" });

    hall.hall_name = hall_name;
    hall.capacity = capacity;
    hall.price = price;
    hall.rows = rows;
    hall.seats_per_row = seats_per_row;
    hall.movieId = movieId;

    await hall.save();
    res.status(200).json(hall);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// const update = async (req, res) => {
//   try {
//     const hall = await Hall.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true, // Ensure validations are run during update
//     });

//     if (!hall) {
//       return res.status(404).json({ error: "Hall not found" });
//     }

//     // Send the updated hall and success message in one response
//     res.status(200).json({ message: "Hall updated successfully", hall });
//   } catch (e) {
//     res
//       .status(500)
//       .json({ error: "Failed to update hall", details: e.message });
//   }
// };

module.exports = { findAll, save, findById, deleteById, update };
