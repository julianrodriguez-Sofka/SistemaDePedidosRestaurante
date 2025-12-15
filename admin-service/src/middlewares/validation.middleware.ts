import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para validar datos de productos según HU-004
 */
export const validateProduct = (req: Request, res: Response, next: NextFunction): void => {
  const { name, price, category } = req.body;

  // Validar nombre
  if (!name || typeof name !== 'string' || name.trim() === '') {
    res.status(400).json({
      success: false,
      message: 'El nombre del producto es obligatorio y debe ser una cadena de texto.'
    });
    return;
  }

  // Validar precio - HU-004 Criterio 2
  if (price === undefined || price === null) {
    res.status(400).json({
      success: false,
      message: 'El precio es obligatorio. Debe proporcionar un valor numérico positivo.'
    });
    return;
  }

  if (typeof price !== 'number' || isNaN(price)) {
    res.status(400).json({
      success: false,
      message: 'El precio debe ser un valor numérico positivo.'
    });
    return;
  }

  if (price <= 0) {
    res.status(400).json({
      success: false,
      message: 'El precio debe ser un valor numérico positivo mayor que 0.'
    });
    return;
  }

  // Validar categoría
  if (!category || typeof category !== 'string' || category.trim() === '') {
    res.status(400).json({
      success: false,
      message: 'La categoría es obligatoria.'
    });
    return;
  }

  next();
};

/**
 * Middleware para validar actualizaciones de productos
 */
export const validateProductUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { price, name, category } = req.body;

  // Si se proporciona nombre, validarlo
  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    res.status(400).json({
      success: false,
      message: 'El nombre del producto debe ser una cadena de texto válida.'
    });
    return;
  }

  // Si se proporciona precio, validarlo - HU-004 Criterio 3
  if (price !== undefined) {
    if (typeof price !== 'number' || isNaN(price)) {
      res.status(400).json({
        success: false,
        message: 'El precio debe ser un valor numérico positivo.'
      });
      return;
    }

    if (price <= 0) {
      res.status(400).json({
        success: false,
        message: 'El precio debe ser un valor numérico positivo mayor que 0.'
      });
      return;
    }
  }

  // Si se proporciona categoría, validarla
  if (category !== undefined && (typeof category !== 'string' || category.trim() === '')) {
    res.status(400).json({
      success: false,
      message: 'La categoría debe ser una cadena de texto válida.'
    });
    return;
  }

  next();
};
