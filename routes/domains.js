import * as areasDao from "../models/areas/dao.js";
import * as categoriesDao from "../models/categories/dao.js";

export const getAreas = async (req, res) => {
  try {
    const areas = await areasDao.getAreas();
    res.json(areas);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await categoriesDao.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

function DomainRoutes(app) {
  app.get("/api/domains/areas", getAreas);
  app.get("/api/domains/categories", getCategories);
}

export default DomainRoutes;
