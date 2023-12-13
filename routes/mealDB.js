import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const MEAL_API = process.env.MEAL_API;

function MealRoutes(app) {
  const getMealById = async (req, res) => {
    const id = req.params.id;
    try {
      const response = await axios.get(`${MEAL_API}/lookup.php?i=${id}`);
      res.json(response.data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const getMealByName = async (req, res) => {
    const name = req.params.name;
    try {
      const response = await axios.get(`${MEAL_API}/search.php?s=${name}`);
      res.json(response.data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const getMealByFirstLetter = async (req, res) => {
    const letter = req.params.letter;
    try {
      const response = await axios.get(`${MEAL_API}/search.php?f=${letter}`);
      res.json(response.data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const getRandomMeal = async (req, res) => {
    console.log("getRandomMeal");
    try {
      const response = await axios.get(`${MEAL_API}/random.php`);
      res.json(response.data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const getMealCategories = async (req, res) => {
    try {
      const response = await axios.get(`${MEAL_API}/categories.php`);
      res.json(response.data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const filterByCategory = async (req, res) => {
    const category = req.params.category;
    try {
      const response = await axios.get(`${MEAL_API}/filter.php?c=${category}`);
      res.json(response.data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const getRandomTenMeals = async (req, res) => {
    try {
      let meals = { meals: [] };
      for (let i = 0; i < 10; i++) {
        const response = await axios.get(`${MEAL_API}/random.php`);
        meals.meals[i] = response.data.meals[0];
      }
      res.json(meals);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const getAreas = async (req, res) => {
    try {
      const response = await axios.get(`${MEAL_API}/list.php?a=list`);
      res.json(response.data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  app.get("/api/meal/name/:name", getMealByName);
  app.get("/api/meal/letter/:letter", getMealByFirstLetter);
  app.get("/api/meal/random", getRandomMeal);
  app.get("/api/categories", getMealCategories);
  app.get("/api/areas", getAreas);
  app.get("/api/filter/:category", filterByCategory);
  app.get("/api/meal/randomten", getRandomTenMeals);
  app.get("/api/meal/:id", getMealById);
}

export default MealRoutes;
