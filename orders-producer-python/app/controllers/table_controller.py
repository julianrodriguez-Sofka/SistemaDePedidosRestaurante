from fastapi import APIRouter, HTTPException
from app.services.table_service import set_table_cleaning_with_timer
import asyncio

router = APIRouter(prefix="/api/tables", tags=["tables"])

@router.post("/{table_number}/cleaning")
async def trigger_table_cleaning(table_number: str):
    """
    Activa el timer de limpieza para una mesa.
    La mesa pasará a estado 'cleaning' por 30 segundos y luego a 'available'.
    """
    try:
        # Ejecutar el timer de limpieza en background
        asyncio.create_task(set_table_cleaning_with_timer(table_number))
        return {"success": True, "message": f"Timer de limpieza activado para mesa {table_number}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
