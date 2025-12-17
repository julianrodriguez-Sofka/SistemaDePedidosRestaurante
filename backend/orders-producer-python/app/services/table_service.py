import httpx
import asyncio
from typing import Optional

ADMIN_SERVICE_URL = "http://admin-service:4000/api"

async def update_table_status(table_number: str, status: str, order_id: Optional[str] = None):
    """
    Actualiza el estado de una mesa en el servicio de administración
    Estados: 'available', 'occupied', 'reserved', 'cleaning'
    """
    try:
        # Extraer el número de mesa (puede venir como "Table 1" o "1")
        table_num = ''.join(filter(str.isdigit, table_number))
        if not table_num:
            print(f"[TableService] ⚠️ No se pudo extraer número de mesa de: {table_number}")
            return
        
        async with httpx.AsyncClient(timeout=5.0) as client:
            # Primero obtener la mesa por su número
            response = await client.get(f"{ADMIN_SERVICE_URL}/tables")
            if response.status_code == 200:
                data = response.json()
                tables = data.get('data', [])
                
                # Buscar la mesa por número
                table = next((t for t in tables if str(t.get('number')) == table_num), None)
                
                if not table:
                    print(f"[TableService] ⚠️ Mesa {table_num} no encontrada")
                    return
                
                table_id = table.get('_id') or table.get('id')
                
                # Actualizar el estado de la mesa usando endpoint interno
                update_data = {"status": status}
                if order_id:
                    update_data["currentOrder"] = order_id
                elif status == 'available':
                    update_data["currentOrder"] = None
                
                response = await client.put(
                    f"{ADMIN_SERVICE_URL}/tables/internal/{table_id}/status",
                    json=update_data
                )
                
                if response.status_code == 200:
                    print(f"[TableService] ✅ Mesa {table_num} actualizada a estado: {status}")
                else:
                    print(f"[TableService] ❌ Error actualizando mesa: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"[TableService] ❌ Error: {str(e)}")

async def set_table_cleaning_with_timer(table_number: str):
    """
    Marca la mesa como limpieza y después de 30 segundos la marca como disponible
    """
    try:
        # Cambiar a limpieza
        await update_table_status(table_number, 'cleaning')
        
        # Esperar 30 segundos
        await asyncio.sleep(30)
        
        # Cambiar a disponible
        await update_table_status(table_number, 'available')
        
        print(f"[TableService] ✅ Mesa {table_number} ahora disponible después de limpieza")
    except Exception as e:
        print(f"[TableService] ❌ Error en timer de limpieza: {str(e)}")
