import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const MEAL_API = process.env.MEAL_API;

const transformMealData = (meals) => {
    const transformedMeals = meals.map((meal) => {
        const transformedMeal = {
            _id: meal.idMeal,
            strMeal: meal.strMeal,
            //strDrinkAlternate: meal.strDrinkAlternate,
            strCategory: meal.strCategory,
            strArea: meal.strArea,
            strInstructions: meal.strInstructions,
            strMealThumb: meal.strMealThumb,
            //strTags: meal.strTags,
            strYoutube: meal.strYoutube,
            //strSource: meal.strSource,
            //strImageSource: meal.strImageSource,
            //strCreativeCommonsConfirmed: meal.strCreativeCommonsConfirmed,
            //dateModified: meal.dateModified,
            postedTime: Date(2023, 10, 5, 5, 5, 5, 5),
            ingredients: [],
            measures: [],
            approved: true,
            userId: {
                "_id": "mealDB",
                "username": "mealDB",
                "firstName": "MealDB",
                "lastName": "API"
            },
            source: "external",
        };

        // Combine ingredients and measures into respective arrays
        //console.log(meal);
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

            if ((ingredient !== "" && ingredient !== " " && ingredient !== null)) {
                transformedMeal.ingredients.push(ingredient);
                transformedMeal.measures.push(measure);
            }
        }

        return transformedMeal;
    });

    return transformedMeals;
};

async function fetchMealDetails(mealId) {
    const response = await axios.get(`${MEAL_API}/lookup.php?i=${mealId}`);
    return response.data.meals[0];
}

async function fetchRecipeFromIdArray(meals) {
    const newArray = [];
    for (const meal of meals) {
        const mealId = meal.idMeal;
        const mealDetails = await fetchMealDetails(mealId);
        //console.log(mealDetails);
        newArray.push(mealDetails);
    }
    return newArray;
}

export const getMealById = async (id) => {
    try {
        //console.log(`${MEAL_API}/lookup.php?i=${id}`);
        const response = await axios.get(`${MEAL_API}/lookup.php?i=${id}`);
        if (!response.data.meals) { return [] };
        return transformMealData(response.data.meals);
    } catch (err) {
        return { message: "error" };
    }
};

export const getMealByName = async (name) => {
    try {
        const response = await axios.get(`${MEAL_API}/search.php?s=${name}`);
        if (!response.data.meals) { return [] };
        return transformMealData(response.data.meals);
    } catch (err) {
        return { message: "error" };
    }
};

export const getMealByFirstLetter = async (letter) => {
    try {
        const response = await axios.get(`${MEAL_API}/search.php?f=${letter}`);
        if (!response.data.meals) { return [] };
        return transformMealData(response.data.meals);
    } catch (err) {
        return { message: err.message };
    }
};

export const getRandomMeal = async () => {
    console.log("getRandomMeal");
    try {
        const response = await axios.get(`${MEAL_API}/random.php`);
        if (!response.data.meals) { return [] };
        return transformMealData(response.data.meals);
    } catch (err) {
        return { message: err.message };
    }
};

export const getMealCategories = async () => {
    try {
        const response = await axios.get(`${MEAL_API}/categories.php`);
        if (!response.data.meals) { return [] };
        return transformMealData(response.data.meals);
    } catch (err) {
        return { message: err.message };
    }
};

export const filterByCategory = async (category) => {
    try {
        const response = await axios.get(`${MEAL_API}/filter.php?c=${category}`);
        if (!response.data.meals) { return [] };
        const results = await fetchRecipeFromIdArray(response.data.meals);
        return transformMealData(results);
    } catch (err) {
        return { message: err.message };
    }
};

export const filterByArea = async (area) => {
    try {
        const response = await axios.get(`${MEAL_API}/filter.php?a=${area}`);
        if (!response.data.meals) { return [] };
        const results = await fetchRecipeFromIdArray(response.data.meals);
        //console.log(transformMealData(results))
        return transformMealData(results);
    } catch (err) {
        return { message: err.message };
    }
};

export const getRandomTenMeals = async () => {
    try {
        let meals = { meals: [] };
        for (let i = 0; i < 10; i++) {
            const response = await axios.get(`${MEAL_API}/random.php`);
            meals.meals[i] = response.data.meals.meals[0];
        }
        return transformMealData(meals);
    } catch (err) {
        return { message: err.message };
    }
};

// our APi
