import { Request, Response } from 'express';
import { PlantModel } from '../models/plant-model';

export class PlantController {
    // Mostrar todas
    static getAllPlants = (req: Request, res: Response) => {
        const plants = PlantModel.getAll();
        res.json(plants);
    };

    // Mostrar por ID
    static getPlantById = (req: Request, res: Response) => {
        const plant = PlantModel.getById(req.params.id as string);
        if (!plant) return res.status(404).json({ message: "Planta no encontrada" });
        res.json(plant);
    };

    // Filtrar por dificultad (Fácil, Media, Difícil)
    static getByDifficulty = (req: Request, res: Response) => {
        const { level } = req.params;
        const plants = PlantModel.getByDifficulty(level as any);
        res.json(plants);
    };

    // Verificar si se puede plantar hoy (Lógica estacional)
    static checkSeason = (req: Request, res: Response) => {
        const { id } = req.params;
        const can = PlantModel.canBePlanted(id as string);
        const plant = PlantModel.getById(id as string);
        
        if (can) {
            res.json({ message: `¡Sí! Estamos en temporada de ${plant?.nombre}` });
        } else {
            res.json({ message: `No es el mejor momento para ${plant?.nombre}. Revisa el catálogo.` });
        }
    };

    // MÉTODOS DE ADMIN
    // Crear una planta
    static createPlant = (req: Request, res: Response) => {
        const newPlant = PlantModel.create(req.body);
        res.status(201).json(newPlant);
    };

    // Actualizar datos de una planta
    static updatePlant = (req: Request, res: Response) => {
        const updated = PlantModel.update(req.params.id as string, req.body);
        if (!updated) return res.status(404).json({ message: "No se encontró la planta" });
        res.json({ message: "Planta actualizada", plant: updated });
    };

    // Eliminar una planta
    static deletePlant = (req: Request, res: Response) => {
        const deleted = PlantModel.delete(req.params.id as string);
        if (!deleted) return res.status(404).json({ message: "No se pudo eliminar" });
        res.json({ message: "Eliminada del catálogo" });
    };
}