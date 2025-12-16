import pika
import json
from typing import Dict, Any
from src.config.settings import settings

class RabbitMQPublisher:
    def __init__(self):
        self.connection = None
        self.channel = None
    
    def connect(self):
        """Conectar a RabbitMQ"""
        try:
            self.connection = pika.BlockingConnection(
                pika.URLParameters(settings.cloudamqp_url)
            )
            self.channel = self.connection.channel()
            
            # Declarar exchanges
            self.channel.exchange_declare(
                exchange='product_events',
                exchange_type='fanout',
                durable=True
            )
            print("✅ Connected to RabbitMQ for publishing")
        except Exception as e:
            print(f"❌ Error connecting to RabbitMQ: {e}")
    
    def publish_product_event(self, event_type: str, product_data: Dict[str, Any]):
        """Publicar evento de producto"""
        if not self.channel:
            self.connect()
        
        try:
            message = {
                "event_type": event_type,  # "product.created", "product.updated", "product.deleted"
                "data": product_data
            }
            
            self.channel.basic_publish(
                exchange='product_events',
                routing_key='',
                body=json.dumps(message),
                properties=pika.BasicProperties(
                    delivery_mode=2,  # Persistente
                    content_type='application/json'
                )
            )
            print(f"✅ Event published: {event_type}")
        except Exception as e:
            print(f"❌ Error publishing event: {e}")
            self.connect()  # Reconectar
    
    def close(self):
        """Cerrar conexión"""
        if self.connection and not self.connection.is_closed:
            self.connection.close()
            print("✅ RabbitMQ connection closed")

# Instancia global
rabbitmq_publisher = RabbitMQPublisher()
